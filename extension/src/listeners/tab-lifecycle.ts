import type { ListenerRegistry } from './index.js';

export interface LifecycleEventOutput {
  listenerKey: string;
  type: 'stopped' | 'paused';
  reason: 'tab-closed' | 'browser-closed' | 'page-navigated';
  tabId: number;
  timestamp: number;
}

/**
 * Listens to Chrome tab/window lifecycle events and emits per-listener
 * stopped/paused messages when the host tab of an active listener closes
 * or navigates. `emit` is called for every listener key bound to that tab.
 */
export class TabLifecycleMonitor {
  constructor(
    private readonly registry: ListenerRegistry,
    private readonly emit: (event: LifecycleEventOutput) => void,
  ) {
    chrome.tabs.onRemoved.addListener((tabId) => this.handleRemoved(tabId));
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.status === 'loading') this.handleNavigated(tabId);
    });
    chrome.windows.onRemoved.addListener(() => this.handleWindowClosed());
  }

  private handleRemoved(tabId: number): void {
    const keys = this.registry.findByTabId(tabId);
    for (const listenerKey of keys) {
      this.registry.delete(listenerKey);
      this.emit({
        listenerKey,
        type: 'stopped',
        reason: 'tab-closed',
        tabId,
        timestamp: Date.now(),
      });
    }
  }

  private handleNavigated(tabId: number): void {
    const keys = this.registry.findByTabId(tabId);
    for (const listenerKey of keys) {
      this.emit({
        listenerKey,
        type: 'paused',
        reason: 'page-navigated',
        tabId,
        timestamp: Date.now(),
      });
    }
  }

  private handleWindowClosed(): void {
    for (const listenerKey of this.registry.keys()) {
      const entry = this.registry.get(listenerKey);
      this.registry.delete(listenerKey);
      this.emit({
        listenerKey,
        type: 'stopped',
        reason: 'browser-closed',
        tabId: entry?.tabId ?? -1,
        timestamp: Date.now(),
      });
    }
  }
}