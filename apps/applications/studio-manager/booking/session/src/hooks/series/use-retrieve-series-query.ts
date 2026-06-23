import { useRetrieveGroupSession } from "#src/hooks/group-session/use-retrieve-group-session";

export const useRetrieveSeriesQuery = (seriesId: number | null) =>
  useRetrieveGroupSession(seriesId);
