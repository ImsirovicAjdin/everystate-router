# @everystate/router

**SPA router for EveryState: routing is just state**

Treat routing as state. Routes, params, and navigation history live in your EveryState store.

## Installation

```bash
npm install @everystate/router @everystate/core
```

## Quick Start

```js
import { createEventState } from '@everystate/core';
import { createRouter } from '@everystate/router';

const store = createEventState({});

const router = createRouter(store, {
  routes: {
    '/': 'home',
    '/about': 'about',
    '/user/:id': 'user'
  }
});

// Subscribe to route changes
store.subscribe('router.current', (route) => {
  console.log('Route changed:', route);
});

// Navigate
router.navigate('/user/123');

// Access params
const userId = store.get('router.params.id'); // '123'
```

## Features

- **Routes as state** Current route stored at `router.current`
- **Params as state** URL params at `router.params.*`
- **History integration** Browser back/forward support
- **Framework-agnostic** Works with any view layer

## License

MIT © Ajdin Imsirovic
