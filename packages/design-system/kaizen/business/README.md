# Kaizen Business Components

**A Business Component addresses a unique business need/logic and ensures design and behavior consistency across our different Micro Frontends.**

## :dart: Installation

### Add the package to your dependencies

Add `@bsport/kaizen-business-components` to your project dependencies :

```json
{
  "dependencies": {
    "@bsport/kaizen-business-components": "workspace:*"
    // other dependencies...
  }
}
```

:warning: For some components, there are **required dependencies** (`peerDependencies`):

- `@bsport/kaizen-primitive-core`
- `@bsport/form`
- `@tanstack/react-query`

Before using a Business Component, make sure you have them installed.

:bulb: If your Business Component does not require any dependency, you don't need to install all the peer dependencies of other components since all our components are **isolated**.

---

### Update your application tailwind config

When building your application, Vite needs to scan the classes defined in the Business Components to integrate them in the final css.

You can retrieve this "tailwind-content" and add it to the parsed content.

```js
import { KAIZEN_BUSINESS_CONTENT_PATHS } from "@bsport/kaizen-business-components/tailwind-content";
// <--- HERE
import { tailwindConfig } from "@bsport/kaizen-primitive-core";
import { SM_BACKBONE_CONTENT_PATHS } from "@bsport/sm-backbone/tailwind-content";

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ...SM_BACKBONE_CONTENT_PATHS,
    ...KAIZEN_BUSINESS_CONTENT_PATHS, // <--- HERE
  ],
};
```

---

## :pen: How to write a new Business Component

### Scope and definition

:point_right: A Business Component introduces dependencies between its multiple consumers, weakening isolation between MFE. Each Business Component should be carefully thought before being implemented !

:point_right: Don't create a Business Component for a single (or double) usage. When in doubt, don't refactor. It should be worthy to remove the boilerplate.

:bulb: For usability and simplicity, form components are an in-between between primitive and Business Components. They don't purely have business logic, but they give a good Form abstraction.

To dive deeper: [ADR - Business Components](https://www.notion.so/bright-shovel-41b/Business-Components-ADR-2cb137e4c64080df9c0afceb26cec41a)

---

### Export your Business Component

The library is built in library mode with isolated exports via subpaths. It means that each exported component can be imported independently from others, and should work in standalone. Only what you import will be bundled in the consuming application build !

#### How to export a component ?

:x: Don't export it from `index.ts`.
:white_check_mark: Instead, follow this structure:

- Create a **folder** for your component in **`src/components`** in the **appropriate folder (business domain)**. Example: `src/components/buyables/visibility-selector`.
- Add an index file: `visibility-selector/index.ts`. Why? Because the `package.json` maps in its `exports` field `"./*"` to `"./dist/components/*/index.js"`. In other words, **files that are not index files are not exposed**.
- Then, you can have your logic or ui components in this index file or in other files. But **everything that you want to expose needs to be in the index file**.

#### How to import it ?

```tsx
import { VisibilitySelector } from "@bsport/kaizen-business-components/buyables/visibility-selector";
```

---

### Internationalization

#### Usage

```tsx
import {
  i18nInstance,
  useTranslation,
} from "#src/i18n";

export const MyComponent = () => {
    const { t } = useTranslation("your-namespace", { i18n: i18nInstance });

    ...
}
```

#### Namespaces and keys

One file/namespace should be created per business domain.
The first layer of keys are Business Components name:

```json
// my-business.json
{
    "firstBusinessComponent": {
        ...
    },
    "secondBusinessComponent": {
        ...
    },
}
```

Documentation to write keys: https://www.notion.so/bright-shovel-41b/How-to-write-efficient-i18n-keys-26a137e4c64080899dd5c9d425a57042

#### Implementation details

Since our Business Components are isolated and should work in standalone, we are not providing a global React Context in `sm-backbone` to resolve to the i18n instance.

Instead, each Business Component should be bundled directly with an i18n instance that uses `inMemoryTranslationLoader` (no http backend). And since we create a static i18n Instance, we don't need any React Context to forward it.

---

### Backend interaction with react-query

_Coming soon..._

---

### Story

Stories of your Business Components should address the following points:

- How to import and use it, with clean code snippets (metaSourceCode) ?
- What are the required peerDependencies to run it ?
- To which business logic it answers ?

Some guidelines to write a clean story:

- when landing on a page, the consumer must see the Story interface to interact with the Business Component. Keep the meta description concise.
- keep extended documentation to the bottom of the story
- rely on args control and storybook interface to document properly the props

---

### Final template

CF [TEMPLATE.md](./TEMPLATE.md)
