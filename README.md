# @everystate/router

**SPA router for EveryState: routing is just state.**

Treat routing as state. Routes, params, query strings, and navigation history live in your EveryState store at `ui.route.*`.

## Installation

```bash
npm install @everystate/router @everystate/core
```

## Quick Start

```js
import { createEveryState } from '@everystate/core';
import { createRouter } from '@everystate/router';

const store = createEveryState({});

const router = createRouter({
  store,
  routes: [
    { path: '/',           view: 'home',  component: HomeView },
    { path: '/about',      view: 'about', component: AboutView },
    { path: '/users/:id',  view: 'user',  component: UserView },
  ],
  fallback: { view: '404', component: NotFoundView },
}).start();

// Subscribe to route changes
store.subscribe('ui.route.view', (view) => {
  console.log('View changed:', view);
});

// Navigate programmatically
router.navigate('/users/123');

// Or navigate from anywhere via the store (no router import needed)
store.set('ui.route.go', '/about');
store.set('ui.route.go', { path: '/users/1', search: '?tab=posts' });
store.set('ui.route.go', { query: { tab: 'posts' } }); // patch query only

// Access route state
store.get('ui.route.view');   // 'user'
store.get('ui.route.path');   // '/users/123'
store.get('ui.route.params'); // { id: '123' }
store.get('ui.route.query');  // { tab: 'posts' }
```

## Route Config

```js
createRouter({
  store,                                      // EveryState store instance
  routes: [{ path, view, component }],        // route definitions
  fallback: { view, component },              // 404 fallback (optional)
  rootSelector: '[data-route-root]',          // mount point (default)
  linkSelector: 'a[data-link]',              // intercepted links (default)
  navSelector: 'nav a[data-link]',           // auto .active class (default)
  debug: false,                               // console.debug logging
});
```

## Component Boot Protocol

Each route's `component` must expose a `boot()` function:

```js
export const HomeView = {
  async boot({ store, el, signal, params }) {
    el.innerHTML = '<h1>Home</h1>';
    // Return an unboot function for cleanup
    return () => { el.innerHTML = ''; };
  }
};
```

## Features

- **Routes as state** - current route at `ui.route.view`, `ui.route.path`
- **Params as state** - URL params at `ui.route.params.*`
- **Query as state** - query string at `ui.route.query.*`
- **Store-driven navigation** - `store.set('ui.route.go', '/path')` from anywhere
- **Transition state** - `ui.route.transitioning` flag for loading indicators
- **History integration** - browser back/forward with scroll position restore
- **Base path support** - auto-detects `<base href>` for subdirectory deploys
- **Nav active state** - auto-toggles `.active` class on `nav a[data-link]` elements
- **Abort controller** - cancels in-flight boots when navigation is superseded
- **Focus management** - moves focus to route root for accessibility
- **Framework-agnostic** - works with any view layer or vanilla DOM

## API

| Method | Description |
|---|---|
| `router.start()` | Begin listening for clicks and popstate events |
| `router.stop()` | Remove all listeners and clean up |
| `router.navigate(path, opts?)` | Navigate to a path (`{ replace, search, restoreScroll }`) |
| `router.navigateQuery(patch, opts?)` | Patch query params without changing path |
| `router.navigatePath(path, opts?)` | Navigate keeping current search string |
| `router.getCurrent()` | Returns `{ view, path, search }` |

## License

MIT © Ajdin Imsirovic
