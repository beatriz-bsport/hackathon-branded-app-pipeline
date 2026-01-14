import { useState } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";
import { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { DeleteTagModal } from "#src/components/Common/Modal/DeleteMarketingNotificationModal";
import { EditMarketingNotificationModalWrapper } from "#src/components/MarketingNotificationEdition/EditMarketingNotificationModal";
import { MarketingNotificationTable } from "#src/components/MarketingNotificationList/MarketingNotificationTable";
import { useFilterNotificationType } from "#src/hooks/layout/use-filter-notification-type";
import { useTranslation } from "#src/utils/i18n";

export type NotificationModalActions = "create" | "delete" | "edit" | undefined;

export type ToggleNotificationModalParams = {
  action: NotificationModalActions;
  marketingNotification?: MarketingNotification;
};

const MarketingNotificationListPage: React.FC = () => {
  const [currentInlineAction, setCurrentInlineAction] =
    useState<NotificationModalActions>(undefined);
  const [draftMarketingNotification, setDraftMarketingNotification] = useState<
    MarketingNotification | undefined
  >(undefined);
  const { t } = useTranslation("marketingNotificationList");
  const handleCloseModal = () => {
    setCurrentInlineAction(undefined);
    setDraftMarketingNotification(undefined);
  };
  const { filterConfig, filterRef, activeFilters, handleClearFilters } =
    useFilterNotificationType();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("page.title")}
        callToActionButton={
          <ListLayout.Button
            color="main"
            intent="call-to-action"
            label={t("page.actions.createNotificationButton")}
            iconLeft="plus"
            onClick={() => {
              setCurrentInlineAction("create");
              setDraftMarketingNotification(undefined);
            }}
          />
        }
        filterConfig={filterConfig}
        filterRef={filterRef}
      />
      <ListLayout.Content>
        <MarketingNotificationTable
          activeFilters={activeFilters}
          handleClearFilters={handleClearFilters}
          handleMarketingNotificationModalAction={({
            marketingNotification,
            action,
          }) => {
            setDraftMarketingNotification(marketingNotification);
            setCurrentInlineAction(action);
          }}
        />
        {currentInlineAction === "create" || currentInlineAction === "edit" ? (
          <EditMarketingNotificationModalWrapper
            isOpen={true}
            onClose={handleCloseModal}
            draftMarketingNotification={draftMarketingNotification}
          />
        ) : null}
        {currentInlineAction === "delete" && draftMarketingNotification ? (
          <DeleteTagModal
            isOpen={true}
            notification={draftMarketingNotification}
            onClose={handleCloseModal}
          />
        ) : null}
      </ListLayout.Content>
    </ListLayout>
  );
};

export default MarketingNotificationListPage;
