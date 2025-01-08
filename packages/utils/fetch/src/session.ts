import { uuid } from "@bsport/random-utils";

let sessionId: string | undefined;

export const getSessionId = () => {
  if (!sessionId) {
    sessionId = uuid();
  }
  return sessionId;
};
