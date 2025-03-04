import { ListLayout } from "@bsport/kaizen-primitive-core";
import { useTranslation } from "#src/utils/i18n";

export const MemberListPage: React.FC = () => {
  const { t } = useTranslation("common");
  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("pages.memberList")} />
      <ListLayout.Content className="hide-scrollbar">
        <p>Hello world</p>
      </ListLayout.Content>
    </ListLayout>
  );
};
