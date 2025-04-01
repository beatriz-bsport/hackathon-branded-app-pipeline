import { buildUrlParams, head } from '#src/http';

// origin of the current page, not the back-end server.
const ORIGIN_URI = new URL(
  self.location.origin ?? 'https://backoffice.bsport.io/', // default value mostly blocked by CSP but is here to prevent possible errors
);

export async function fetchOriginAPI(params: { currentTime?: string }) {
  return head(`${ORIGIN_URI}${buildUrlParams(params)}`);
}
