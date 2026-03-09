# @everystate/router v1.0.6

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

## Ecosystem

| Package | Description | License |
|---|---|---|
| [@everystate/aliases](https://www.npmjs.com/package/@everystate/aliases) | Ergonomic single-character and short-name DOM aliases for vanilla JS | MIT |
| [@everystate/core](https://www.npmjs.com/package/@everystate/core) | Path-based state management with wildcard subscriptions and async support. Core state engine (you are here). | MIT |
| [@everystate/css](https://www.npmjs.com/package/@everystate/css) | Reactive CSSOM engine: design tokens, typed validation, WCAG enforcement, all via path-based state | MIT |
| [@everystate/examples](https://www.npmjs.com/package/@everystate/examples) | Example applications and patterns | MIT |
| [@everystate/perf](https://www.npmjs.com/package/@everystate/perf) | Performance monitoring overlay | MIT |
| [@everystate/react](https://www.npmjs.com/package/@everystate/react) | React hooks adapter: `usePath`, `useIntent`, `useAsync` hooks and `EventStateProvider` | MIT |
| [@everystate/renderer](https://www.npmjs.com/package/@everystate/renderer) | Direct-binding reactive renderer: `bind-*`, `set`, `each` attributes. Zero build step | MIT |
| [@everystate/router](https://www.npmjs.com/package/@everystate/router) | SPA routing as state | MIT |
| [@everystate/test](https://www.npmjs.com/package/@everystate/test) | Event-sequence testing for UIstate stores. Zero dependency. | MIT |
| [@everystate/view](https://www.npmjs.com/package/@everystate/view) | State-driven view: DOMless resolve + surgical DOM projector. View tree as first-class state | MIT |
| [@everystate/vue](https://www.npmjs.com/package/@everystate/vue) | Vue 3 composables adapter: `provideStore`, `usePath`, `useIntent`, `useWildcard`, `useAsync` | MIT |
| [@everystate/types](https://www.npmjs.com/package/@everystate/types) | Typed dot-path autocomplete for EveryState stores (you are here) | MIT |

## Self-test (CLI, opt-in)

The self-test verifies the pure-function core of the router:
pattern compilation, path normalization, and route resolution.
It is **zero-dependency** - no `@everystate/core` or DOM required.
It is **opt-in** and never runs automatically on install:

```bash
# via npx (no install needed)
npx everystate-router-self-test

# if installed locally
everystate-router-self-test

# or directly
node node_modules/@everystate/router/self-test.js
```

You can also run the npm script from the package folder:

```bash
npm --prefix node_modules/@everystate/router run self-test
```

### Integration tests (@everystate/test)

The `tests/` folder contains a separate integration suite that uses
`@everystate/test` and `@everystate/core` (declared as `devDependencies` / `peerDependencies`).
The **self-test** stays zero-dependency, while integration tests
remain available for deeper store-level validation.

**For end users** (after installing the package):

```bash
# Install test dependency
npm install @everystate/test

# Run from package folder
cd node_modules/@everystate/router
npm run test:integration
# or short alias
npm run test:i
```

Or, from your project root:

```bash
npm --prefix node_modules/@everystate/router run test:integration
```

**For package developers** (working in the source repo):

```bash
npm install
npm run test:integration
```

## License

MIT © Ajdin Imsirovic
