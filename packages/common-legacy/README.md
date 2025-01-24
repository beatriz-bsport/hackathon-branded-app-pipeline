# How to use commons in monorepo applications

## Add commons to dependency

Add to your dependencies the workspace symlink : 

```json
"dependencies": {
    "@bsport/common": "workspace:*",
}
```

Run `pnpm i` to finalize the link.

## Use files from @bsport/common

There is a mapping between `packages/common/lib` and `@bsport/common/lib`.

To import data from the package :

```tsx
import {
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_SHOP_ITEM,
} from '@bsport/common/lib/master-data/buyable-items.js';
```

As only the dist folder should be accessible within the monorepository, the publish directory is restricted to `dist`.
Please read the [Internal Packages; To Build or Not to Build](https://thijs-koerselman.medium.com/my-quest-for-the-perfect-ts-monorepo-62653d3047eb) section to understand why we want to enforce this structuration.

## Compile `packages/common`

You need to expose a build of the package, because it is used as an ESM Module.

Run the following script :

```sh
pnpm run build
```

You should see a `/lib` folder containing the build, with JS files.

## Any changes to do ?

If you want to upgrade commons and see direct changes in your application, you just need to make your change and compile / build again `packages/common`.

:warning: `bsport-mobile` uses common as well. 
