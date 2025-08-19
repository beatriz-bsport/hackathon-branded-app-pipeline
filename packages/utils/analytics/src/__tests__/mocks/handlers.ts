import { HttpResponse, http } from "msw";

export const handlers = [
  // We don't need to read answers from Mixpanel, we only need to intercept requests
  http.post("https://api.mixpanel.com/track", async () => {
    return HttpResponse.json({ status: 200, ok: true });
  }),
  http.post("https://api.mixpanel.com/engage", () => {
    return HttpResponse.json({ status: 200, ok: true });
  }),
];
