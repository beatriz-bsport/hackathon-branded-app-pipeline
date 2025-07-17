import { ListLayout } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const TagsPage: React.FC = () => {
  const { t } = useTranslation("tags");
  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("helloName", { name: "John Doe" })} />
      <ListLayout.Content>
        <p>Your content</p>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default TagsPage;
