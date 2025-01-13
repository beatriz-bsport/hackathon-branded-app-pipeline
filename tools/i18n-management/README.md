# :star: i18n-management

The goal of this tool is to create a centralized place to manage translations with Weblate.

Read [the full documentation](https://www.notion.so/bright-shovel-41b/i18n-Translations-160137e4c6408096b2c7e37e516b4e50).

## TLDR

This tool does two things :

- update the [Weblate source translations](./src/source/translations.json), a JSON file that defines the key structuration of the translations ;
- split the [locales translations](./src/locales) files across the different projects, in their `public/locales` folder.

## Use i18n in an application

Each project that implements i18n and requires its translations to be on Weblate must meet the following pattern.

### File structure

To be read by the tool, an application must have the following file structure.

```bash
└── src
    └── i18n
        ├── namespaces.json
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

You can have other files in the folder, to setup i18n for instance.

### “updateTranslations” script

The script that updates translations and creates the final translations files that are served to the frontend is defined in the new tool `i18n-management`.

Add the following script to your `package.json` application :

```tsx
{
	"updateTranslations": "pnpm exec nx updateTranslations @bsport/i18n-management"
}
```

### Define `public/locales/` as source dir to serve translations files

For each locale, translations files are chunked like this :

```tsx
└── public
    └── locales
        ├── en
        │   ├── namespace1.json
        │   └── namespace2.json
        ├── fr
        │   ├── namespace1.json
        │   └── namespace2.json
        └── [locale]
            ├── namespace1.json
            └── namespace2.json
```
