import { Link } from "react-router";

import { Breadcrumbs, ListLayout } from "@bsport/kaizen-primitive-core";

import { useTeacherFilters } from "#src/hooks/useTeacherFilters";
import { ROUTES } from "#src/routes";
import { useTranslation } from "#src/utils/i18n";

export const ArchivedTeacherListPage: React.FC = () => {
  const { t } = useTranslation("common");

  const { searchInput, setSearchInput, clearSearchInput } = useTeacherFilters();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.archived")}
        BreadcrumbsItems={[
          <Link key="to-active-teacher" to={ROUTES.ACTIVE}>
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
        <p>
          Archived list - Searching <b>{searchInput}</b>
        </p>
      </ListLayout.Content>
    </ListLayout>
  );
};
