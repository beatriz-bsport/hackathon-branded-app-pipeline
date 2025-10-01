import { ListLayout } from "@bsport/kaizen-primitive-core";

import { MarketingNotificationTable } from "#src/components/MarketingNotificationList/MarketingNotificationTable";
import { useTranslation } from "#src/utils/i18n";

const MarketingNotificationListPage: React.FC = () => {
  const { t } = useTranslation("marketingNotificationList");
  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("page.title")} />
      <ListLayout.Content>
        <MarketingNotificationTable />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default MarketingNotificationListPage;
