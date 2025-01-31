# Internationalization (i18n) package

## Installation

1. Add `@bsport/i18n` to your project dependencies :

   ```json
   {
     "dependencies": {
       "@bsport/i18n": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import utilities from the package, and provide required information to init and get i18n tools to run with your application. Set this in `src/utils/i18n.ts`.

   ```tsx
   // src/utils/i18n.ts
   import {
     initI18n,
     getNamespacePrefixer,
     getUseTranslation,
     getWithTranslation,
   } from "@bsport/i18n";

   import namespaceList from "#src/i18n/namespaces.json";

   const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

   export const i18nInstance = initI18n({
     applicationName: i18nNamespacePrefix,
     namespaces: namespaceList,
   });

   export const useTranslation = getUseTranslation({
     applicationName: i18nNamespacePrefix,
   });

   export const withTranslation = getWithTranslation({
     applicationName: i18nNamespacePrefix,
   });

   export const namespacePrefixer = getNamespacePrefixer({
     applicationName: i18nNamespacePrefix,
   });
   ```

3. Configure your application translations: take a look at [@bsport/i18n-management](../../../tools/i18n-management/README.md).

4. Use i18n tools in components.

   ```tsx
   import { useTranslation } from "#src/utils/i18n";

   const MyComponent: React.FC = () => {
     const { t } = useTranslation("namespaceAlpha");
     return <div>{t("my.i18nKey")}</div>;
   };
   ```
