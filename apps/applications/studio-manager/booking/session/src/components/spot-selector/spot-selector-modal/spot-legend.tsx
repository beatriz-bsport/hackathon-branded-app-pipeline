import type React from "react";

import type { CanvasElement, CanvasSpotData, SpotType } from "@bsport/api-book";
import { Body } from "@bsport/kaizen-primitive-core";

import { SpotElement } from "../spot-canvas/elements/spot-element";

export type SpotLegendProps = { spotTypes: SpotType[] };

const legendSample = (spotTypeId: number): CanvasElement<CanvasSpotData> => ({
  id: `legend-${spotTypeId}`,
  type: "spot",
  data: {
    index: 0,
    indexType: 0,
    spotTypeId,
    taken: false,
    selected: false,
    asset_identifier: null,
    x: 0,
    y: 0,
  },
});

/** Legend for spot types (e.g. Standard, VIP, Poolside); rendered horizontally and shown only when a session has multiple types. */
export const SpotLegend: React.FC<SpotLegendProps> = ({ spotTypes }) => {
  return (
    <div className="flex flex-wrap items-center gap-md" role="list">
      {spotTypes.map((st) => (
        <div key={st.id} role="listitem" className="flex items-center gap-2xs">
          <svg
            width={20}
            height={20}
            viewBox="-22 -22 44 44"
            aria-hidden="true"
            className="shrink-0"
          >
            <SpotElement
              element={legendSample(st.id)}
              spotType={st}
              assetUrl={undefined}
            />
          </svg>
          <Body size="sm" weight="weak" color="default">
            {st.name}
          </Body>
        </div>
      ))}
    </div>
  );
};
