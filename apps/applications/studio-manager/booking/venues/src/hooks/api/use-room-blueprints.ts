import { useSuspenseQuery } from "@tanstack/react-query";

import { roomBlueprintsQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

type UseRoomBlueprintsParams = {
  venueId: number;
  page: number;
  pageSize: number;
};

export const useRoomBlueprints = ({
  venueId,
  page,
  pageSize,
}: UseRoomBlueprintsParams) =>
  useSuspenseQuery(
    roomBlueprintsQueryOptions(fetch, {
      establishment: venueId,
      disabled: false,
      page,
      page_size: pageSize,
    }),
  );
