import { Link } from "react-router";

import { Breadcrumbs, ListLayout } from "@bsport/kaizen-primitive-core";

import { useFilterTeachers } from "#src/hooks/useFilterTeachers";
import { useTeacherPermissions } from "#src/hooks/useTeacherPermissions";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { ArchivedTeacherListContent } from "./ArchivedTeacherListContent";

export const ArchivedTeacherListPage: React.FC = () => {
  const { t } = useTranslation("common");

  const { searchInput, setSearchInput, clearSearchInput } = useFilterTeachers();

  const permissions = useTeacherPermissions();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.archived")}
        BreadcrumbsItems={[
          <Link key="to-active-teacher" to={URLS.ACTIVE}>
            <Breadcrumbs.Item text={t("pages.active")} />
          </Link>,
        ]}
        searchConfig={{
          id: "teacher-archived-search",
          inputValue: searchInput,
          onInputValueChange: setSearchInput,
          onClear: clearSearchInput,
        }}
      />
      <ListLayout.Content>
        <ArchivedTeacherListContent
          searchInput={searchInput}
          permissions={permissions}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};
