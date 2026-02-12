import { FC } from "react";

import { MetaActivity } from "@bsport/api-book";
import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { EstablishmentSelectorField } from "./establishment-selector-field";
import { RoomBlueprintSelectorField } from "./room-blueprint-selector-field";
import { SyncOnSpiviField } from "./sync-on-spivi-field";
import { WellhubProductSelectorField } from "./wellhub-product-selector-field";

export const EstablishmentSection: FC<{
  fieldIdPrefix: string;
  establishmentId: number;
  roomBlueprintId: number | null;
  metaActivity: MetaActivity;
}> = ({ fieldIdPrefix, establishmentId, roomBlueprintId, metaActivity }) => {
  const { t } = useTranslation("sessionEdit");
  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t("editSessionForm.content.establishmentSectionTitle")}
      </Title>
      <EstablishmentSelectorField
        fieldIdPrefix={fieldIdPrefix}
        defaultSelectedId={establishmentId}
      />
      <RoomBlueprintSelectorField
        fieldIdPrefix={fieldIdPrefix}
        defaultSelectedId={roomBlueprintId}
      />
      <WellhubProductSelectorField
        fieldIdPrefix={fieldIdPrefix}
        isLivestream={metaActivity?.is_broadcast || false}
      />
      <SyncOnSpiviField fieldIdPrefix={fieldIdPrefix} />
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
    </section>
  );
};
