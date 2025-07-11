import { useCallback, useState } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import {
  type Teacher,
  linkByEmailAction,
} from "@bsport/store-core-data-teacher";

import { useFetchTeachers } from "#src/hooks/useFetchTeachers";
import { LEGACY_URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

// Same as in @bsport/common but this avoid having this unecessary deps
const COACH_EDIT_EMAIL_ADDRESS_IS_STAFF_USER = 60002;
const COACH_CREATE_EMAIL_ADDRESS_IS_FRANCHISOR_USER = 60004;

export const useAddTeacherModal = () => {
  const { t } = useTranslation("common");
  const [openAddTeacherModal, setOpenAddTeacherModal] = useState(false);

  const { fetchTeacherPage } = useFetchTeachers({
    searchInput: "",
    archived: false,
  });

  const onAddTeacherClick = useCallback(() => {
    setOpenAddTeacherModal(true);
  }, []);

  const onModalClose = useCallback(() => {
    setOpenAddTeacherModal(false);
  }, []);

  const onConfirmClick = useCallback(
    async (input: string, callback: () => void) => {
      const response = await linkByEmailAction(fetch, { email: input });

      const onSuccess = (value: Teacher) => {
        // Refresh the page to display the new coach if it has been linked
        fetchTeacherPage();

        // Display a toast to navigate to the new teacher
        toast({
          title: t("activeList.addTeacherModal.linkedTeacher"),
          status: "default",
          icon: "user-plus-01",
          buttonLabel: t("activeList.addTeacherModal.actions.open"),
          onButtonClick: () => {
            window.location.assign(LEGACY_URLS.DETAILS(value.id));
          },
        });

        // Close the modal after cleaning the input
        callback?.();
        onModalClose();
      };

      response.fold(onSuccess, (error) => {
        if (error.statusCode === 499) {
          // Display a toast to inform about the error
          let errorMessage: string = "";
          if (
            error.customErrorCodes.includes(
              COACH_EDIT_EMAIL_ADDRESS_IS_STAFF_USER,
            )
          ) {
            errorMessage = t("activeList.addTeacherModal.errors.staffExists");
          }
          if (
            error.customErrorCodes.includes(
              COACH_CREATE_EMAIL_ADDRESS_IS_FRANCHISOR_USER,
            )
          ) {
            errorMessage = t(
              "activeList.addTeacherModal.errors.staffFranchiseExists",
            );
          }

          toast({
            title: errorMessage,
            status: "critical",
            icon: "alert-circle",
            buttonIcon: "x-close",
          });
        } else {
          // Navigate to the create page with the email preinput
          /** @todo Edit when we'll have the revamp one -> here it navigates to the old BO */
          window.location.assign(LEGACY_URLS.CREATE(input));
        }
      });
    },
    [onModalClose, fetchTeacherPage, t],
  );

  return {
    onAddTeacherClick,
    openAddTeacherModal,
    onModalClose,
    onConfirmClick,
  };
};
