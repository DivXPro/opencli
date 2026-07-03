/**
 * DOM listener: injects a MutationObserver into the page that watches
 * an element matched by `selector` and batches mutations in a window
 * function the service worker polls via CDP Runtime.evaluate.
 */

export interface DOMListenerHandle {
  tabId: number;
  selector: string;
  listenerKey: string;
  adapterKey: string;
  listenerId: string;
  /** Poll interval in ms. */
  intervalMs?: number;
}

export const DEFAULT_DOM_POLL_MS = 1000;

export function buildObserverInjection(
  selector: string,
  options: { childList?: boolean; subtree?: boolean; characterData?: boolean; attributes?: boolean } = {},
): string {
  const opts = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: false,
    ...options,
  };
  return `
(() => {
  if (window.__OPENCLI_DOM_LISTENER__) return;
  window.__OPENCLI_DOM_LISTENER__ = { queue: [] };
  const target = document.querySelector(${JSON.stringify(selector)});
  if (!target) return;
  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      window.__OPENCLI_DOM_LISTENER__.queue.push({
        type: m.type,
        timestamp: Date.now(),
        text: m.target && m.target.textContent ? m.target.textContent.slice(0, 500) : '',
        added: m.addedNodes ? m.addedNodes.length : 0,
        removed: m.removedNodes ? m.removedNodes.length : 0,
      });
      if (window.__OPENCLI_DOM_LISTENER__.queue.length > 200) window.__OPENCLI_DOM_LISTENER__.queue.shift();
    }
  });
  obs.observe(target, ${JSON.stringify(opts)});
  window.__OPENCLI_DOM_LISTENER__.drain = () => {
    const out = window.__OPENCLI_DOM_LISTENER__.queue;
    window.__OPENCLI_DOM_LISTENER__.queue = [];
    return out;
  };
})();
`;
}

export const DRAIN_EXPRESSION = `window.__OPENCLI_DOM_LISTENER__ && window.__OPENCLI_DOM_LISTENER__.drain ? window.__OPENCLI_DOM_LISTENER__.drain() : []`;