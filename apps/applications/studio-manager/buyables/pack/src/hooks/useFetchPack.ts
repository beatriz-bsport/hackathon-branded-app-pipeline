import { useEffect } from "react";
import { useNavigate } from "react-router";

import { toast } from "@bsport/kaizen-primitive-core";
import { type Pack, fetchPackAction } from "@bsport/store-buyables-pack";
import { useAsync } from "@bsport/use-async";

import { URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const fetchPackBound = fetchPackAction.bind(null, fetch);

export const useFetchPack = ({
  id,
  onSuccess,
}: {
  id?: number;
  onSuccess?: (pack: Pack) => void;
}) => {
  const { t } = useTranslation("details");

  const navigate = useNavigate();

  const [{ isLoading }, fetchPack] = useAsync<typeof fetchPackBound>({
    asyncFn: fetchPackBound,
    onSuccess: ({ value }) => {
      onSuccess?.(value);
    },
    onFailure: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("detailsPage.canNotFindPack"),
        buttonIcon: "x-close",
      });
      navigate(URLS.INDEX);
    },
  });

  useEffect(() => {
    if (id) {
      fetchPack({ id });
    }
  }, [id, fetchPack]);

  return {
    isLoading,
    fetchPack,
  };
};
