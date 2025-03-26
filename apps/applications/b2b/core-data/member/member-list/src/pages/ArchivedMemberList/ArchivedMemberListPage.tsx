import { ListLayout } from "@bsport/kaizen-primitive-core";
import { useTranslation } from "#src/utils/i18n";
import { ArchivedMemberListContent } from "./ArchivedMemberListContent";

export const ArchivedMemberListPage: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.archivedMemberList")}
        breadcrumbsItems={[
          {
            id: "member",
            text: t("pages.memberList"),
            href: "/",
          },
        ]}
      />
      <ListLayout.Content>
        <ArchivedMemberListContent />
      </ListLayout.Content>
    </ListLayout>
  );
};
