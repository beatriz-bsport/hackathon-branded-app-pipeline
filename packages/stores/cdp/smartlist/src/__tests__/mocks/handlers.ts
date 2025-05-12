import { HttpResponse, http } from "msw";

import mockSmartlists from "../fixtures/smartlists.json";

export const mockSearchResult = {
  results: mockSmartlists,
  count: mockSmartlists.length,
  next: null,
  previous: null,
};

/**
 * Mock handlers for the API endpoints
 */
export const handlers = [
  // Handler for fetching all smartlists
  http.get("http://localhost/api/v1/smartlist/group/", () => {
    return HttpResponse.json(mockSmartlists);
  }),

  // Handler for searching smartlists
  http.get(
    "http://localhost/customer-data-platform/v1/smartlist/group/search*",
    ({ request }) => {
      const url = new URL(request.url);
      const searchQuery = url.searchParams.get("q");

      if (searchQuery) {
        const filteredResults = mockSmartlists.filter((smartlist) =>
          smartlist.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        return HttpResponse.json({
          results: filteredResults,
          count: filteredResults.length,
          next: null,
          previous: null,
        });
      }

      return HttpResponse.json(mockSearchResult);
    },
  ),
];
