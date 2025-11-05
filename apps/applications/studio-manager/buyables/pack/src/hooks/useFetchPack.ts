import { useEffect } from "react";
import { useNavigate } from "react-router";

import { toast } from "@bsport/kaizen-primitive-core";
import { fetchPackAction } from "@bsport/store-buyables-pack";
import { useAsync } from "@bsport/use-async";

import { URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useFetchPack = ({ id }: { id?: number }) => {
  const { t } = useTranslation("details");

  const _handleFetchPack = async (id: number) => {
    return fetchPackAction(fetch, { id });
  };

  const navigate = useNavigate();

  const [{ isLoading }, fetchPack] = useAsync<typeof _handleFetchPack>({
    asyncFn: _handleFetchPack,
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
      fetchPack(id);
    }
  }, [id, fetchPack]);

  return {
    isLoading,
    fetchPack,
  };
};
