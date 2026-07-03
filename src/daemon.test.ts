import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Readable } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { WebSocket } from 'ws';

import {
  COMMAND_RESULT_UNKNOWN_CODE,
  COMMAND_RESULT_UNKNOWN_HINT,
  buildCommandDispatchFailure,
  buildExtensionDisconnectFailure,
  commandResultUnknownMessage,
  getResponseCorsHeaders,
} from './daemon-utils.js';
import { __test } from './daemon.js';

const { handleRequest, listenerManager, eventBus, extensionProfiles } = __test;

// ─── Mock helpers ──────────────────────────────────────────────────────

function mockReq(opts: {
  method?: string;
  url?: string;
  body?: string;
  headers?: Record<string, string>;
} = {}): IncomingMessage {
  const stream = Readable.from(opts.body ? [Buffer.from(opts.body)] : []);
  return Object.assign(stream, {
    method: opts.method ?? 'GET',
    url: opts.url ?? '/',
    headers: {
      'x-opencli': '1',
      ...opts.headers,
    },
    destroy: vi.fn(),
  }) as unknown as IncomingMessage;
}

class MockResponse {
  statusCode = 200;
  headers: Record<string, string> = {};
  private chunks: string[] = [];
  private _writableEnded = false;

  get writableEnded(): boolean { return this._writableEnded; }

  writeHead(statusCode: number, headers?: Record<string, string>): this {
    this.statusCode = statusCode;
    if (headers) Object.assign(this.headers, headers);
    return this;
  }

  write(chunk: string, cb?: (error?: Error) => void): boolean {
    if (chunk) this.chunks.push(chunk);
    cb?.();
    return true;
  }

  end(chunk?: string, cb?: () => void): this {
    if (chunk) this.chunks.push(chunk);
    this._writableEnded = true;
    cb?.();
    return this;
  }

  body(): string { return this.chunks.join(''); }

  json(): Record<string, unknown> {
    try { return JSON.parse(this.body()); } catch { return {}; }
  }

  // SSE writes are captured in chunks for inspection
  sseFrames(): string[] {
    return this.body().split('\n\n').filter(Boolean);
  }
}

function mockExtensionConnection(contextId = '_test_'): WebSocket {
  const ws = {
    readyState: WebSocket.OPEN,
    send: vi.fn((_data: string, cb?: (err?: Error) => void) => cb?.()),
  } as unknown as WebSocket;
  extensionProfiles.set(contextId, {
    contextId,
    ws,
    extensionVersion: null,
    extensionCompatRange: null,
    lastSeenAt: Date.now(),
  });
  return ws;
}

// Helper: call handleRequest and return the parsed response
async function call(req: IncomingMessage, res: MockResponse): Promise<void> {
  await handleRequest(req, (res as unknown) as ServerResponse);
}

describe('getResponseCorsHeaders', () => {
  it('allows the Browser Bridge extension origin to read /ping', () => {
    expect(getResponseCorsHeaders('/ping', 'chrome-extension://abc123')).toEqual({
      'Access-Control-Allow-Origin': 'chrome-extension://abc123',
      Vary: 'Origin',
    });
  });

  it('does not add CORS headers for ordinary web origins', () => {
    expect(getResponseCorsHeaders('/ping', 'https://example.com')).toBeUndefined();
  });

  it('does not add CORS headers when origin is absent', () => {
    expect(getResponseCorsHeaders('/ping')).toBeUndefined();
  });

  it('does not add CORS headers for command endpoints even from the extension origin', () => {
    expect(getResponseCorsHeaders('/command', 'chrome-extension://abc123')).toBeUndefined();
  });
});

describe('daemon command dispatch', () => {
  it('uses a distinct command_result_unknown contract for ambiguous dispatched commands', () => {
    expect(COMMAND_RESULT_UNKNOWN_CODE).toBe('command_result_unknown');
    expect(commandResultUnknownMessage('navigate')).toContain('navigate command was dispatched');
    expect(COMMAND_RESULT_UNKNOWN_HINT).toContain('Inspect the browser/session state');
    expect(COMMAND_RESULT_UNKNOWN_HINT).toContain('Do not blindly retry write commands');
  });

  it('classifies dispatched extension disconnects as command_result_unknown', () => {
    expect(buildExtensionDisconnectFailure({
      contextId: 'work',
      action: 'navigate',
      dispatched: true,
    })).toEqual({
      message: 'Browser connection dropped after the navigate command was dispatched; it may have completed.',
      errorCode: 'command_result_unknown',
      errorHint: COMMAND_RESULT_UNKNOWN_HINT,
      status: 503,
      countAsCommandResultUnknown: true,
    });
  });

  it('classifies pre-dispatch extension disconnects as profile_disconnected', () => {
    expect(buildExtensionDisconnectFailure({
      contextId: 'work',
      action: 'navigate',
      dispatched: false,
    })).toMatchObject({
      message: 'Browser profile "work" disconnected before command dispatch',
      errorCode: 'profile_disconnected',
      status: 503,
      countAsCommandResultUnknown: false,
    });
  });

  it('classifies ws.send dispatch failures as profile_disconnected', () => {
    expect(buildCommandDispatchFailure('work')).toMatchObject({
      message: 'Browser profile "work" disconnected before command dispatch',
      errorCode: 'profile_disconnected',
      status: 503,
      countAsCommandResultUnknown: false,
    });
  });
});

// ─── Listener route integration tests ──────────────────────────────────

describe('POST /listener/start', () => {
  beforeEach(() => {
    for (const s of listenerManager.listAll()) {
      listenerManager.remove(s.site, s.adapter, s.listenerId);
    }
    extensionProfiles.clear();
  });

  it('returns 400 when required fields are missing', async () => {
    const req = mockReq({
      method: 'POST',
      url: '/listener/start',
      body: JSON.stringify({ site: 'x' }),
    });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.json().ok).toBe(false);
    expect(res.json().error).toContain('required');
  });

  it('returns 400 when body is not valid JSON', async () => {
    const req = mockReq({
      method: 'POST',
      url: '/listener/start',
      body: 'not-json',
    });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('returns 503 when no extension is connected', async () => {
    const req = mockReq({
      method: 'POST',
      url: '/listener/start',
      body: JSON.stringify({
        site: 'site', adapter: 'adapter', listenerId: 'lnr',
        source: 'network', url: 'https://x.com',
      }),
    });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(503);
    expect(res.json().ok).toBe(false);
    expect(res.json().errorCode).toBe('extension_not_connected');
  });

  it('returns 202 and registers state when successful', async () => {
    mockExtensionConnection('_test_');

    const req = mockReq({
      method: 'POST',
      url: '/listener/start',
      body: JSON.stringify({
        site: 'site', adapter: 'adapter', listenerId: 'lnr',
        source: 'network', url: 'https://x.com',
        contextId: '_test_',
      }),
    });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(202);
    expect(res.json().ok).toBe(true);
    expect(res.json().status).toBe('starting');
    expect(res.json().key).toBe('site/adapter:lnr');
    // State registered in ListenerManager
    expect(listenerManager.exists('site', 'adapter', 'lnr')).toBe(true);
  });

  it('returns 200 already-running when listener exists', async () => {
    mockExtensionConnection('_test_');

    // First start
    const req1 = mockReq({
      method: 'POST',
      url: '/listener/start',
      body: JSON.stringify({
        site: 'site', adapter: 'adapter', listenerId: 'lnr',
        source: 'network', url: 'https://x.com',
        contextId: '_test_',
      }),
    });
    await call(req1, new MockResponse());

    // Duplicate start
    const req2 = mockReq({
      method: 'POST',
      url: '/listener/start',
      body: JSON.stringify({
        site: 'site', adapter: 'adapter', listenerId: 'lnr',
        source: 'network', url: 'https://x.com',
        contextId: '_test_',
      }),
    });
    const res2 = new MockResponse();
    await call(req2, res2);
    expect(res2.statusCode).toBe(200);
    expect(res2.json().ok).toBe(true);
    expect(res2.json().status).toBe('already-running');
  });
});

describe('POST /listener/stop', () => {
  beforeEach(() => {
    for (const s of listenerManager.listAll()) {
      listenerManager.remove(s.site, s.adapter, s.listenerId);
    }
    extensionProfiles.clear();
  });

  it('returns 404 when listener is not found', async () => {
    const req = mockReq({
      method: 'POST',
      url: '/listener/stop',
      body: JSON.stringify({ site: 'x', adapter: 'y', listenerId: 'z' }),
    });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(404);
    expect(res.json().error).toBe('listener not found');
  });

  it('transitions state to stopped and returns 200', async () => {
    // Pre-register a listener (simulate an active listener)
    listenerManager.register({
      key: 's/adapter:lnr',
      site: 's',
      adapter: 'adapter',
      listenerId: 'lnr',
      source: 'network',
      status: 'running',
      createdAt: Date.now(),
      eventCount: 10,
    });

    const req = mockReq({
      method: 'POST',
      url: '/listener/stop',
      body: JSON.stringify({ site: 's', adapter: 'adapter', listenerId: 'lnr' }),
    });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.json().ok).toBe(true);
    expect(res.json().status).toBe('stopped');
    // State updated to stopped
    const state = listenerManager.get('s', 'adapter', 'lnr');
    expect(state?.status).toBe('stopped');
  });

  it('returns 400 when body is not valid JSON', async () => {
    const req = mockReq({
      method: 'POST',
      url: '/listener/stop',
      body: 'bad-json',
    });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /listener/status', () => {
  beforeEach(() => {
    for (const s of listenerManager.listAll()) {
      listenerManager.remove(s.site, s.adapter, s.listenerId);
    }
  });

  it('returns active listeners by default', async () => {
    listenerManager.register({
      key: 's/adapter:a', site: 's', adapter: 'adapter', listenerId: 'a',
      source: 'network', status: 'running', createdAt: 1000, eventCount: 1,
    });
    listenerManager.register({
      key: 's/adapter:b', site: 's', adapter: 'adapter', listenerId: 'b',
      source: 'dom', status: 'stopped', createdAt: 2000, eventCount: 0,
    });

    const req = mockReq({ url: '/listener/status' });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.json().ok).toBe(true);
    const listeners = res.json().listeners as unknown[];
    expect(listeners).toHaveLength(1);
    expect((listeners[0] as Record<string, unknown>).listenerId).toBe('a');
  });

  it('returns all listeners when active=0', async () => {
    listenerManager.register({
      key: 's/adapter:a', site: 's', adapter: 'adapter', listenerId: 'a',
      source: 'network', status: 'running', createdAt: 1000, eventCount: 1,
    });
    listenerManager.register({
      key: 's/adapter:b', site: 's', adapter: 'adapter', listenerId: 'b',
      source: 'dom', status: 'stopped', createdAt: 2000, eventCount: 0,
    });

    const req = mockReq({ url: '/listener/status?active=0' });
    const res = new MockResponse();
    await call(req, res);
    const listeners = res.json().listeners as unknown[];
    expect(listeners).toHaveLength(2);
  });
});

describe('GET /listener/history', () => {
  beforeEach(() => {
    eventBus.clearHistory('lnr1');
  });

  it('returns 400 when listenerId is missing', async () => {
    const req = mockReq({ url: '/listener/history' });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('listenerId required');
  });

  it('returns buffered events for a listenerId', async () => {
    eventBus.publish({
      listenerId: 'lnr1', adapterKey: 's/adapter', type: 'data',
      data: { v: 1 }, timestamp: 1000,
    });
    eventBus.publish({
      listenerId: 'lnr1', adapterKey: 's/adapter', type: 'data',
      data: { v: 2 }, timestamp: 2000,
    });

    const req = mockReq({ url: '/listener/history?listenerId=lnr1' });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.json().ok).toBe(true);
    const events = res.json().events as unknown[];
    expect(events).toHaveLength(2);
    expect((events[0] as Record<string, unknown>).data).toEqual({ v: 1 });
  });

  it('filters events by since parameter', async () => {
    eventBus.publish({
      listenerId: 'lnr1', adapterKey: 's/adapter', type: 'data',
      data: { v: 1 }, timestamp: 1000,
    });
    eventBus.publish({
      listenerId: 'lnr1', adapterKey: 's/adapter', type: 'data',
      data: { v: 2 }, timestamp: 2000,
    });
    eventBus.publish({
      listenerId: 'lnr1', adapterKey: 's/adapter', type: 'data',
      data: { v: 3 }, timestamp: 3000,
    });

    const req = mockReq({ url: '/listener/history?listenerId=lnr1&since=1500' });
    const res = new MockResponse();
    await call(req, res);
    const events = res.json().events as unknown[];
    expect(events).toHaveLength(2);
  });
});

describe('GET /listener/stream', () => {
  it('returns 400 when listenerId is missing', async () => {
    const req = mockReq({ url: '/listener/stream' });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('listenerId required');
  });

  it('sets SSE Content-Type and sends hello event', async () => {
    const req = mockReq({ url: '/listener/stream?listenerId=lnr1' });
    const res = new MockResponse();
    await call(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.headers['Content-Type']).toBe('text/event-stream');
    expect(res.headers['Cache-Control']).toBe('no-cache');
    expect(res.headers['Connection']).toBe('keep-alive');

    const frames = res.sseFrames();
    expect(frames.length).toBeGreaterThanOrEqual(1);
    // First frame should be the hello event
    const helloLine = frames[0];
    expect(helloLine).toContain('event: hello');
    expect(helloLine).toContain('subscriberId');
    expect(helloLine).toContain('listenerId');
  });

  it('delivers published events to the SSE subscriber', async () => {
    const req = mockReq({ url: '/listener/stream?listenerId=lnr1' });
    const res = new MockResponse();
    // Don't await — the SSE route keeps the connection open
    const handlerPromise = call(req, res);

    // Allow the handler to set up the connection
    await new Promise(r => setTimeout(r, 10));

    // Publish an event — it should be written to the SSE stream
    eventBus.publish({
      listenerId: 'lnr1', adapterKey: 's/adapter', type: 'data',
      data: { msg: 'hello world' }, timestamp: Date.now(),
    });

    // Signal close to stop the handler
    req.destroy();

    await handlerPromise;

    const frames = res.sseFrames();
    // Should have hello + at least one data frame
    const dataFrames = frames.filter(f => f.startsWith('data:'));
    expect(dataFrames.length).toBeGreaterThanOrEqual(1);
    const data = JSON.parse(dataFrames[0].slice(6));
    expect(data.data).toEqual({ msg: 'hello world' });
  });
});
