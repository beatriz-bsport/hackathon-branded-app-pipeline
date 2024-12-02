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

### Update icons

You can easily update the icons into Kaizen, for this you need to:

1. Inside the `src/components/Icon/assets` folder, copy-paste your new icon as a SVG. You can also remove some if they
   are no longer needed.
2. Run the command below.

```sh
pnpm run icon:generate
```

**NB:** This script is also part of the `pre-commit` script, and the changes are added automatically.

## Development

### Run development

To run the development server (Tailwind + Storybook), you can run:

```sh
pnpm run dev
```
