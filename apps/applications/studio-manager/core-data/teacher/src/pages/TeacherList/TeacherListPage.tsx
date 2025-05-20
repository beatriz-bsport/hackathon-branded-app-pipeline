import { useNavigate } from "react-router";

import { Button, ListLayout, Tooltip } from "@bsport/kaizen-primitive-core";

import { useTeacherFilters } from "#src/hooks/useTeacherFilters";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { AddTeacherModal } from "./AddTeacherModal";
import { useAddTeacherModal } from "./AddTeacherModal/useAddTeacherModal";
import { TeacherListContent } from "./TeacherListContent";

export const TeacherListPage: React.FC = () => {
  const { t } = useTranslation("common");

  const navigate = useNavigate();

  const {
    onAddTeacherClick,
    onConfirmClick,
    onModalClose,
    openAddTeacherModal,
  } = useAddTeacherModal();

  const { searchInput, setSearchInput, clearSearchInput } = useTeacherFilters();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.active")}
        callToActionButton={
          <Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            size="md"
            label={t("activeList.actions.addTeacher")}
            onClick={onAddTeacherClick}
          />
        }
        endGroupActions={[
          <Tooltip
            key="bt-navigate-to-archive-page"
            label={t("pages.archived")}
            placement="bottom-left"
          >
            <Button
              iconLeft="box"
              intent="default"
              color="main"
              size="md"
              onClick={() => navigate(ROUTES.ARCHIVED)}
            />
          </Tooltip>,
        ]}
        searchConfig={{
          id: "teacher-active-search",
          inputValue: searchInput,
          onInputValueChange: setSearchInput,
          onClear: clearSearchInput,
        }}
      />
      <ListLayout.Content>
        <TeacherListContent
          searchInput={searchInput}
          onAddTeacherClick={clearSearchInput}
        />
        <AddTeacherModal
          onClose={onModalClose}
          onConfirmClick={onConfirmClick}
          open={openAddTeacherModal}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};
