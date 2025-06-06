import { useParams } from "react-router";

import { LOCALES } from "@bsport/i18n";
import { Select } from "@bsport/kaizen-primitive-core";

import { i18nInstance } from "#src/utils/i18n";

import { StandaloneAuthentifier } from "./StandaloneAuthentifier";

export const StandaloneHome = () => {
  const { slug } = useParams();

  return (
    <div className="flex flex-col flex-grow items-center justify-center h-screen w-full sticky top-0 gap-xs">
      <p>
        You are running{" "}
        <code className="bg-luna-grey-200 p-xs">navigation-sidebar</code> in{" "}
        <b>{slug ? `federation mode: ${slug}` : "standalone mode"}</b>.
      </p>
      <p>It is intended for use in a federation context.</p>
      <div className="h-fit">
        <Select
          id="language-selector"
          items={LOCALES.map((locale) => {
            return {
              id: locale,
              label: locale.toUpperCase(),
            };
          })}
          name="language-selector"
          defaultValue={
            i18nInstance.resolvedLanguage?.toLocaleUpperCase() ||
            "Select language"
          }
          onSelect={(lng) => {
            i18nInstance.changeLanguage(lng.toLowerCase());
          }}
        />
      </div>
      <StandaloneAuthentifier />
    </div>
  );
};
