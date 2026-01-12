import { useState } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";
import { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { EditMarketingNotificationModalWrapper } from "#src/components/MarketingNotificationEdition/EditMarketingNotificationModal";
import { MarketingNotificationTable } from "#src/components/MarketingNotificationList/MarketingNotificationTable";

const MarketingNotificationListPage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draftMarketingNotification, setDraftMarketingNotification] = useState<
    MarketingNotification | undefined
  >(undefined);
  return (
    <ListLayout>
      <ListLayout.Content>
        <MarketingNotificationTable
          handleCreateMarketingNotification={() => setIsEditModalOpen(true)}
          setDraftMarketingNotification={(marketingNotification) => {
            setDraftMarketingNotification(marketingNotification);
            setIsEditModalOpen(true);
          }}
        />
        <EditMarketingNotificationModalWrapper
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setDraftMarketingNotification(undefined);
          }}
          draftMarketingNotification={draftMarketingNotification}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default MarketingNotificationListPage;
