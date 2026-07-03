import { describe, it, expect } from 'vitest';
import { ListenerRegistry } from './index.js';

describe('ListenerRegistry', () => {
  it('tracks active listener keys', () => {
    const reg = new ListenerRegistry();
    reg.set('k1', { kind: 'network', tabId: 9 });
    expect(reg.has('k1')).toBe(true);
    expect(reg.get('k1')?.tabId).toBe(9);
  });

  it('delete removes the entry', () => {
    const reg = new ListenerRegistry();
    reg.set('k1', { kind: 'network', tabId: 9 });
    reg.delete('k1');
    expect(reg.has('k1')).toBe(false);
  });

  it('findByTabId returns keys bound to a tab', () => {
    const reg = new ListenerRegistry();
    reg.set('k1', { kind: 'network', tabId: 9 });
    reg.set('k2', { kind: 'dom', tabId: 9 });
    reg.set('k3', { kind: 'network', tabId: 7 });
    expect(reg.findByTabId(9).sort()).toEqual(['k1', 'k2']);
  });
});