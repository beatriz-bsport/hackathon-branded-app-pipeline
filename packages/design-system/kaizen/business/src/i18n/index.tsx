import { type JSX, createContext, useContext } from "react";

import {
  type I18n,
  type InMemoryTranslationsLoader,
  type TFunctionGeneric,
  instanciateAppI18n,
} from "@bsport/i18n";

import type bookingTranslations from "#src/i18n/source/booking.json";
import type buyablesTranslations from "#src/i18n/source/buyables.json";
import type financialServicesTranslations from "#src/i18n/source/financial-services.json";

import i18nNamespaces from "./namespaces.json";

export type Translations = {
  booking: typeof bookingTranslations;
  buyables: typeof buyablesTranslations;
  "financial-services": typeof financialServicesTranslations;
};

/**
 * ========== CONTEXT & PROVIDER ==========
 *
 * -> React context to forward an i18nInstance
 * -> Context provider to make it accessible to consuming components
 */

type KaizenI18nContextType = {
  kaizenI18nInstance: I18n | undefined;
};

// eslint-disable-next-line react-refresh/only-export-components
const KaizenBusinessI18nContext = createContext<KaizenI18nContextType>({
  kaizenI18nInstance: undefined,
});

/**
 * Provide i18nInstance to Kaizen components inside an application.
 */
// eslint-disable-next-line react-refresh/only-export-components
const KaizenBusinessI18nProvider = ({
  kaizenI18nInstance,
  children,
}: {
  kaizenI18nInstance: I18n;
  children: React.ReactNode;
}) => {
  return (
    <KaizenBusinessI18nContext.Provider value={{ kaizenI18nInstance }}>
      {children}
    </KaizenBusinessI18nContext.Provider>
  );
};

/**
 * ========== I18N INSTANCE ==========
 *
 * -> Retrieve i18nNamespacePrefix to define prefix for the i18nInstance
 * -> Define inMemoryTranslationsLoader for the i18nInstance
 * -> Generate the i18nInstance and useTranslation related hook
 */

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

/* Function to retrieve translations from the build files in i18n/locales */
const inMemoryTranslationsLoader: InMemoryTranslationsLoader = async (
  locale,
  namespace,
) => {
  try {
    // For static analysis, avoid conditions inside the import, as well as using constants for filenames
    if (locale === "en") {
      return (await import(`./source/${namespace}.json`)).default || {};
    }
    return (
      (await import(`./locales/${locale}/${namespace}.json`)).default || {}
    );
  } catch (_error) {
    return {};
  }
};

const { i18nInstance, useTranslation } = instanciateAppI18n<Translations>({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces as string[],
  inMemoryTranslationsLoader,
  debug: false,
});

/**
 * ========== OBJECTS TO BE CONSUMED ==========
 *
 * Export objects to be consumed internally in the library
 * -> withKaizenBusinessI18n hoc to wrap each component in its own context (provide i18nInstance)
 * -> useKaizenI18nInstance to retrieve the i18nInstance
 */

/** Wrapper to inject i18nInstance in component context */
function withKaizenBusinessI18n<P>(
  Component: React.ComponentType<P>,
): React.ComponentType<P & JSX.IntrinsicAttributes> {
  const Wrapped: React.FC<P & JSX.IntrinsicAttributes> = (props) => (
    <KaizenBusinessI18nProvider kaizenI18nInstance={i18nInstance}>
      <Component {...props} />
    </KaizenBusinessI18nProvider>
  );

  Wrapped.displayName = `withKaizenBusinessI18n(${
    Component.displayName ?? Component.name ?? "Component"
  })`;

  return Wrapped;
}

/** Hook to retrieve the i18n instance to use in useTranslation options */
const useKaizenI18nInstance = () => {
  const context = useContext(KaizenBusinessI18nContext);
  if (!context) {
    throw new Error(
      [
        "useKaizenI18nInstance must be used within a KaizenBusinessI18nProvider.",
        "Wrap your component inside withKaizenBusinessI18n to fix that.",
      ].join("\n"),
    );
  }
  return context.kaizenI18nInstance;
};

export {
  useTranslation,
  useKaizenI18nInstance,
  withKaizenBusinessI18n,
  i18nNamespaces,
  i18nNamespacePrefix,
};

export type TFunction = TFunctionGeneric<Translations>;
