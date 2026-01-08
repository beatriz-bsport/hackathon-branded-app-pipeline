import { useState } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { EditMarketingNotificationModalWrapper } from "#src/components/MarketingNotificationEdition/EditMarketingNotificationModal";
import { MarketingNotificationTable } from "#src/components/MarketingNotificationList/MarketingNotificationTable";

const MarketingNotificationListPage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  return (
    <ListLayout>
      <ListLayout.Content>
        <MarketingNotificationTable
          handleCreateNotification={() => setIsEditModalOpen(true)}
        />
        <EditMarketingNotificationModalWrapper
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default MarketingNotificationListPage;
