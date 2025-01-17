import { getTimezoneName } from "@bsport/timezone-utils";
import { type Env, ENVS } from "#src/constants";
//import { initSentry } from "#src/sentry";
import { getSessionId } from "#src/session";

const ENV_URLS: {
  [env in Env]: string;
} = {
  [ENVS.DEV]: "https://api.dev.bsport.io",
  [ENVS.LOCAL]: "http://localhost:3000",
  [ENVS.STAGING]: "https://api.staging.bsport.io",
  [ENVS.PRODUCTION]: "https://api.bsport.io",
};

type BsportFetchConfig = {
  env: Env;
};

export { ENVS };

export default function getFetchers(config: BsportFetchConfig) {
  const sessionId = getSessionId();
  //initSentry(config);
  return (
    uri: string,
    init: Parameters<typeof fetch>[1],
  ): ReturnType<typeof fetch> =>
    fetch(`${ENV_URLS[config.env]}/${uri}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Session-ID": sessionId,
        "X-Timezone-Name": getTimezoneName() || "unknown",
        "X-React-Referrer": window.location.href.slice(0, 250),
        "X-bsport-log-collection": "true",
        // missing X-Transaction-ID here
        // missing getBsportRequestFromHeader() here
        ...init?.headers,
      },
    });
}
