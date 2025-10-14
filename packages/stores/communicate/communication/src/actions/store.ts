import { communicationStore } from "#src/store";
import type { Communication } from "#src/types";

export const setCommunications = ({
  communications,
  count,
  page,
}: {
  communications: Communication[];
  count: number;
  page: number;
}) => {
  communicationStore.setState((state) => {
    const byId = communications.reduce((acc, comm) => {
      acc[comm.id] = comm;
      return acc;
    }, state.byId);

    return {
      ids: communications.map((comm) => comm.id),
      byId,
      count,
      page,
    };
  });
};
