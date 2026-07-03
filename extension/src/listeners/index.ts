export type ListenerKind = 'network' | 'dom' | 'tab-lifecycle';

export interface ActiveListener {
  kind: ListenerKind;
  tabId: number;
  /** DOM listeners track a MutationObserver handle id; network listeners track a debugger-attached flag. */
  handleId?: number;
}

/**
 * Per-extension-process registry of active listeners. Keyed by listenerKey
 * (`site/adapter:listenerId`). Used to dedup starts, dispatch stops, and
 * clean up when a tab closes.
 */
export class ListenerRegistry {
  private map = new Map<string, ActiveListener>();

  set(key: string, value: ActiveListener): void {
    this.map.set(key, value);
  }
  get(key: string): ActiveListener | undefined {
    return this.map.get(key);
  }
  has(key: string): boolean {
    return this.map.has(key);
  }
  delete(key: string): void {
    this.map.delete(key);
  }
  keys(): string[] {
    return [...this.map.keys()];
  }
  findByTabId(tabId: number): string[] {
    return [...this.map.entries()].filter(([, v]) => v.tabId === tabId).map(([k]) => k);
  }
}