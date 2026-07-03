import type { ListenerState } from './types.js';

/**
 * In-daemon registry of active listeners. Deduplication is enforced by
 * keying on `${site}/${adapter}:${listenerId}`: at most one non-stopped
 * entry per key may exist. Concurrent starts of the same key are caught
 * by checking `exists()` before creating a new state.
 */
export class ListenerManager {
  private states = new Map<string, ListenerState>();

  isActive(state: ListenerState | undefined): state is ListenerState {
    return !!state && (state.status === 'starting' || state.status === 'running');
  }

  exists(site: string, adapter: string, listenerId: string): boolean {
    return this.isActive(this.get(site, adapter, listenerId));
  }

  get(site: string, adapter: string, listenerId: string): ListenerState | undefined {
    return this.states.get(this.key(site, adapter, listenerId));
  }

  register(state: ListenerState): void {
    this.states.set(state.key, state);
  }

  update(site: string, adapter: string, listenerId: string, updates: Partial<ListenerState>): void {
    const key = this.key(site, adapter, listenerId);
    const existing = this.states.get(key);
    if (existing) this.states.set(key, { ...existing, ...updates });
  }

  remove(site: string, adapter: string, listenerId: string): void {
    this.states.delete(this.key(site, adapter, listenerId));
  }

  listActive(): ListenerState[] {
    return [...this.states.values()].filter((s) => this.isActive(s));
  }

  listAll(): ListenerState[] {
    return [...this.states.values()];
  }

  key(site: string, adapter: string, listenerId: string): string {
    return `${site}/${adapter}:${listenerId}`;
  }
}
