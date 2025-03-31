# :star: i18n-management

The goal of this tool is to create a centralized place to manage translations with Weblate.

Read [the full documentation](https://www.notion.so/bright-shovel-41b/i18n-Translations-160137e4c6408096b2c7e37e516b4e50).

## TLDR

This tool does three things :

- update the [Weblate source translations](./src/source/translations.json), a JSON file that defines the key structuration of the translations ;
- split the [locales translations](./src/locales) files across the different projects, in their `public/locales` folder.
- provide a script to migrate translations from `saas-legacy` into new apps translations.

## Use i18n in an application

Each project that implements i18n and requires its translations to be on Weblate must meet the following pattern.

### File structure

To be read by the tool, an application must have the following file structure.

```bash
└── src
    └── i18n
        ├── namespaces.json
        ├── locales // will contain the JSON builds
        └── translations
            ├── namespace1.translations.ts // or .js
            └── namespace2.translations.ts // or .js
```

The `namespaces.json` shall list all namespaces :

```json
[
	"namespace1",
	"namespace2",
	...
]
```

The `translations` folder contains the files that developers are editing to add strings. Each file should export its translations like this :

```tsx
exports.default = {
	key1: {
		...
	},
	...
}
```

You can use async export as well if you need to add scripting :

```tsx
const getTranslations = async () => {
  // Do something

  return {
    key1: {
        ...
    },
    ...
  };
};

exports.default = getTranslations();
```

You can have other files in the folder, to setup i18n for instance.

### “translation:update” script

The script that updates translations and creates the final translations files that are served to the frontend is defined in the new tool `i18n-management`.

Add the following script to your `package.json` application :

```json
{
  "translation:update": "pnpm run -w translation:update"
}
```

### "translation:migrate" script

You can migrate translations from `saas-legacy` into new applications in an easy way using the `translation:migrate` [script](./scripts/import-legacy-translations.ts).

```bash
pnpm run -w translation:migrate
```

To master the usage of this script, please visit our [Notion page](https://www.notion.so/bright-shovel-41b/How-to-migrate-translations-from-saas-legacy-to-new-application-1bd137e4c64080758a64d62ff794307f).

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

### Complementary tool

Use [@bsport/i18n](../../packages/utils/i18n/README.md) package to manage i18n. It will automatically handle prefix.
