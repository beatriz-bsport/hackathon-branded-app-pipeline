import { toast } from "@bsport/kaizen-primitive-core";
import { type Pack, createPackAction } from "@bsport/store-buyables-pack";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const createPackBound = createPackAction.bind(null, fetch);

export const useCreatePack = ({
  onSuccess,
}: {
  onSuccess: (value: Pack) => void;
}) => {
  const { t } = useTranslation("details");

  const [{ isLoading }, createPack] = useAsync<typeof createPackBound>({
    asyncFn: createPackBound,
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
    createPack,
  };
};
