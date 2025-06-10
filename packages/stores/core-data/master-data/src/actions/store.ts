import { buildById } from "@bsport/store-base";

import { sctStore } from "#src/store";
import type { sct } from "#src/types";

export const setScts = ({ scts }: { scts: sct[] }) => {
  sctStore.setState((state) => ({
    ids: scts.map((sct) => sct.id),
    byId: buildById<sct>({ initial: state.byId, newItems: scts }),
  }));
};
