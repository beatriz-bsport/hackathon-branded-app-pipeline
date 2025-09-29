# :star: i18n-management

The goal of this tool is to create a centralized place to manage translations with Transifex.

Refer to our [full Notion documentation](https://www.notion.so/bright-shovel-41b/Internationalization-245137e4c64080988df6f314aea60bb6) for additional information.

## TLDR

This tool does three main things :

1. provide [a script](./scripts/build-public-locales-files.ts) to **"deploy" translations files** in the public folder of our frontend applications, that can be called with: `pnpm -w translation:update`;
2. define **Transifex configurations** in [`src/transifex`](./src/transifex/) folder
3. provide [a script](./scripts/find-unused-keys.ts) to **detect potential unused keys** in your translations files, that can be called with `pnpm -w translation:keys`;

## Use i18n in an application

Each project that implements i18n and requires its translations to be on Transifex must fit the following pattern, that we refer as "Internationalized project structure".

### File structure

Reference: [Internationalized project in Ichizen](https://www.notion.so/bright-shovel-41b/Internationalization-structure-256137e4c6408024b68ee7dffde17b5e?source=copy_link#257137e4c64080cfb974c1c48793c90f)

```bash
└── src
    └── i18n
        ├── locales # managed from Transifex
        │   ├── de
        │   │   ├── namespace1.json
        │   │   └── namespace2.json
        │   ├── es
        │   ├── fr
        │   ├── it
        │   ├── nl
        │   └── pt
        ├── namespaces.json # mandatory
        └── source # mandatory
            ├── namespace1.json
            └── namespace2.json
```

The `namespaces.json` shall list all namespaces :

```json
[
	"namespace1",
	"namespace2",
	...
]
```

The `source` folder contains the JSON files that developers are editing to add strings (they can be edited directly from Transifex as well):

```json
{
	"key1": {
		...
	},
	...
}
```

### `translation:update` script

This script copies JSON files from

- `source/{namespace}.json` to `public/locales/en/{namespace}.json`
- `locales/{lang}/{namespace}.json` to `public/locales/{lang}/{namespace}.json`

From this `public` location, we are serving the static files and they can be used by i18n.

Add the following script to your `package.json` application :

```json
{
  "translation:update": "pnpm run -w translation:update"
}
```

### `translation:keys` script

This script parses a project code as AST to detect unused keys based on some key patterns and static reading: `t("...")`, `i18n.t("...")`, `i18nKey="..."`.

In order to have this working properly, there are some rules to follow:

- don't declare keys outside of a `t` function.
- it's possible to use dynamic keys, with variables inside them.
- avoid ternary inside `t` function as well.

### Use `public/locales/` as source dir to serve translations files

Except for `saas-legacy`, namespaces are prefixed with the application name, to prevent any conflict when loading the files. Indeed, if multiple micro-frontends are running simultanously with their own namespaces, and some have the same naming, we don't want one to override the others.

Thus, for each locale, translations files are chunked like this :

```tsx
└── public
    └── locales
        ├── en
        │   ├── project-name_namespace1.json
        │   └── project-name_namespace2.json
        ├── fr
        │   ├── project-name_namespace1.json
        │   └── project-name_namespace2.json
        └── [locale]
            ├── project-name_namespace1.json
            └── project-name_namespace2.json
```

## Other

### Complementary tool

Use [@bsport/i18n](../../packages/utils/i18n/README.md) package to manage i18n. It will automatically handle prefix.

### `translation:migrate` script

You can migrate translations from `saas-legacy` into new applications in an easy way using the `translation:migrate` [script](./scripts/import-legacy-translations.ts).

```bash
pnpm run -w translation:migrate
```

To master the usage of this script, please visit our [Notion page](https://www.notion.so/bright-shovel-41b/How-to-migrate-translations-from-saas-legacy-to-new-application-1bd137e4c64080758a64d62ff794307f).
