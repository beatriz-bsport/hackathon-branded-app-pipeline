# Kaizen Primitive components

## How to use

1. Import the package by adding this line to your project `package.json`

```jsonc
{
  // package.json
  "dependencies": {
    // Your other dependencies
    "@bsport/kaizen-primitive": "workspace:*",
  },
}
```

2. Include the global CSS at the root of your project

```jsx
import "@bsport/kaizen-primitive/build/index.css";
import "@bsport/kaizen-primitive/build/variables.css";
```

1. Add any component in your React project as follows:

```jsx
// MyComponent.tsx
import "@bsport/kaizen-primitive/style.css";
import Icon, { icons } from "@bsport/kaizen-primitive/build/Button";

function MyComponent() {
  return <Icon icon="left-arrow" size="xs" />;
}
```

## Icons

Kaizen is using [Untitled UI Icons](https://www.untitledui.com/free-icons) for icons.

### Add a new icon

You can easily add new icons to Kaizen, for this you need to:

1. Choose a kebab-case name, for example `my-new-icon`
2. Copy-pase your new icon as a SVG (as when clicking on any Untitled icon).
3. Finally run the command below and follow the instructions.

```sh
pnpm run icon:add
```

**NB:** You can add multiple icons in one session.

## Development

### Run development

To run the development server (Tailwind + Storybook), you can run:

```sh
pnpm run dev
```
