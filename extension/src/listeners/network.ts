/**
 * Network listener: uses chrome.debugger + CDP Network domain to intercept
 * responses whose URL matches `pattern`, fetch the body, and emit a
 * `listener-event` to the daemon (over the existing WS).
 *
 * We reuse chrome.debugger (already used by the extension) rather than
 * chrome.webRequest because webRequest cannot read response bodies; CDP's
 * Network.getResponseBody can.
 */

export function matchesPattern(url: string, pattern: string): boolean {
  if (!pattern) return true;
  return url.includes(pattern);
}

export function extractJsonData(body: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export interface NetworkListenerHandle {
  tabId: number;
  pattern: string;
  listenerKey: string;
  adapterKey: string;
  listenerId: string;
}

/**
 * Attach a debugger to the tab, enable the Network domain, and subscribe to
 * responseReceived + loadingFinished events. Returns a handle the dispatcher
 * uses to detach on stop / tab close.
 *
 * `emit` is the callback that pushes a ListenerEvent to the daemon.
 */
export async function startNetworkListener(
  handle: NetworkListenerHandle,
  emit: (event: { type: 'data'; data: unknown }) => void,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    chrome.debugger.attach({ tabId: handle.tabId }, '1.3', () => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve();
    });
  });

  await new Promise<void>((resolve, reject) => {
    chrome.debugger.sendCommand({ tabId: handle.tabId }, 'Network.enable', {}, () => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve();
    });
  });

  const pendingRequests = new Map<string, { url: string; method: string }>();

  const onResponseReceived = (source: chrome.debugger.Debuggee, method: string, params: { requestId: string; response?: { url?: string; status?: number; mimeType?: string }; request?: { url?: string; method?: string } }): void => {
    if (source.tabId !== handle.tabId) return;
    const url = params.response?.url ?? params.request?.url ?? '';
    if (!matchesPattern(url, handle.pattern)) return;
    pendingRequests.set(params.requestId, { url, method: params.request?.method ?? '' });
  };

  const onLoadingFinished = async (source: chrome.debugger.Debuggee, method: string, params: { requestId: string }): Promise<void> => {
    if (source.tabId !== handle.tabId) return;
    const pending = pendingRequests.get(params.requestId);
    if (!pending) return;
    pendingRequests.delete(params.requestId);
    try {
      await new Promise<void>((resolve) => {
        chrome.debugger.sendCommand(
          { tabId: handle.tabId },
          'Network.getResponseBody',
          { requestId: params.requestId },
          (bodyResult: { body?: string; base64Encoded?: boolean } | undefined) => {
            if (chrome.runtime.lastError || !bodyResult || bodyResult.base64Encoded) {
              resolve();
              return;
            }
            const parsed = extractJsonData(bodyResult.body ?? '');
            if (parsed) {
              emit({ type: 'data', data: { url: pending.url, method: pending.method, body: parsed } });
            }
            resolve();
          },
        );
      });
    } catch {
      // ignore body fetch failures
    }
  };

  const onEvent = (source: chrome.debugger.Debuggee, method: string, params?: Object): void => {
    if (source.tabId !== handle.tabId) return;
    if (method === 'Network.responseReceived') {
      onResponseReceived(source, method, params as unknown as { requestId: string; response?: { url?: string; status?: number; mimeType?: string }; request?: { url?: string; method?: string } });
    } else if (method === 'Network.loadingFinished') {
      void onLoadingFinished(source, method, params as unknown as { requestId: string });
    }
  };

  chrome.debugger.onEvent.addListener(onEvent);
  // Store the listener function on the handle for cleanup
  (handle as NetworkListenerHandle & { _cleanup?: () => void })._cleanup = () => {
    chrome.debugger.onEvent.removeListener(onEvent);
    chrome.debugger.detach({ tabId: handle.tabId }, () => {});
  };
}

export function stopNetworkListener(handle: NetworkListenerHandle & { _cleanup?: () => void }): void {
  handle._cleanup?.();
}