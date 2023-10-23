# Hyperapp Integration for Astro

Allows you to add client-side-interactive islands in your astro apps using hyperapp.

- Supports SSR/SSG and client side hydration.
- SSR does not yet work well with long running/asynchronous effects/subs on init.
- Does not yet support HMR.
- JSX support included out of the box.
- Does not currently play nice with other client-side integrations.
- Does not support children/slots.
- A work in progress. Help welcome!

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
