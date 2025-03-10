import { Button, Card, NavigationMenu } from "@bsport/kaizen-primitive-core";
import { I18nextProvider, i18nInstance, useTranslation } from "#src/utils/i18n";
import { getNavigationElements } from "./navigation-items";

const NavigationSidebarContent = () => {
  const { t } = useTranslation("default");
  const navigationElements = getNavigationElements({ t });
  return (
    <div
      className={
        "h-screen hide-scrollbar overflow-y-scroll w-[240px] py-md " +
        "bg-surface-page-navigation shrink-0 flex flex-col justify-between"
      }
    >
      <NavigationMenu className="px-xs" elements={navigationElements} />
      <Card elevated className="p-xs mt-md mx-xs flex flex-col gap-2xs">
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
      </Card>
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
