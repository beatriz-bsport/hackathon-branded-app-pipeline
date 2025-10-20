import { sessionStore } from "#src/store";
import type { Session } from "#src/types";

export const setSessions = ({
  sessions,
  count,
  page,
}: {
  sessions: Session[];
  count: number;
  page: number;
}) => {
  sessionStore.setState((state) => {
    const byId = sessions.reduce(
      (acc, session) => {
        acc[session.id] = session;
        return acc;
      },
      { ...state.sessions.byId },
    );

    return {
      sessions: {
        ids: sessions.map((session) => session.id),
        byId,
        count,
        page,
      },
    };
  });
};
