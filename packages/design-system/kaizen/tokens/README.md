# Design token

Project exporting the Design tokens defined by the Design Team.

[![image](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Proto-designSystem?node-id=642-5125&t=HvmWvo4hFi5eRTSL-0)

## How to use

You can import directly to your projects by adding in your `package.json`

```jsonc
{
  // package.json
  "dependencies": {
    // other dependencies
    "@bsport/bo-design-tokens": "workspace:*",
  },
}
```

Then in your code you can directly import as follow.

```ts
import tokens from "@bsport/bo-design-tokens/build/exports/tokens.json";

console.log(tokens);
```

or if you want to import the CSS variables:

```scss
@include "@bsport/bo-design-tokens/build/exports/_variables.css";
```

**NB:** If you're importing directly the file `tokens.json` in TypeScript, make sure to have added `"resolveJsonModule": true` to your compiler options.

## CICD - Import from Supernova

This project has been designed to import the output of Supernova's pipeline and convert them in Tailwindcss files that can imported in any projects.

These are the steps completed by this pipeline.

1. Tokens are exported via Supernova [CSS theme exporter](https://github.com/Supernova-Studio/exporters/blob/main/exporters/css/README.md)
2. Whenever a MR is opened, `ci-merge-request-open.sh` script is ran. If changes in Supernova are detected, it commits automatically those in your MR

## TODOs

- [ ] Replace in Tailwind the prefix `--tw-` with `--kz-`
- [ ] Current files imported into a Tailwind theme
  - [x] border-widths.css
  - [x] colors.css
  - [ ] dimensions.css
  - [ ] font-families.css
  - [x] font-sizes.css
  - [x] font-weights.css
  - [x] line-heights.css
  - [x] opacities.css
  - [ ] paragraph-spacings.css
  - [x] radii.css
  - [x] shadows.css
  - [ ] sizes.css
  - [ ] strings.css
  - [ ] typography.css
- [ ] Define rules for colors
