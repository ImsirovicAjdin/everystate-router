/**
 * @everystate/router
 *
 * SPA router for EveryState stores. Routing is just state.
 *
 * Copyright (c) 2026 Ajdin Imsirovic. MIT License.
 */

export interface RouteDefinition {
  /** URL pattern, e.g. '/users/:id' */
  path: string;
  /** View key written to ui.route.view */
  view: string;
  /** Component with a boot({ store, el, signal, params }) method */
  component?: { boot: (ctx: BootContext) => Promise<(() => void) | void> | (() => void) | void };
  [key: string]: any;
}

export interface BootContext {
  store: any;
  el: HTMLElement;
  signal: AbortSignal;
  params: Record<string, string>;
}

export interface NavigateOptions {
  replace?: boolean;
  search?: string;
  restoreScroll?: boolean;
}

export interface RouterConfig {
  /** Route definitions */
  routes?: RouteDefinition[];
  /** EveryState store instance */
  store?: any;
  /** CSS selector for the route mount point (default: '[data-route-root]') */
  rootSelector?: string;
  /** Fallback route when nothing matches */
  fallback?: Partial<RouteDefinition> | null;
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** CSS selector for intercepted links (default: 'a[data-link]') */
  linkSelector?: string;
  /** CSS selector for nav links that get .active class (default: 'nav a[data-link]') */
  navSelector?: string;
}

export interface Router {
  /** Navigate to a pathname */
  navigate(pathname: string, opts?: NavigateOptions): Promise<void>;
  /** Patch query parameters without changing path */
  navigateQuery(patch?: Record<string, string | null | undefined>, opts?: { replace?: boolean }): Promise<void>;
  /** Navigate to a new path, keeping the current search string */
  navigatePath(path: string, opts?: { replace?: boolean }): Promise<void>;
  /** Start listening for click and popstate events, navigate to current URL */
  start(): Router;
  /** Remove all listeners and clean up */
  stop(): Router;
  /** Get the current route state */
  getCurrent(): { view: string | null; path: string | null; search: string };
}

/**
 * Create a SPA router bound to an EveryState store.
 *
 * Store paths written on navigation:
 *   ui.route.view         - current view key
 *   ui.route.path         - current pathname
 *   ui.route.params       - extracted URL params
 *   ui.route.query        - parsed query string
 *   ui.route.transitioning - true during view transitions
 *
 * Store-driven navigation (no router import needed):
 *   store.set('ui.route.go', '/about')
 *   store.set('ui.route.go', { path: '/users/1', search: '?tab=posts' })
 *   store.set('ui.route.go', { query: { tab: 'posts' } })
 */
export function createRouter(config: RouterConfig): Router;
