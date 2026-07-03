import { describe, it, expect } from 'vitest';
import { ListenerManager } from './listener-manager.js';
import type { ListenerState } from './types.js';

function baseState(listenerId = 'lnr1', status: ListenerState['status'] = 'starting'): ListenerState {
  return {
    key: 'site/adapter:' + listenerId,
    site: 'site',
    adapter: 'adapter',
    listenerId,
    source: 'network',
    pattern: 'comment/info',
    status,
    createdAt: 1000,
    eventCount: 0,
  };
}

describe('ListenerManager', () => {
  it('isActive returns true only for starting/running', () => {
    const mgr = new ListenerManager();
    expect(mgr.isActive(baseState('a', 'starting'))).toBe(true);
    expect(mgr.isActive(baseState('a', 'running'))).toBe(true);
    expect(mgr.isActive(baseState('a', 'paused'))).toBe(false);
    expect(mgr.isActive(baseState('a', 'stopped'))).toBe(false);
  });

  it('exists checks active state by key', () => {
    const mgr = new ListenerManager();
    mgr.register(baseState('a', 'running'));
    expect(mgr.exists('site', 'adapter', 'a')).toBe(true);
    expect(mgr.exists('site', 'adapter', 'b')).toBe(false);
  });

  it('register replaces existing state', () => {
    const mgr = new ListenerManager();
    mgr.register(baseState('a', 'starting'));
    mgr.register({ ...baseState('a', 'running'), createdAt: 2000 });
    expect(mgr.get('site', 'adapter', 'a')?.status).toBe('running');
    expect(mgr.get('site', 'adapter', 'a')?.createdAt).toBe(2000);
  });

  it('update merges fields', () => {
    const mgr = new ListenerManager();
    mgr.register(baseState('a', 'running'));
    mgr.update('site', 'adapter', 'a', { lastEventAt: 5000, eventCount: 3, status: 'paused' });
    const s = mgr.get('site', 'adapter', 'a');
    expect(s?.status).toBe('paused');
    expect(s?.lastEventAt).toBe(5000);
    expect(s?.eventCount).toBe(3);
  });

  it('remove deletes the entry', () => {
    const mgr = new ListenerManager();
    mgr.register(baseState('a', 'running'));
    mgr.remove('site', 'adapter', 'a');
    expect(mgr.get('site', 'adapter', 'a')).toBeUndefined();
  });

  it('listActive returns only starting/running entries', () => {
    const mgr = new ListenerManager();
    mgr.register(baseState('a', 'running'));
    mgr.register(baseState('b', 'paused'));
    mgr.register(baseState('c', 'stopped'));
    expect(mgr.listActive().map(s => s.listenerId).sort()).toEqual(['a']);
  });

  it('listAll returns every registered entry', () => {
    const mgr = new ListenerManager();
    mgr.register(baseState('a', 'running'));
    mgr.register(baseState('b', 'stopped'));
    expect(mgr.listAll().length).toBe(2);
  });
});
