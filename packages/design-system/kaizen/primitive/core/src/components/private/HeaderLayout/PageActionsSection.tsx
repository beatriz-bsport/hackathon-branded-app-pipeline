import classNames from "classnames";
import React from "react";

import Badge, { type BadgeProps } from "#src/components/Badge";
import Breadcrumbs, {
  type BreadcrumbsProps,
} from "#src/components/Breadcrumbs";
import Button from "#src/components/Button";
import Chip, { type ChipProps } from "#src/components/Chip";
import Tabs, { type TabsProps } from "#src/components/Tabs";
import Title from "#src/components/Title";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import CustomActionsSection, {
  type CustomActionsSectionProps,
} from "./CustomActionsSection";

export type PageActionsSectionProps = {
  breadcrumbsItems?: BreadcrumbsProps["breadcrumbsItems"];
  BreadcrumbsItems?: BreadcrumbsProps["BreadcrumbsItems"];
  onEditTitleClick?: () => void;
  pageStatusBadge?: BadgeProps;
  pageStatusChip?: ChipProps;
  pageTabs?: TabsProps;
  pageTitle: string;
} & CustomActionsSectionProps;

const PageActionsSection: React.FC<PageActionsSectionProps> = ({
  breadcrumbsItems,
  callToActionButton,
  endGroupActions,
  BreadcrumbsItems,
  onEditTitleClick,
  pageStatusChip,
  pageStatusBadge,
  pageTabs,
  pageTitle,
  startGroupActions,
}) => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });

  return (
    <div
      className={classNames("px-md", {
        "border border-stroke-weak border-b-solid border-b-stroke-thin":
          !!pageTabs,
        "pt-xs": !!pageTabs,
        "py-xs": !pageTabs,
      })}
    >
      <div className="py-xs gap-2xs flex flex-col ">
        {(breadcrumbsItems || BreadcrumbsItems) && (
          <Breadcrumbs
            breadcrumbsItems={breadcrumbsItems}
            BreadcrumbsItems={BreadcrumbsItems}
          />
        )}
        <div className="flex flex-row gap-xs justify-between items-center">
          <div className="flex flex-row gap-xs items-start justify-start flex-1 min-w-0">
            <Title
              htmlVariant="h1"
              weight="stronger"
              className="flex-1 min-w-0 line-clamp-2 hyphens-auto break-words [overflow-wrap:anywhere]"
            >
              {pageTitle}
            </Title>
            {onEditTitleClick && (
              <Button
                kind="icon-button"
                label={t("headerLayout.editTitle")}
                icon="pencil-02"
                onClick={onEditTitleClick}
                intent="flat"
                color="default"
                size="md"
              />
            )}
            {pageStatusBadge && <Badge {...pageStatusBadge} />}
            {pageStatusChip && <Chip {...pageStatusChip} />}
          </div>
          {!pageTabs && (
            <CustomActionsSection
              callToActionButton={callToActionButton}
              endGroupActions={endGroupActions}
              startGroupActions={startGroupActions}
            />
          )}
        </div>
      </div>
      {pageTabs && (
        <div className="flex flex-row justify-between items-center pb-[var(--kz-spacing-xs)] sm:pb-[0px]">
          <Tabs {...pageTabs} orientation="horizontal" className="sm:pt-xs" />
          <CustomActionsSection
            callToActionButton={callToActionButton}
            endGroupActions={endGroupActions}
            startGroupActions={startGroupActions}
          />
        </div>
      )}
    </div>
  );
};

export default PageActionsSection;
