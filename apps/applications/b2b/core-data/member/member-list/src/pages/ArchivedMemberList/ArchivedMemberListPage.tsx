import { ListLayout } from "@bsport/kaizen-primitive-core";
import { useTranslation } from "#src/utils/i18n";
import { ArchivedMemberListContent } from "./ArchivedMemberListContent";

export const ArchivedMemberListPage: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("pages.memberList")} />
      <ListLayout.Content className="hide-scrollbar h-full">
        <ArchivedMemberListContent />
      </ListLayout.Content>
    </ListLayout>
  );
};
