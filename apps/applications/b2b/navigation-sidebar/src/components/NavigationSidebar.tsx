import { Button, Divider, NavigationMenu } from "@bsport/kaizen-primitive-core";
import { Fragment } from "react/jsx-runtime";
import { I18nextProvider, i18nInstance, useTranslation } from "#src/utils/i18n";
import { getNavigationItems } from "./navigation-items";

const NavigationSidebarContent = () => {
  const { t } = useTranslation("default");
  const categories = getNavigationItems({ t });
  return (
    <div
      className={
        "h-screen hide-scrollbar overflow-y-scroll w-[240px] py-md " +
        "bg-surface-page-navigation shrink-0 flex flex-col justify-between"
      }
    >
      <div>
        {/* TODO: Add separators to NavigationMenu */}
        {/* TODO: Add hrefs */}
        {categories.map((items, index) => (
          <Fragment key={`category-${index}`}>
            <NavigationMenu className="p-xs" items={items} />
            {index < categories.length - 1 ? (
              <Divider className="border-stroke-thin" />
            ) : null}
          </Fragment>
        ))}
      </div>
      {/* TODO: Replace with Card when styles are fixed */}
      <div
        className={
          "p-xs mt-md mx-xs flex flex-col gap-2xs rounded-md " +
          "bg-surface-default-elevated border-stroke-thin border-stroke-default"
        }
      >
        <Button
          className="justify-between"
          label={t("revampCard.betaFeedbackLink")}
          intent="flat"
          size="md"
          color="main"
          iconRight="link-external-02"
          fullWidth
        />
        <Button
          className="justify-between"
          label={t("revampCard.goBackToOldUi")}
          intent="flat"
          size="md"
          color="default"
          iconRight="arrow-right"
          fullWidth
        />
      </div>
    </div>
  );
};

const NavigationSidebar = () => {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <NavigationSidebarContent />
    </I18nextProvider>
  );
};

export default NavigationSidebar;
