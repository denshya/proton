---
sidebar_position: 1
---

# Getting Started

## Install

```bash
bun i -D vite
bun i @denshya/proton
```

## Setup

Use `vite`

```json title="package.json"
{
  "type": "module",
  // ...
  "scripts": {
    "dev": "vite",
  },
  "dependencies": {
    // ...
  },
}
```

:::info

Any bundler works (not just `vite`), no bundler plugins required.

:::

Enable Proton JSX

```json title="tsconfig.json"
{
  "compilerOptions": {
    // ...
    "jsx": "react-jsx",
    "jsxImportSource": "@denshya/proton/jsx/virtual",
    // ...
  }
}
```

:::info

Any JSX may work well in Proton, it depends on deviations from React/Proton JSX, but you can fix them with [JSX customization](./custom/custom-jsx.md).

:::

## Quick Start

### Code

```tsx
import { WebInflator } from "@denshya/proton"
```

```tsx
function RangeApp() {
  return (
    <div>
      <input type="range" min="0" max="100" step="1" value={0} />
      <progress value={0} max="100">{0} %</progress>
      <button>Reset</button>
    </div>
  )
}
```

```tsx
const inflator = new WebInflator
const AppView = inflator.inflate(<App />)

document.getElementById("root").replaceChildren(AppView)
```

### Start

```bash
bun dev
```

## Understanding

### Inflation

Inflation is creating in-memory nodes from semi-serialized version (JSX).
Inflating any structure will always output at least `Node`.

```js
inflator.inflate(123) // => Text
inflator.inflate(<div />) // => HTMLDivElement
inflator.inflate(<div mounted={new State(false)} />) // => Comment
inflator.inflate(<Component />) // => ComponentGroup
inflator.inflate(new Comment) // => Comment
```

Learn more about [`ComponentGroup`](./unwinding/component-group.md).

### Component

Is pretty different from React:

- no hooks
- no rendering life cycle (function runs only once, i.e.)
- no type constrains (supports async, async generator functions)
- no return constrains

```tsx
function Component() {
  return (...)
}
```

### JSX

It's 100% compatible with React JSX, but it has a flavor. *If you have interest in using different flavors create/support discussions in GitHub Repository.*

```tsx
<div
  onClick={event => event.x}
  on={{ click: event => event.x }}
  ariaLabel="label"
  aria={{ ariaLabel: "label" }}
></div>
```

`onClick` and `ariaLabel` supported but not typed to remain compatibility while giving a flavor.

#### Observable in JSX

[Playground](https://stackblitz.com/edit/vitejs-vite-uepaaxp1?file=src%2FApp.tsx)

```tsx
function ColorApp() {
  const pointerMoveX$ = window.when("pointermove").map(event => event.x)
  const background = pointerMoveX$.map(x => x > 500 ? "red" : "green")

  return (
    <div style={{ background }}>{pointerMoveX$}</div>
  )
}
```

#### Conditional mounting

```tsx
function ColorApp() {
  const mounted$ = window.when("pointermove").map(event => !!event.x)

  return (
    <div mounted={mounted$}>Visible</div>
  )
}
```

#### Lists

Supports plain array mapping just like in React, though doesn't require `key` attribute.

```tsx
<div>{[1, 2, 3].map(item => <span>{item}</span>)}</div>
```

Also supports observable iterable (e.g. Array, Set, ...).

```tsx
const items = new State([1, 2, 3])

<div>{items.map(items => items.map(item => <span>{item}</span>))}</div>
```

:::info
This is a bit confusing snippet, you can ease it by using [`StateArray`](./unwinding/reactivity.md#statearray).
:::

## Extend Code

```tsx
import { State } from "@denshya/reactive"
```

```tsx
const PROGRESS_DEFAULT = 50

function App() {
  const progress = new State(PROGRESS_DEFAULT)

  return (
    <div style={{ display: "grid" }}>
      <input type="range" min="0" max="100" step="1" value={progress} />
      <progress value={progress} max="100">{progress} %</progress>
      <button disabled={progress.is(PROGRESS_DEFAULT)} on={{ click: () => progress.set(PROGRESS_DEFAULT) }}>Reset</button>

      <div>
        {Array.from({ length: 11 }, (_, index) => (
          <button on={{ click: () => progress.set(index * 10) }}>{index}</button>
        ))}
      </div>
    </div>
  )
}
```

:::info
You should acknowledge that this example uses `@denshya/reactive`, which is complementary, any **observable-based** state library works.
:::
