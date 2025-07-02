import { Link } from "react-router";

import { Breadcrumbs, ListLayout } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { ArchivedMemberListContent } from "./ArchivedMemberListContent";

export const ArchivedMemberListPage: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.archivedMemberList")}
        BreadcrumbsItems={[
          <Link key="to-active-member" to={URLS.INDEX}>
            <Breadcrumbs.Item text={t("pages.memberList")} />
          </Link>,
        ]}
      />
      <ListLayout.Content>
        <ArchivedMemberListContent />
      </ListLayout.Content>
    </ListLayout>
  );
};
