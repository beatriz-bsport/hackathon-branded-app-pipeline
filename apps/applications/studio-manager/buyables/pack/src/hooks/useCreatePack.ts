import { toast } from "@bsport/kaizen-primitive-core";
import {
  type Pack,
  type PackFormData,
  createPackAction,
} from "@bsport/store-buyables-pack";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useCreatePack = ({
  onSuccess,
}: {
  onSuccess: (value: Pack) => void;
}) => {
  const { t } = useTranslation("details");

  const _handleCreatePack = async (data: PackFormData) => {
    return createPackAction(fetch, data);
  };

  const [{ isLoading }, handleCreatePack] = useAsync<typeof _handleCreatePack>({
    asyncFn: _handleCreatePack,
    onSuccess: ({ value }) => {
      onSuccess(value);
    },
    onFailure: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("createModal.failToCreate"),
        buttonIcon: "x-close",
      });
    },
  });

  return {
    isLoading,
    handleCreatePack,
  };
};
