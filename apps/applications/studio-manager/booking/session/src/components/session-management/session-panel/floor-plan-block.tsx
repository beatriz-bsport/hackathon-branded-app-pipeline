import type React from "react";

import {
  Accordion,
  Alert,
  Card,
  Loader,
  Title,
} from "@bsport/kaizen-primitive-core";

import { SpotCanvas, useCanvasData } from "#src/components/spot-selector";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export type FloorPlanBlockProps = {
  session: { id: number; room_blueprint: number | null };
};

export const FloorPlanBlock: React.FC<FloorPlanBlockProps> = ({ session }) => {
  const { t } = useTranslation("sessionManagement");
  const blueprintId = session.room_blueprint;

  const { isLoading, error, roomBlueprint, assets, spotTypes, takenSpots } =
    useCanvasData({ blueprintId, sessionId: session.id, fetch });

  if (blueprintId === null) return null;

  return (
    <Card>
      <Accordion>
        <Accordion.Item
          ariaLabel={t("floorPlan.header")}
          header={
            <Title htmlVariant="h4" color="default" weight="strong">
              {t("floorPlan.header")}
            </Title>
          }
        >
          <div className="pt-md">
            {isLoading ? (
              <Loader size="md" />
            ) : error ? (
              <Alert status="critical">{t("floorPlan.loadError")}</Alert>
            ) : roomBlueprint ? (
              <div className="h-[400px] overflow-hidden rounded-md border border-stroke-thin border-stroke-default bg-surface-default">
                <SpotCanvas
                  roomBlueprint={roomBlueprint}
                  assets={assets}
                  spotTypes={spotTypes}
                  takenSpots={takenSpots}
                />
              </div>
            ) : null}
          </div>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};
