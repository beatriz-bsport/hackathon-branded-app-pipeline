import type { FC } from "react";
import { useParams } from "react-router";

import {
  DetailsLayout,
  Loader,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { selectPack, usePackStore } from "@bsport/store-buyables-pack";

import { SelectedItemsContextProvider } from "#src/contexts/selectedItemsContext";
import { useFetchPack } from "#src/hooks/useFetchPack";
import { useTranslation } from "#src/utils/i18n";

import { PackDetailsPage } from "./PackDetailsPage";

export const PackDetailsEntry: FC = () => {
  const { t } = useTranslation("details");

  // Retrieve id from query params
  const { id } = useParams();
  const parsedId = id ? parseInt(id, 10) : undefined;
  const validId = parsedId && !isNaN(parsedId) ? parsedId : undefined;

  // Fetch Pack value related to this id
  const { isLoading } = useFetchPack({ id: validId });
  const pack = usePackStore((state) => selectPack(state, validId));

  const { detailsLayoutProps } = useDetailsLayout();

  if (!pack) {
    return isLoading ? (
      <DetailsLayout {...detailsLayoutProps}>
        <DetailsLayout.Header pageTitle={t("detailsPage.loading")} />
        <DetailsLayout.Content>
          <Loader size="xl" />
        </DetailsLayout.Content>
      </DetailsLayout>
    ) : null;
  }

  return (
    <SelectedItemsContextProvider>
      <PackDetailsPage pack={pack} />
    </SelectedItemsContextProvider>
  );
};
