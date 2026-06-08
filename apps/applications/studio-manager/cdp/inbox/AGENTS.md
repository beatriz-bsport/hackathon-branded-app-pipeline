# AGENTS.md — Template: Studio Manager app

This file ships with generated Studio Manager apps.

## Keep this package shape

- Use `#src/*` for local imports when available.
- Studio Manager apps are libraries; keep `federation.devPort` accurate in `package.json` for isolated local dev.
- Prefer `dev:watch` for local development.
- Route strings through `src/i18n` and run `pnpm translation:update` after changes.
- Add feature flags in the app-local registry instead of hardcoding names.

## First checks after generation

- Update package metadata and README placeholders.
- Confirm the chosen port does not collide with sibling apps.
- If needed, wire local navigation/sidebar injection in `studio-manager/navigation-sidebar`.
- Run `lint`, `ci:compile`, and local dev before opening a PR.

## Features folder convention (`src/features/<feature>/`)

The inbox app is being built to grow — list, detail, composer, search, filters,
bulk actions. To stay maintainable at that scale, every feature folder follows
the same shape. Apply these rules to new sibling features (`thread-detail/`,
`message-composer/`, …) and to growth inside existing ones.

1. **Subfolders are growth/swap-out boundaries.** A subfolder = a deletable
   unit. Add one when a concern will grow (new sub-features land in it) _or_
   could be swapped wholesale (e.g. the virtualization layer). Don't preemptively
   wrap single files in folders.

2. **File name = main export name, kebab-case.** `thread-list-item.tsx`
   exports `ThreadListItem`. Exceptions for cross-cutting files only:
   `utils.ts`, `types.ts`, `constants.ts`, `schema.ts`.

3. **Full feature prefix inside subfolders.** `header/thread-list-header.tsx`,
   not `header/header.tsx`. Exports must be unambiguous at the call site
   (`<ThreadListHeader />`, never `<Header />`).

4. **Row/item layering for list rows.** `*-item` is presentational
   (props in, JSX out, no data deps — Kaizen-promotable). `*-row` is the
   data adapter that wraps the item with a server-shaped model. The row
   lives in the same folder as the item it adapts.

5. **Read top-to-bottom.** Main export at the top of the file. Local
   helpers, formatters, constants below. Readers should see the public
   thing first and dive into implementation only when needed.

6. **Hooks ship with their primary caller.** A hook used by exactly one
   component lives in that component's folder. A hook used by two or more
   sub-folders bubbles up to the feature root. A mutation hook used by two
   or more features should not live in the feature at all — promote it to
   `packages/api/cdp/<resource>/` as `mutationOptions` and call it via a
   thin `useMutation(...)` wrapper.

7. **No barrels.** No `index.ts` re-export files anywhere inside a feature
   folder. Import paths are the source of truth — they tell a reader which
   file a symbol lives in without a second hop. The route imports
   `ThreadList` directly from `features/thread-list/thread-list`.

8. **Stories co-located.** A component's `.stories.tsx` lives in the same
   folder as its `.tsx`. Matches Kaizen. Deleting the component deletes the
   story in the same change. If a sub-feature folder ever gets noisy, the
   answer is to split it into nested sub-features (`header/search/`,
   `header/filters/`) — not to introduce a `stories/` bucket.

### Reference shape: `features/thread-list/`

```
thread-list/
├── thread-list.tsx               container (data hook + layout)
├── thread-list.stories.tsx
├── thread-list-content.tsx       state coordinator (loading/error/empty/list)
├── use-inbox-conversations.ts    feature-level data hook
│
├── header/                       grows: search, filter menu, sort, …
│   ├── thread-list-header.tsx
│   └── thread-list-header.stories.tsx
│
├── item/                         row presentation + data adapter
│   ├── thread-list-item.tsx      presentational (Kaizen-shaped)
│   ├── thread-list-item.stories.tsx
│   └── thread-list-row.tsx       adapter: InboxConversationListItem → item props
│
└── virtual-list/                 virtualization (swap-out boundary)
    ├── thread-virtual-list.tsx
    ├── thread-load-more-status-row.tsx
    └── use-load-more-conversations.ts
```

Only the **container**, the **state coordinator**, and the **feature data
hook** live at the root. Everything else lives in a subfolder.
