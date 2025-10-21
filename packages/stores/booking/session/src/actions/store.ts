import { sessionStore } from "#src/store";
import type { ManagerSession } from "#src/types";

export const setManagerSessions = ({
  sessions,
  count,
  page,
}: {
  sessions: ManagerSession[];
  count: number;
  page: number;
}) => {
  sessionStore.setState((state) => {
    const byId = sessions.reduce(
      (acc, session) => {
        acc[session.id] = session;
        return acc;
      },
      { ...state.managerSessions.byId },
    );

    return {
      managerSessions: {
        ids: sessions.map((session) => session.id),
        byId,
        count,
        page,
      },
    };
  });
};
