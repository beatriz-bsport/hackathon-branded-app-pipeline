import { toast } from "@bsport/kaizen-primitive-core";
import { type Pack, updatePackAction } from "@bsport/store-buyables-pack";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const updatePackBound = updatePackAction.bind(null, fetch);

type UseUpdatePackProps = {
  onSuccess: (pack: Pack) => void;
};

export const useUpdatePack = ({ onSuccess }: UseUpdatePackProps) => {
  const { t } = useTranslation("details");

  const [{ isLoading }, handleUpdatePack] = useAsync<typeof updatePackBound>({
    asyncFn: updatePackBound,
    onFailure: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("detailsPage.updatePack.failToUpdate"),
        buttonIcon: "x-close",
      });
    },
    onSuccess: ({ value }) => {
      toast({
        status: "positive",
        icon: "info-circle",
        title: t("detailsPage.updatePack.success"),
        buttonIcon: "x-close",
      });
      onSuccess(value);
    },
  });

  return {
    isLoading,
    handleUpdatePack,
  };
};
