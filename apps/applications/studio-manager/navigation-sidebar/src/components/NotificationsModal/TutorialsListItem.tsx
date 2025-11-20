import { type FC } from "react";

import { type Locale } from "@bsport/i18n";
import { Body } from "@bsport/kaizen-primitive-core";

import { NavigationLink } from "#src/components/NavigationLink";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { NotificationItemLayout } from "./NotificationItemLayout";
import { useNotificationsNavigation } from "./NotificationsNavigationContext";

export type TutorialsListItemProps = {
  id: string;
  sectionNames: Record<Locale, string>;
  lessonNames: Record<Locale, string>;
  isNewSection: boolean;
  sectionId: number;
  lessonId: number;
};

const getLocalizedText = (
  translatedTextMap: Record<Locale, string>,
  language: Locale,
): string => {
  return translatedTextMap[language] || translatedTextMap["en"] || "";
};

const TutorialsListItem: FC<TutorialsListItemProps> = ({
  sectionNames,
  lessonNames,
  isNewSection,
  sectionId,
  lessonId,
}) => {
  const { t, i18n } = useTranslation("default");
  const { navigateAndClose } = useNotificationsNavigation();

  const language = i18n.language as Locale;
  const sectionName = getLocalizedText(sectionNames, language);
  const lessonName = getLocalizedText(lessonNames, language);

  let title: string;
  let description: string;

  if (isNewSection) {
    title = t("notifications.tutorials.newSection.title");
    description = t("notifications.tutorials.newSection.description", {
      sectionName,
    });
  } else {
    title = t("notifications.tutorials.newLesson.title");
    description = t("notifications.tutorials.newLesson.description", {
      lessonName,
      sectionName,
    });
  }

  const renderItem = () => (
    <NotificationItemLayout
      leftContent={
        <>
          <Body
            htmlVariant="span"
            size="lg"
            weight="bold"
            className="block truncate break-word"
          >
            {title}
          </Body>
          <Body
            htmlVariant="span"
            size="md"
            color="weak"
            className="block truncate break-word"
          >
            {description}
          </Body>
        </>
      }
    />
  );

  return (
    <NavigationLink
      item={{
        id: `${sectionId}-${lessonId}`,
        href: `${LEGACY_URLS.tutorial}/${sectionId}/${lessonId}`,
        revamped: false,
      }}
      renderElement={renderItem}
      navigate={navigateAndClose}
      wrapperConfig={{
        withOnClick: true,
        className: [
          "relative flex",
          "min-h-2xl py-xs px-md gap-xs",
          "border-b-stroke-thin border-b-stroke-divider",
          "hover:bg-surface-action-default-weak-hovered",
          "hover:cursor-pointer",
          "active:bg-surface-action-default-weak-pressed",
          "text-inherit no-underline",
        ].join(" "),
        tabIndex: 0,
      }}
    />
  );
};

export default TutorialsListItem;
