import { describe, it, expect, vi } from 'vitest';
import { EventBus } from './event-bus.js';
import type { ListenerEvent } from './types.js';

function makeEvent(type: ListenerEvent['type'] = 'data', listenerId = 'lnr1', data: unknown = { v: 1 }): ListenerEvent {
  return { listenerId, adapterKey: 'site/adapter', type, data, timestamp: Date.now() };
}

describe('EventBus', () => {
  it('buffers events per listenerId', () => {
    const bus = new EventBus(16);
    bus.publish(makeEvent('data', 'lnr1', { v: 1 }));
    bus.publish(makeEvent('data', 'lnr1', { v: 2 }));
    bus.publish(makeEvent('data', 'lnr2', { v: 3 }));
    expect(bus.history('lnr1').map(e => (e.data as { v: number }).v)).toEqual([1, 2]);
    expect(bus.history('lnr2').map(e => (e.data as { v: number }).v)).toEqual([3]);
  });

  it('caps the buffer at maxBufferSize', () => {
    const bus = new EventBus(2);
    bus.publish(makeEvent('data', 'lnr1', { v: 1 }));
    bus.publish(makeEvent('data', 'lnr1', { v: 2 }));
    bus.publish(makeEvent('data', 'lnr1', { v: 3 }));
    expect(bus.history('lnr1').length).toBe(2);
    expect((bus.history('lnr1')[0].data as { v: number }).v).toBe(2);
  });

  it('delivers only matching events to filtered subscribers', () => {
    const bus = new EventBus(16);
    const lnr1Calls: ListenerEvent[] = [];
    const allCalls: ListenerEvent[] = [];
    bus.subscribe('sub1', 'lnr1', (e) => lnr1Calls.push(e));
    bus.subscribe('sub2', undefined, (e) => allCalls.push(e));
    bus.publish(makeEvent('data', 'lnr1', { v: 1 }));
    bus.publish(makeEvent('data', 'lnr2', { v: 2 }));
    expect(lnr1Calls.length).toBe(1);
    expect(allCalls.length).toBe(2);
  });

  it('returns history since a timestamp', () => {
    const bus = new EventBus(16);
    bus.publish({ ...makeEvent('data', 'lnr1', { v: 1 }), timestamp: 1000 });
    bus.publish({ ...makeEvent('data', 'lnr1', { v: 2 }), timestamp: 2000 });
    bus.publish({ ...makeEvent('data', 'lnr1', { v: 3 }), timestamp: 3000 });
    const since = bus.history('lnr1', 1500);
    expect(since.map(e => (e.data as { v: number }).v)).toEqual([2, 3]);
  });

  it('unsubscribes by id', () => {
    const bus = new EventBus(16);
    const cb = vi.fn();
    bus.subscribe('sub1', undefined, cb);
    bus.unsubscribe('sub1');
    bus.publish(makeEvent('data'));
    expect(cb).not.toHaveBeenCalled();
  });

  it('clearHistory removes the buffered list for a listenerId', () => {
    const bus = new EventBus(16);
    bus.publish(makeEvent('data', 'lnr1', { v: 1 }));
    bus.clearHistory('lnr1');
    expect(bus.history('lnr1').length).toBe(0);
  });
});