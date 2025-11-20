# Kaizen Primitive components

Have a look on our [Notion documentation](https://www.notion.so/bright-shovel-41b/Develop-Primitive-Component-Kaizen-for-newbies-13b137e4c64080c8abaddb7ec1a909fc) !

## How to use

1. Import the package by adding this line to your project `package.json`

```jsonc
{
  // package.json
  "dependencies": {
    // Your other dependencies
    "@bsport/kaizen-primitive-core": "workspace:*",
  },
}
```

2. Include the global CSS at the root of your project (App.ts)

```jsx
import "@bsport/kaizen-primitive-core/styles";
```

3. Add any component in your React project as follows:

```jsx
// MyComponent.tsx
import { Icon } from "@bsport/kaizen-primitive-core";

function MyComponent() {
  return <Icon icon="left-arrow" size="xs" />;
}
```

## Icons

Kaizen is using [Untitled UI Icons](https://www.untitledui.com/free-icons) for icons. You can find all the svgs on [their github](https://github.com/untitleduico/icons/tree/main/icons).

### Update icons

You can easily update the icons into Kaizen, for this you need to:

1. Inside the `src/components/Icon/assets` folder, copy-paste your new icon as a SVG. You can also remove some if they are no longer needed. :warning: Make sure to have width and height set to `100%`
2. Run the command below

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
