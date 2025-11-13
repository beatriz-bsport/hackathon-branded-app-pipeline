import { useNavigate } from "react-router";

import {
  Button,
  type ButtonProps,
  ListLayout,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useFilterTeachers } from "#src/hooks/useFilterTeachers";
import { useTeacherPermissions } from "#src/hooks/useTeacherPermissions";
import { URLS } from "#src/urls";
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

  const { searchInput, setSearchInput, clearSearchInput } = useFilterTeachers();

  const permissions = useTeacherPermissions();

  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <GoToArchivedListButton
        key="bt-navigate-to-archive-page"
        kind="icon-button"
        icon="box"
        label={t("pages.archived")}
        intent="default"
        color="main"
        size="md"
        onClick={() => navigate(URLS.ARCHIVED)}
      />,
    ],
  });

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.active")}
        callToActionButton={
          permissions.create ? (
            <ListLayout.Button
              iconLeft="plus"
              intent="call-to-action"
              color="main"
              label={t("activeList.actions.addTeacher")}
              onClick={onAddTeacherClick}
            />
          ) : null
        }
        endGroupActions={endGroupActions}
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
          onAddTeacherClick={onAddTeacherClick}
          permissions={permissions}
        />
        {permissions.create && (
          <AddTeacherModal
            onClose={onModalClose}
            onConfirmClick={onConfirmClick}
            open={openAddTeacherModal}
          />
        )}
      </ListLayout.Content>
    </ListLayout>
  );
};

function GoToArchivedListButton(props: ButtonProps) {
  const { t } = useTranslation("common");

  return (
    <Tooltip
      key="button-navigate-to-archive-page"
      label={t("pages.archived")}
      placement="bottom-left"
    >
      <Button {...props} />
    </Tooltip>
  );
}
