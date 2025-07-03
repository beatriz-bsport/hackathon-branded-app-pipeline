import { HttpResponse, http } from "msw";

import {
  SMARTLIST_DELETION_BLOCKED_BY_CADENCES,
  SMARTLIST_DELETION_BLOCKED_BY_COMMUNICATION_GROUPS,
  SMARTLIST_DELETION_FAILED,
} from "#src/constants";
import type { Smartlist } from "#src/types";

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

  // Handler for creating a new smartlist
  http.post("http://localhost/api/v1/smartlist/group/", async ({ request }) => {
    const requestBody = (await request.json()) as {
      name: string;
      description: string;
      company: number;
    };

    // If the name contains "Invalid", return an error response
    if (requestBody.name && requestBody.name.includes("Invalid")) {
      return HttpResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Create a new smartlist with the request data and a generated ID
    const newSmartlist = {
      id: 999,
      company: requestBody.company,
      name: requestBody.name,
      description: requestBody.description,
      member_base: 1,
      has_active_communication_group_configs: false,
    };

    // Return the newly created smartlist
    return HttpResponse.json(newSmartlist, { status: 201 });
  }),

  // Handler for editing an existing smartlist
  http.patch(
    "http://localhost/api/v1/smartlist/group/:id/",
    async ({ request, params }) => {
      const id = Number(params.id);
      const requestBody = (await request.json()) as {
        name?: string;
        description?: string;
      };

      // If the name contains "Invalid", return an error response
      if (requestBody.name && requestBody.name.includes("Invalid")) {
        return HttpResponse.json({ error: "Invalid data" }, { status: 400 });
      }

      // Find the smartlist to update
      const smartlistIndex = mockSmartlists.findIndex((item) => item.id === id);

      if (smartlistIndex === -1) {
        return HttpResponse.json(
          { error: "Smartlist not found" },
          { status: 404 },
        );
      }

      // Create an updated smartlist with the request data
      const updatedSmartlist: Smartlist = {
        ...mockSmartlists[smartlistIndex],
        ...(requestBody.name && { name: requestBody.name }),
        ...(requestBody.description && {
          description: requestBody.description,
        }),
      };

      // Return the updated smartlist
      return HttpResponse.json(updatedSmartlist, { status: 200 });
    },
  ),

  // Handler for deleting an existing smartlist
  http.delete("http://localhost/api/v1/smartlist/group/:id/", ({ params }) => {
    const id = Number(params.id);

    // Simulate specific error scenarios based on ID (check these first)
    if (id === 101) {
      // Simulate general deletion failure
      return HttpResponse.json(
        {
          error: "General deletion failed",
          error_code: SMARTLIST_DELETION_FAILED,
        },
        { status: 400 },
      );
    }

    if (id === 102) {
      // Simulate deletion blocked by communication groups
      return HttpResponse.json(
        {
          error: "Deletion blocked by communication groups",
          error_code: SMARTLIST_DELETION_BLOCKED_BY_COMMUNICATION_GROUPS,
        },
        { status: 400 },
      );
    }

    if (id === 103) {
      // Simulate deletion blocked by cadences
      return HttpResponse.json(
        {
          error: "Deletion blocked by cadences",
          error_code: SMARTLIST_DELETION_BLOCKED_BY_CADENCES,
        },
        { status: 400 },
      );
    }

    // Find the smartlist to delete (for normal cases)
    const smartlistIndex = mockSmartlists.findIndex((item) => item.id === id);

    if (smartlistIndex === -1) {
      return HttpResponse.json(
        { error: "Smartlist not found" },
        { status: 404 },
      );
    }

    // Return a success response for existing smartlists
    return new HttpResponse(null, { status: 204 });
  }),

  // Handler for duplicating an existing smartlist
  http.post(
    "http://localhost/api/v1/smartlist/group/:id/create_copy/",
    ({ params }) => {
      const id = Number(params.id);

      // Find the smartlist to duplicate
      const smartlistIndex = mockSmartlists.findIndex((item) => item.id === id);

      if (smartlistIndex === -1) {
        return HttpResponse.json(
          { error: "Smartlist not found" },
          { status: 404 },
        );
      }

      // Create a duplicate smartlist with a new ID and "Copy of" prefix in the name
      const originalSmartlist = mockSmartlists[smartlistIndex];
      const duplicatedSmartlist: Smartlist = {
        ...originalSmartlist,
        id: 1000, // Use a unique ID for the duplicate
        name: `Copy of ${originalSmartlist.name}`,
      };

      // Return the duplicated smartlist
      return HttpResponse.json(duplicatedSmartlist, { status: 200 });
    },
  ),
];
