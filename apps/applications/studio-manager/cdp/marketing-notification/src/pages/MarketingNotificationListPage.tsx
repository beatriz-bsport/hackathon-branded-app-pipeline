import { useState } from "react";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { EditMarketingNotificationModal } from "#src/components/MarketingNotificationEdition/EditMarketingNotificationModal";
import { MarketingNotificationTable } from "#src/components/MarketingNotificationList/MarketingNotificationTable";
import { useTranslation } from "#src/utils/i18n";

const MarketingNotificationListPage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { t } = useTranslation("marketingNotificationList");
  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("page.title")}
        callToActionButton={
          <Button
            size="md"
            color="main"
            intent="call-to-action"
            label={t("page.actions.createNotificationButton")}
            iconLeft="plus"
            onClick={() => setIsEditModalOpen(true)}
          />
        }
      />
      <ListLayout.Content>
        <MarketingNotificationTable />
        <EditMarketingNotificationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default MarketingNotificationListPage;
