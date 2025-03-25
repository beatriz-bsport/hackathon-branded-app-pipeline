# B2B Giftcard Application

Figma : <https://www.figma.com/design/eEGKKW5o5Awi1kOdbXIIdu/Giftcard?node-id=79-234081&t=w5U1OkMswDN3O2qw-0>

## Quickstart

### Run the Navigation Sidebar application

Our template uses Module Federation to run the Navigation Sidebar application.

In a first terminal, you need to build and preview the Navigation Sidebar application to expose a remote entry.

On the `apps/applications/b2b/navigation-sidebar` :

```
pnpm run build && pnpm run preview
```

From your application, you can run the script `federation:navigation` :

```
pnpm run federation:navigation
```

From anywhere :

```
pnpm exec nx build @bsport/sm-navigation-sidebar && pnpm exec nx preview @bsport/sm-navigation-sidebar
```

### Run your application

To run in localhost :

```sh
pnpm run dev
```

If you want to see the translations, you need to run the `translation:update` script :

```
pnpm run translation:update
```

This will automatically build translations files in `public/locales` folder.

### Build your application

To build your application :

```sh
pnpm run build
```

:warning: You can not preview your build !
React is defined as an external dependencies in the Vite config, thus it won't be in the final bundle.

## Todo

There are many things that remain to do. Here is an exhaustive list of them.

### CSS fixes

For now there are some theming issues (margin not working for instance)

### API package

- Need to move the API file in a package when the store-base package will be on dev.
- Get giftcard list should accept filter parameters.
- [Backend] Pagination to be implemented for Giftcard and GiftcardBackgroundImage
- [Backend] Implement an endpoint to restore GiftcardBackgroundImage

### Filtering

Filter has to be implemented in the List Page and the Archived List Page, using the same filter.

**Blockers**

- [Backend] Filtering is allowed on few fields on the backend, need to be extended.
- [Kaizen] The filter component does not allow numeric input (for instance if we want to filter regarding a value)
- [Design] How should the filter categories and values look like ?

**To be implemented**
Filter state should be implemented at the Page level to be shared between Header and Content.

### Page Display

**Blockers**

- [Kaizen] Not defined how Display should work in the HeaderLayout for now.

**To be implemented**
Display config (the fields to display or sort).

### Navigation

- Navigation to the details page
- Navigation to the create page (will it be a modal ?)

### GiftcardPreview as Business component

- GiftcardPreview should be a business component as it will be used in BO and Marketplace.
- GiftcardPreview css might need some refacto.

### Currency display

In the `GiftcardTable/utils.tsx` file, `getTableRowData` hardcodes "$" as currency. It should use a util to display the right currency in the right ordering.
