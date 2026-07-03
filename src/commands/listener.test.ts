import { describe, it, expect } from 'vitest';
import { formatListenerRow } from './listener.js';

describe('formatListenerRow', () => {
  it('formats an active listener row', () => {
    const row = formatListenerRow({
      key: 'buyin/live-products:comments',
      site: 'buyin',
      adapter: 'live-products',
      listenerId: 'comments',
      source: 'network',
      status: 'running',
      createdAt: 1700000000000,
      eventCount: 5,
      lastEventAt: 1700000005000,
    });
    expect(row).toContain('buyin/live-products:comments');
    expect(row).toContain('running');
    expect(row).toContain('5');
  });

  it('handles missing optional fields gracefully', () => {
    const row = formatListenerRow({
      key: 'x/y:z',
      site: 'x',
      adapter: 'y',
      listenerId: 'z',
      source: 'dom',
      status: 'starting',
      createdAt: 1700000000000,
      eventCount: 0,
    });
    expect(row).toContain('starting');
    expect(row).toContain('-');
  });
});
