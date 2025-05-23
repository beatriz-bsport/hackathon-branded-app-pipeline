import { HttpResponse, http } from "msw";

import authData from "../fixtures/auth.json";
import companyFeaturesData from "../fixtures/company-features.json";

interface LoginRequest {
  email: string;
  password: string;
}

export const handlers = [
  http.post("http://localhost/api/v1/auth/login/", async ({ request }) => {
    const requestBody = (await request.json()) as LoginRequest;

    if (
      requestBody.email === "test@example.com" &&
      requestBody.password === "password"
    ) {
      return HttpResponse.json(authData);
    }

    return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }),

  http.get("http://localhost/api/v1/company/features/", ({ request }) => {
    console.log("MSW: company features handler - localhost", request.url);
    return HttpResponse.json(companyFeaturesData);
  }),

  http.get(
    "https://api.dev.bsport.io/core-data/v1/company/features/",
    ({ request }) => {
      console.log("MSW: company features handler - dev API", request.url);
      return HttpResponse.json(companyFeaturesData);
    },
  ),
];
