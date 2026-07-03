import type { ListenerEvent } from './types.js';

export type EventCallback = (event: ListenerEvent) => void;

interface Subscription {
  id: string;
  listenerId: string | undefined; // undefined => all listeners
  callback: EventCallback;
}

/**
 * In-daemon event bus. Buffers events per listenerId and dispatches to
 * subscribers. One subscription may match a specific listenerId or all.
 * Buffer is a per-listenerId ring with a configurable max size.
 */
export class EventBus {
  private buffers = new Map<string, ListenerEvent[]>();
  private subscriptions = new Map<string, Subscription>();

  constructor(private readonly maxBufferSize: number = 1000) {}

  publish(event: ListenerEvent): void {
    const buffer = this.buffers.get(event.listenerId) ?? [];
    buffer.push(event);
    if (buffer.length > this.maxBufferSize) buffer.shift();
    this.buffers.set(event.listenerId, buffer);

    for (const sub of this.subscriptions.values()) {
      if (sub.listenerId !== undefined && sub.listenerId !== event.listenerId) continue;
      sub.callback(event);
    }
  }

  subscribe(id: string, listenerId: string | undefined, callback: EventCallback): void {
    this.subscriptions.set(id, { id, listenerId, callback });
  }

  unsubscribe(id: string): void {
    this.subscriptions.delete(id);
  }

  history(listenerId: string, since?: number): ListenerEvent[] {
    const buffer = this.buffers.get(listenerId) ?? [];
    if (since === undefined) return [...buffer];
    return buffer.filter((e) => e.timestamp > since);
  }

  clearHistory(listenerId: string): void {
    this.buffers.delete(listenerId);
  }

  activeSubscriptions(): number {
    return this.subscriptions.size;
  }
}
