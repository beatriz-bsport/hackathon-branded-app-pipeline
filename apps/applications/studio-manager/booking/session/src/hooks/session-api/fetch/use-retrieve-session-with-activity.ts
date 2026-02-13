import { SessionWithActivity } from "@bsport/api-book";

import { useRetrieveManagerSession } from "#src/hooks/session-api/fetch/use-retrieve-manager-session";
import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";

export const useRetrieveSessionWithActivity = (sessionId?: number) => {
  const sessionQuery = useRetrieveManagerSession(sessionId);
  const session = sessionQuery.data;

  const activitiesQuery = useFetchActivitiesByIds(
    session?.meta_activity ? [session.meta_activity] : [],
    !!session?.meta_activity,
    { select: (data) => data.results[0] }, // We know there's only one activity since we're fetching by ID, so we can select it directly
  );

  const activity = session?.meta_activity ? activitiesQuery.data : undefined;

  const sessionWithActivity: SessionWithActivity | undefined =
    session && activity ? { ...session, metaActivity: activity } : undefined;

  return {
    data: sessionWithActivity,
    isLoading: sessionQuery.isLoading || activitiesQuery.isLoading,
    isError: sessionQuery.isError || activitiesQuery.isError,
    error: sessionQuery.error ?? activitiesQuery.error,
  };
};
