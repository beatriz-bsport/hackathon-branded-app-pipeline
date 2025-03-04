import { ListLayout } from "@bsport/kaizen-primitive-core";
import { useTranslation } from "#src/utils/i18n";
import { MemberListContent } from "./MemberListContent";

export const MemberListPage: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("pages.memberList")} />
      <ListLayout.Content className="hide-scrollbar h-full">
        <MemberListContent />
      </ListLayout.Content>
    </ListLayout>
  );
};
