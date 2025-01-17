# B2B Application Template

This template provides a minimal setup to create a new application for bsport's clients.

It is built using:

- [lodash](https://lodash.com/): JavaScript utility library.
- [vite]()

## Commands

To run in localhost :

```sh
pnpm run dev
```

To build your application :

```sh
pnpm run build
```

:warning: You can not preview your build !
React is defined as an external dependencies in the Vite config, thus it won't be in the final bundle.
