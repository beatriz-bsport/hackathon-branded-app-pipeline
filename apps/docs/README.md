# `@bsport/kaizen-docs`

Public documentation site for the Kaizen design system. Vite + React Router +
MDX + Tailwind 4, sitting next to the real Kaizen packages at
`packages/design-system/kaizen/`.

The site builds to a static `dist/` folder suitable for hosting on S3, GCS, or
any static file server with SPA fallback configured.

## Local development

From the repo root:

```bash
pnpm install                                    # monorepo deps (does not install apps/docs)
pnpm -C apps/docs install                       # docs-only lockfile (keeps root pnpm-lock.yaml unchanged)
pnpm -C apps/docs dev
```

`apps/docs` is excluded from the pnpm workspace so its dependencies live in
`apps/docs/pnpm-lock.yaml` and do not change the root lockfile.

The dev server runs on http://localhost:4070. The `dev` script first runs
the `generate` pipeline (extracts props and tokens, generates nav/manifest/static
markdown exports) and then boots `vite`.

Live `<StorybookEmbed>` previews load from the deployed dev Storybook by
default: `https://docs.infra.bsport.io/storybook/kaizen/dev`. To use a local
Storybook instead, run it separately and start docs with:

```bash
VITE_STORYBOOK_BASE_URL=http://localhost:6006 pnpm -C apps/docs dev
```

### Useful scoped scripts

```bash
pnpm -C apps/docs build               # one-shot generate + vite build → dist/
pnpm -C apps/docs preview              # preview the built dist/ locally
pnpm -C apps/docs lint                 # eslint
pnpm -C apps/docs generate             # rerun all generators
pnpm -C apps/docs generate:metadata    # generate nav + pages manifest
pnpm -C apps/docs generate:design-data # generate props + tokens
pnpm -C apps/docs generate:props       # react-docgen-typescript over all primitive components
pnpm -C apps/docs generate:tokens      # flatten @bsport/kaizen-tokens output
pnpm -C apps/docs generate:nav         # build lib/generated/nav.json from content/_meta.json
pnpm -C apps/docs generate:pages-manifest  # build lib/generated/pages-manifest.json
pnpm -C apps/docs generate:static-exports  # write .md files, llms.txt, llms-full.txt into .generated/
```

## Deployment (static bucket)

CI deploys the docs to the existing docs bucket, under a separate Kaizen docs
path from Storybook:

```text
s3://bsport-eu-docs/docs/kaizen/dev
```

The CI build script builds with `VITE_BASE=/docs/kaizen/dev/` before
uploading, so the generated asset URLs and React Router basename match the S3
subfolder. It also points live examples at the deployed Kaizen Storybook instead
of bundling Storybook into the docs artifact. The deploy script only uploads the
prebuilt `dist/` artifact.

For local/manual deployment:

```bash
pnpm -C apps/docs install
pnpm -C apps/docs ci:build
pnpm -C apps/docs ci:deploy
```

### SPA fallback

Since this is a single-page app, deep links like `/components/button` need the
CDN/server to serve `index.html` for unknown paths:

- **S3 static website hosting:** set error document to `index.html`
- **CloudFront:** add a custom error response for 403/404 → `/index.html` (200)
- **GCS:** configure the 404 page to `index.html`

### Environment variables

| Variable | When | Purpose |
|----------|------|---------|
| `DOCS_URL` | Build time | Base URL for absolute links in `llms.txt`. Defaults to `https://kaizen.bsport.io`. |
| `VITE_BASE` | Build time | Set to the deployment subpath (e.g. `/docs/kaizen/dev/`) if the site is not served from domain root. Defaults to `/`. |
| `VITE_STORYBOOK_BASE_URL` | Build time | Optional Storybook iframe base URL. Defaults to `https://docs.infra.bsport.io/storybook/kaizen/dev`. |

## Authoring docs

### Where things live

```
apps/docs/
  src/                       # Vite entry point, React Router shell, providers
  components/
    layout/                  # Header, Sidebar, TopNav, TableOfContents, PageActions, …
    mdx/                     # the 28 MDX components (StorybookEmbed, PropsTable, Callout, …)
    theme/                   # ThemeToggle
  content/                   # all MDX lives here — this is what you edit
    _meta.json               # top-tab order + labels
    welcome/                 # Welcome tab (mapped to `/`)
    foundations/             # Foundations tab
    components/              # Components tab
    patterns/                # Patterns tab
    mdx-components/          # MDX Components tab (internal reference)
  lib/
    nav.ts, cx.ts, …         # shared client-side helpers
    generated/               # JSON from generate:* (local, git-ignored)
  scripts/                   # generate scripts (props, tokens, nav, manifest, etc.)
  public/images/             # committed static assets (screenshots, illustrations)
  .generated/                # local output from `pnpm generate` (git-ignored)
```

### Add a new page

1. Pick the tab (`welcome`, `foundations`, `components`, `patterns`,
   `mdx-components`) — the folder under `content/`.
2. Create `your-page.mdx` next to the other pages in that folder.
3. Add `"your-page"` to the corresponding `content/<tab>/_meta.json` array
   to slot it into the sidebar order.
4. Fill in the frontmatter (validated with Zod during `generate:pages-manifest`):

```yaml
---
title: Your page title
description: Short summary used on landing pages and as the meta description.
status: stable | beta | deprecated | internal # optional
category: welcome | foundations | components | patterns | mdx-components
tags: [optional, list]
since: "0.1.0"
related: [OtherComponent]
source: "packages/design-system/kaizen/primitive/core/src/components/Foo"
figma: "https://figma.com/file/..."
---
```

5. Author with MDX. The 28 components are registered globally — no imports
   needed inside MDX. Reach for `<StorybookEmbed id="…" />` for live
   previews, `<PropsTable>` for component props, `<TokenTable>` for token
   references, `<Callout>` / `<DoDont>` / `<StatusBadge>` for guidance.

### Adding static images

Put committed documentation images in:

```text
apps/docs/public/images/
```

Use kebab-case filenames and keep the name descriptive:

```text
apps/docs/public/images/button-loading-form.png
apps/docs/public/images/modal-confirmation-danger.png
```

In MDX, reference those files from `/images/...`.

For do / don't examples:

```mdx
<DoDont>
  <Do
    caption="Show a loading state while the form is submitting."
    image="/images/button-loading-form.png"
    alt="Primary button showing a loading state in a form footer"
  />
  <Dont
    caption="Use a danger action for a non-destructive cancellation."
    image="/images/button-danger-cancel.png"
    alt="Cancel button incorrectly using the danger style"
  />
</DoDont>
```

For anatomy diagrams:

```mdx
<Anatomy
  src="/images/button-anatomy.png"
  alt="Button anatomy diagram"
  parts={[
    { label: "Container", description: "Carries the button intent." },
    { label: "Label", description: "Names the action." },
  ]}
/>
```

Avoid raw Markdown image syntax such as `![Button](/images/button.png)` for
these docs. The site is deployed under `/docs/kaizen/dev/`, and the MDX
image-aware components above resolve that base path correctly.

### Embedding live examples

Live previews are Storybook iframes. To embed a story:

1. Open the unified Storybook (`pnpm --filter @bsport/kaizen-storybook dev`,
   or browse the deployed Storybook).
2. Navigate to the story you want and copy the `id=` query parameter from
   the URL — for example `primitive-components-button--intent-gallery`.
3. Drop it into MDX:

   ```mdx
   <StorybookEmbed id="primitive-components-button--intent-gallery" />
   ```

   Optional props: `height` (default `360`), `title` (overrides the iframe
   `aria-label`).

If the gallery you want doesn't exist yet, add a small `render`-based story
to the relevant `*.stories.tsx` file in Kaizen. Once the Storybook dev deploy
has run, the docs iframe can load it from the deployed Storybook URL.

### LLM endpoints

Plain-markdown `.md` files are pre-generated for every page during the build
and served as static files. Append `.md` to any docs URL (e.g.
`/components/button.md`) to get the plain-markdown version.

The **Copy as Markdown** action and **View .md** link in the page actions menu
work by fetching these static files.

Two additional files are generated:

- `/llms.txt` — index of all pages with links to their `.md` URLs
- `/llms-full.txt` — all pages concatenated as one markdown document

### Architecture

The docs are built as a Vite SPA with React Router for client-side routing.
MDX files under `content/` are compiled at build time by `@mdx-js/rollup` and
lazy-loaded per route via `import.meta.glob`. Navigation, page metadata, and
Figma image URLs are pre-generated as JSON files during the `generate` step.

```
pnpm generate        →  local lib/generated/*.json + .generated/*.md
vite build           →  dist/ (index.html + JS/CSS chunks + static assets)
upload dist/ to CDN  →  done
```
