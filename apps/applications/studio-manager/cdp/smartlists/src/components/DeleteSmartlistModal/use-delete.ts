import { useRef } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import { fetchCadencesInSmartlistAction } from "@bsport/store-cdp-smartlist";

import { useDeleteSmartlist } from "#src/api/use-delete-smartlist";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const fetchCadencesInSmartlist = fetchCadencesInSmartlistAction.bind(
  null,
  fetch,
);

export const useDelete = ({
  onSuccess,
  onFailure,
  onCadencesFound,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
  onCadencesFound?: (cadences: number[]) => void;
}) => {
  const { t } = useTranslation("list");

  const fetchingCadencesRef = useRef(false);

  const { deleteSmartlist: deleteTrigger, isLoading: isDeleting } =
    useDeleteSmartlist({
      onSuccess: () => {
        onSuccess?.();

        toast({
          status: "default",
          icon: "trash-01",
          title: t("toasts.success.deleted"),
          buttonIcon: "x-close",
        });
      },
      onFailure: () => {
        onFailure?.();

        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("toasts.error.deleteFailed"),
          buttonIcon: "x-close",
        });
      },
    });

  const deleteSmartlist = async (params: { id: number }) => {
    if (!isDeleting && !fetchingCadencesRef.current) {
      fetchingCadencesRef.current = true;

      const result = await fetchCadencesInSmartlist(params);

      fetchingCadencesRef.current = false;

      result.fold(
        (cadences) => {
          if (cadences.length > 0) {
            /**
             * When cadences are found, we don't delete the smartlist
             * and instead show the modal with the cadences list
             *
             * This should be handled by the BE soon, we should't have to do this
             * the BE needs to add a proper validation to prevent deleting a smartlist
             * that is being used by a cadence
             */
            onCadencesFound?.(cadences);
          } else {
            deleteTrigger(params);
          }
        },
        () => {
          onFailure?.();
          toast({
            status: "critical",
            icon: "alert-circle",
            title: t("toasts.error.deleteFailed"),
            buttonIcon: "x-close",
          });
        },
      );
    }
  };

  return {
    deleteSmartlist,
    isDeleting,
  } as const;
};
