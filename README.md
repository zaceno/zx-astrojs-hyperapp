# Hyperapp Integration for Astro

Allows you to add client-side-interactive islands in your astro apps using hyperapp, with jsx if you want it.

- Does not yet support:
  - static astro children.
  - TS/TSX
  - HMR.

Demo: https://stackblitz.com/github/zaceno/astrojs-hyperapp-demo

## Installation:

In your astro project:

```sh
> npm install @zxlabs/astrojs-hyperapp
```

In your `astro.config.mjs`:

```js
import { defineConfig } from "astro/config"
import hyperapp from "@zxlabs/astrojs-hyperapp"

export default defineConfig({
  integrations: [hyperapp()],
})
```

### Note on mixing with other ui frameworks

If you're using jsx for your components, and also use other frameworks that use jsx, you need to
explicitly tell the integrations which files it should include or exclude using [picomatch](https://github.com/micromatch/picomatch#globbing-features)
patterns.

This might require you to use some naming convention or folder structure to make it possible to
separate components from different frameworks

```js
import { defineConfig } from "astro/config"
import hyperapp from "@zxlabs/astrojs-hyperapp"
import preact from "@astrojs/preact"

export default defineConfig({
  integrations: [
    hyperapp({ include: ["**/hyperapp/*"] }), //exclude option also possible
    preact({ include: ["**/preact/*"] }), //exclude option also possible
  ],
})
```

## Authoring islands

In astrojs, an 'island' is a part of a page that is hooked up to a client-side framework
for interactivity. Each of our islands will be activated (or "hydrated") with a call to
Hyperapp's `app(...)` function.

An island module needs to default-export a function that optionally takes some server-side
props, and returns an object we could pass to Hyperapp's `app()` – except the `node` prop,
which will be provided by this integration.

**`/src/components/counter.jsx`**

```jsx
const HyperappCounter = serverProps => ({
  init: serverProps.startCount || 0,
  view: value => (
    <div class="counter">
      <h1>{value}</h1>
      <button onclick={x => x - 1}>-</button>
      <button onclick={x => x + 1}>+</button>
    </div>
  ),
  // could also define these props:
  // subscriptions: ...
  // dispatch: ...
})

export default HyperappCounter
```

## Using islands on a page:

With a island thus defined, the we can use hyperapp
to render the component (both server side and hydrate
client side), in our astro-components like this:

**`/src/pages/index.astro`**

```jsx
---
import Counter from '../components/counter.jsx'
---
<!doctype html>
<html>
  <head></head>
  <body>
    <p> Here is the counter, starting at 5</p>

    <Counter client:load startCount={5} />

  </body>
</html>
```

Note how the props passed in to the island in the astro-component,
are available in the `serverProps` we defined in the counter.

## Sharing state between islands

Since each island will be it's own instance of a hyperapp-app they will not share state.
Astro recommends using [nanostores](https://github.com/nanostores) for sharing states, and that
is a perfectly good option. You will just have to write your own effects/subscriptions.

Another option, specifically for hyperapp islands, is to use the island-sync utility
shipped with this integration, like this:

**_`island1.jsx`_**

```js
import _sync from '@zxlabs/astrojs-hyperapp/island-sync'

//define a syncer for islands 1 and 2
export const sync = _sync()

//same as defining a regular astro island
//but wrap props in syncer
export default props => sync({
  init: //... init island 1,
  view: //... view island 1,
})
```

**_`island2.jsx`_**

```js
import {sync} from './island1.jsx'

export default props => sync({
  init: //... init island 2,
  view: //... view island 2
})
```

Islands synced in this way, by decorating their app-props with a common sync-function,
will all share state. See the demo above for an example of this.

```

## Caveat regarding SSR

When using SSR (if your island uses any other client directive than `client:only`) we
need to run the `init` action server side in order to properly render the view. And the
init action might have effects designed to only work in the browser. That will cause errors.
It is up to you to preven browser-only-effects from running when in a server environment.
>>>>>>> 0141e38 (make server-side rendering safer)
```
