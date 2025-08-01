import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const SettingPage: React.FC = () => {
  const { t } = useTranslation("transactionalNotification");
  return (
    <DetailsLayout>
      <DetailsLayout.Header pageTitle={t("helloName", { name: "John Doe" })} />
      <DetailsLayout.Content>
        <p>Your content</p>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

export default SettingPage;
