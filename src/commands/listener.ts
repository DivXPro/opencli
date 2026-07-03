/**
 * CLI commands for realtime listener management:
 *   opencli listener start   — start a realtime listener
 *   opencli listener stop    — stop a running listener
 *   opencli listener list    — list active listeners
 *   opencli listener status  — show all listener states
 *   opencli listener history — print buffered events as JSONL
 *   opencli listener stream  — stream events as JSONL (SSE)
 *   opencli listener restart — stop then start a listener
 */

import {
  startListener,
  stopListener,
  getListenerStatus,
  getListenerHistory,
  streamListenerEvents,
} from '../browser/daemon-client.js';
import { log } from '../logger.js';

export function formatListenerRow(state: {
  key: string;
  site: string;
  adapter: string;
  listenerId: string;
  source: string;
  status: string;
  createdAt: number;
  eventCount: number;
  lastEventAt?: number;
}): string {
  const last = state.lastEventAt
    ? new Date(state.lastEventAt).toISOString().slice(11, 19)
    : '-';
  return `${state.key}\t${state.source}\t${state.status}\tevents=${state.eventCount}\tlast=${last}`;
}

export interface StartArgs {
  site: string;
  adapter: string;
  listenerId: string;
  source: 'network' | 'dom' | 'cdp' | 'console';
  pattern?: string;
  selector?: string;
  url?: string;
}

export async function listenerStart(args: StartArgs): Promise<void> {
  if (!args.url) throw new Error('--url is required (the page the listener observes)');
  const res = await startListener({
    site: args.site,
    adapter: args.adapter,
    listenerId: args.listenerId,
    source: args.source,
    pattern: args.pattern,
    selector: args.selector,
    url: args.url,
  });
  if (res.status === 'already-running') {
    log.warn(`Listener ${args.site}/${args.adapter}:${args.listenerId} already running.`);
  } else {
    log.success(`Listener ${args.site}/${args.adapter}:${args.listenerId} starting.`);
  }
}

export async function listenerStop(
  site: string,
  adapter: string,
  listenerId: string,
): Promise<void> {
  await stopListener({ site, adapter, listenerId });
  log.success(`Listener ${site}/${adapter}:${listenerId} stopped.`);
}

export async function listenerList(): Promise<void> {
  const listeners = await getListenerStatus();
  if (!listeners.length) {
    console.log('No active listeners.');
    return;
  }
  for (const state of listeners) {
    console.log(formatListenerRow(state as Parameters<typeof formatListenerRow>[0]));
  }
}

export async function listenerStatus(): Promise<void> {
  const listeners = await getListenerStatus({ active: false });
  for (const state of listeners) {
    console.log(formatListenerRow(state as Parameters<typeof formatListenerRow>[0]));
  }
}

export async function listenerHistory(
  listenerId: string,
  sinceMs?: number,
): Promise<void> {
  const events = await getListenerHistory(listenerId, sinceMs);
  for (const e of events) {
    console.log(JSON.stringify(e));
  }
}

export async function listenerStream(listenerId: string): Promise<void> {
  for await (const event of streamListenerEvents(listenerId)) {
    console.log(JSON.stringify(event));
  }
}

export async function listenerRestart(args: StartArgs): Promise<void> {
  await stopListener({ site: args.site, adapter: args.adapter, listenerId: args.listenerId });
  await listenerStart(args);
}
