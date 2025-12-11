import { HttpResponse, http } from "msw";

import companyFeaturesData from "../fixtures/company-features.json";

export const handlers = [
  http.get("https://api.dev.bsport.io/core-data/v1/company/features/", () => {
    return HttpResponse.json(companyFeaturesData);
  }),

  http.get("https://api.dev.bsport.io/core-data/v1/company/theme/me/", () => {
    return HttpResponse.json({});
  }),

  http.get("https://api.dev.bsport.io/staff-management/v1/role/role/", () => {
    return HttpResponse.json({});
  }),

  http.get("https://api.dev.bsport.io/platform/v0/saas/access_level", () => {
    return HttpResponse.json({});
  }),

  http.get(
    "https://unleash.tooling.bsport.io/api/frontend?sessionId=995623640&appName=studio-manager&environment=default",
    () => {
      return HttpResponse.json({ toggles: [] });
    },
  ),
];
