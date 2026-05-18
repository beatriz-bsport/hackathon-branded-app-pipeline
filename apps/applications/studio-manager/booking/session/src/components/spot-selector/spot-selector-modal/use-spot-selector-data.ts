import { useQuery } from "@tanstack/react-query";

import { retrieveSessionQueryOptions } from "@bsport/api-book";
import type { Fetch } from "@bsport/fetch";

import {
  type UseCanvasDataResult,
  useCanvasData,
} from "../spot-canvas/use-canvas-data";

export type UseSpotSelectorDataArgs = {
  sessionId: number | null;
  fetch: Fetch;
  /** Defaults to true. Pass false to keep all queries idle (e.g. when the
   *  modal is closed) so we don't issue requests for a panel the user can't
   *  see. */
  enabled?: boolean;
};

export type UseSpotSelectorDataResult = UseCanvasDataResult & {
  hasBlueprint: boolean;
};

export const useSpotSelectorData = ({
  sessionId,
  fetch,
  enabled = true,
}: UseSpotSelectorDataArgs): UseSpotSelectorDataResult => {
  const session = useQuery({
    ...retrieveSessionQueryOptions(fetch as never, sessionId ?? 0),
    enabled: enabled && sessionId !== null,
  });

  // Only treat hasBlueprint as decided once the session query resolves —
  // otherwise the modal flashes "no blueprint" during the initial load.
  const sessionResolved = session.data !== undefined;
  const blueprintId = session.data?.room_blueprint ?? null;
  const hasBlueprint = sessionResolved && blueprintId !== null;
  // Legacy parity: an override coach (e.g. substitute teacher) takes over the
  // session's teacher slot. Render the override's photo/name when present.
  const coachId = session.data?.coach_override ?? session.data?.coach ?? null;

  const canvas = useCanvasData({
    blueprintId: enabled ? blueprintId : null,
    sessionId: enabled ? sessionId : null,
    fetch,
    coachId: enabled ? coachId : null,
  });

  const isLoading =
    enabled &&
    ((sessionId !== null && session.isLoading) ||
      (hasBlueprint && canvas.isLoading));

  const error = (session.error as Error | null) ?? canvas.error;

  return {
    ...canvas,
    isLoading,
    error,
    hasBlueprint,
  };
};
