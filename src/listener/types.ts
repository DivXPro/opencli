// src/listener/types.ts
/**
 * Shared types for the realtime listener subsystem.
 *
 * Imported by daemon (EventBus, ListenerManager), CLI (commands/listener),
 * and the Chrome extension (listeners/*). Keep this file dependency-free so
 * it can be imported from both the Node.js and bundler contexts.
 */

/** Listener observation source. */
export type ListenerSource = 'network' | 'dom' | 'cdp' | 'console';

/** Adapter manifest declaration of one listenable stream. */
export interface ListenerDeclaration {
  /** Stable id, unique within the adapter. Used as the routing key. */
  id: string;
  source: ListenerSource;
  /** For source=network: URL substring to match (e.g. "comment/info"). */
  pattern?: string;
  /** For source=dom: CSS selector to observe. */
  selector?: string;
  /** For source=dom: MutationObserver options override. */
  mutationOptions?: { childList?: boolean; subtree?: boolean; characterData?: boolean; attributes?: boolean };
  /** Human-readable description shown by `opencli listener list <site>`. */
  description?: string;
  /** Optional JSON-schema-ish hint of the emitted data shape (for docs only). */
  outputSchema?: Record<string, string>;
}

/** Runtime state of an active listener, held by ListenerManager. */
export interface ListenerState {
  /** `${site}/${adapter}:${listenerId}` */
  key: string;
  site: string;
  adapter: string;
  listenerId: string;
  source: ListenerSource;
  pattern?: string;
  selector?: string;
  status: 'starting' | 'running' | 'paused' | 'stopped';
  /** Chrome tabId hosting the listener (allocated by extension). */
  tabId?: number;
  /** Adapter target URL used to (re)open the tab. */
  url?: string;
  createdAt: number;
  /** Timestamp of the most recent event received. */
  lastEventAt?: number;
  /** Total events emitted since start. */
  eventCount: number;
}

/** Reasons a listener transitioned to stopped or paused. */
export type ListenerStopReason =
  | 'tab-closed'
  | 'browser-closed'
  | 'page-navigated'
  | 'user-stop'
  | 'error';

/** Event payload carried from extension → daemon → subscribers. */
export interface ListenerEvent {
  listenerId: string;
  /** `${site}/${adapter}` for routing/filtering on the daemon side. */
  adapterKey: string;
  type: 'data' | 'stopped' | 'paused' | 'resumed' | 'error';
  /** Present when type === 'data'. */
  data?: unknown;
  /** Present when type === 'stopped' | 'paused'. */
  reason?: ListenerStopReason;
  /** Present when type === 'error'. */
  error?: string;
  /** Chrome tabId that produced the event (for diagnostics). */
  tabId?: number;
  timestamp: number;
}

/** Command from daemon → extension to start a listener. */
export interface ListenerStartCommand {
  kind: 'listener-start';
  listenerKey: string; // `${site}/${adapter}:${listenerId}`
  source: ListenerSource;
  pattern?: string;
  selector?: string;
  mutationOptions?: { childList?: boolean; subtree?: boolean; characterData?: boolean; attributes?: boolean };
  url: string; // page to open (or reuse)
}

/** Command from daemon → extension to stop a listener. */
export interface ListenerStopCommand {
  kind: 'listener-stop';
  listenerKey: string;
  reason?: ListenerStopReason;
}