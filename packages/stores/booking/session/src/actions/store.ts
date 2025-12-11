import type { ManagerSession } from "@bsport/api-book";

import { sessionStore } from "#src/store";

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
