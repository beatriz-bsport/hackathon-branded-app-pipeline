import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTestFetch } from "@bsport/fetch/test";

import {
  createSmartlistAction,
  deleteSmartlistAction,
  duplicateSmartlistAction,
  editSmartlistAction,
  fetchSmartlistsAction,
} from "#src/actions";
import {
  SMARTLIST_DELETION_BLOCKED_BY_CADENCES,
  SMARTLIST_DELETION_BLOCKED_BY_COMMUNICATION_GROUPS,
  SMARTLIST_DELETION_FAILED,
} from "#src/constants";
import { selectCount, selectSmartlists } from "#src/selectors";
import { smartlistStore } from "#src/store";
import type { Smartlist, SmartlistSearchResult } from "#src/types";

import mockSmartlists from "./fixtures/smartlists.json";

beforeEach(() => {
  smartlistStore.setState({
    byId: {},
    ids: [],
    count: 0,
    page: 1,
    pageSize: 10,
  });
});

describe("fetchSmartlistsAction", () => {
  it("should fetch smartlists all and update the store", async () => {
    const realFetch = createTestFetch<Smartlist[]>();

    await fetchSmartlistsAction(realFetch, {
      page: 1,
      page_size: 10,
    });

    const storeState = smartlistStore.getState();
    const storeSmartlists = selectSmartlists(storeState);
    expect(storeSmartlists).toHaveLength(mockSmartlists.length);
    expect(storeSmartlists[0].id).toBe(mockSmartlists[0].id);
    expect(storeSmartlists[1].id).toBe(mockSmartlists[1].id);
  });

  it("should handle pagination when page is not 1 and data is already loaded", async () => {
    // Create a spy on the fetch function to track calls
    const fetchSpy = vi.fn();
    const realFetch = createTestFetch<Smartlist[]>();

    // Wrap the real fetch with our spy
    const spiedFetch = async (...args: Parameters<typeof realFetch>) => {
      fetchSpy();
      return realFetch(...args);
    };

    // First, load the initial data with page size 1 to ensure we have pagination
    await fetchSmartlistsAction(spiedFetch, {
      page: 1,
      page_size: 1,
    });

    // Verify initial state after first page load
    let storeState = smartlistStore.getState();
    let storeSmartlists = selectSmartlists(storeState);
    expect(storeSmartlists).toHaveLength(1);
    expect(storeSmartlists[0].id).toBe(mockSmartlists[0].id);
    expect(storeState.page).toBe(1);
    expect(storeState.pageSize).toBe(1);

    // Verify that fetch was called once for the initial load
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Reset the spy to clearly track calls for the second fetch
    fetchSpy.mockReset();

    // Now fetch the second page
    await fetchSmartlistsAction(spiedFetch, {
      page: 2,
      page_size: 1,
    });

    // Verify that fetch was NOT called for the second page request
    expect(fetchSpy).not.toHaveBeenCalled();

    // Verify that the pagination state was updated without making another API call
    storeState = smartlistStore.getState();
    storeSmartlists = selectSmartlists(storeState);
    expect(storeSmartlists).toHaveLength(1); // We should still have 1 item due to page size 1
    expect(storeState.page).toBe(2); // Page should be updated to 2
    expect(storeState.pageSize).toBe(1);
    // The visible smartlist should now be the second one from our mock data
    expect(storeSmartlists[0].id).toBe(mockSmartlists[1].id);
  });

  it("should search smartlists successfully", async () => {
    const realFetch = createTestFetch<SmartlistSearchResult>();

    // Use the first smartlist's name from the fixture for the search
    const searchTerm = mockSmartlists[0].name;

    await fetchSmartlistsAction(realFetch, {
      page: 1,
      page_size: 10,
      search: searchTerm,
    });

    const storeState = smartlistStore.getState();
    const smartlists = selectSmartlists(storeState);
    expect(smartlists).toHaveLength(1);
    expect(smartlists[0].name).toBe(searchTerm);
  });

  it("should maintain count when toggling between search and regular views", async () => {
    // Step 1: Load all smartlists first
    const allFetch = createTestFetch<Smartlist[]>();

    await fetchSmartlistsAction(allFetch, {
      page: 1,
      page_size: 10,
    });

    // Store the initial count for later comparison
    let storeState = smartlistStore.getState();
    const initialCount = selectCount(storeState);

    // Step 2: Apply search that returns fewer results
    const searchFetch = createTestFetch<SmartlistSearchResult>();
    const searchTerm = mockSmartlists[0].name; // This will match only one item

    await fetchSmartlistsAction(searchFetch, {
      page: 1,
      page_size: 10,
      search: searchTerm,
    });

    // Check count during search - should be the length of search results
    storeState = smartlistStore.getState();
    const searchCount = selectCount(storeState);
    expect(searchCount).toBe(1); // Only one item matches the search
    expect(storeState.fuzzySearchIds.length).toBe(1);

    // Step 3: Remove search by fetching all again
    await fetchSmartlistsAction(allFetch, {
      page: 1,
      page_size: 10,
    });

    // Check final count after removing search - should be back to original count
    storeState = smartlistStore.getState();
    const finalCount = selectCount(storeState);
    expect(finalCount).toBe(initialCount); // Should be back to the initial count
    expect(storeState.fuzzySearchIds.length).toBe(0);
  });
});

describe("createSmartlistAction", () => {
  it("should successfully create a smartlist", async () => {
    const newSmartlist = {
      name: "API Created Smartlist",
      description: "Created via API",
      company: 1,
    };

    const realFetch = createTestFetch<Smartlist>();

    const result = await createSmartlistAction(realFetch, newSmartlist);

    return result.fold(
      (createdSmartlist) => {
        expect(createdSmartlist).toEqual({
          id: 999,
          name: newSmartlist.name,
          description: newSmartlist.description,
          company: newSmartlist.company,
          member_base: 1,
          has_active_communication_group_configs: false,
        });
      },
      (error) => {
        expect.fail(`Expected success but got error: ${error.message}`);
      },
    );
  });

  it("should handle error when creating a smartlist with invalid name", async () => {
    const invalidSmartlist = {
      name: "Invalid Smartlist",
      description: "This should trigger a 400 error",
      company: 1,
    };

    const realFetch = createTestFetch<Smartlist>();

    const result = await createSmartlistAction(realFetch, invalidSmartlist);

    return result.fold(
      () => {
        // If we get here, means that it didn't throw an error
        expect.fail("Expected an error but got success");
      },
      (error) => {
        expect(error.message).toBe("Failed to create smartlist");
      },
    );
  });
});

describe("editSmartlistAction", () => {
  beforeEach(() => {
    // Initialize the store with mock data for testing edit functionality
    smartlistStore.setState({
      byId: {
        1: mockSmartlists[0],
        2: mockSmartlists[1],
      },
      ids: [1, 2],
      count: 2,
      page: 1,
      pageSize: 10,
    });
  });

  it("should successfully edit a smartlist", async () => {
    const updateData = {
      id: 1,
      name: "Updated Smartlist Name",
      description: "Updated description",
    };

    const realFetch = createTestFetch<Smartlist>();

    const result = await editSmartlistAction(realFetch, updateData);

    return result.fold(
      (updatedSmartlist) => {
        // Check that the function returned the updated smartlist
        expect(updatedSmartlist.id).toBe(updateData.id);
        expect(updatedSmartlist.name).toBe(updateData.name);
        expect(updatedSmartlist.description).toBe(updateData.description);
      },
      (error) => {
        expect.fail(`Expected success but got error: ${error.message}`);
      },
    );
  });

  it("should handle error when editing a smartlist with invalid name", async () => {
    const invalidUpdateData = {
      id: 1,
      name: "Invalid Smartlist",
      description: "This should trigger a 400 error",
    };

    const realFetch = createTestFetch<Smartlist>();

    const result = await editSmartlistAction(realFetch, invalidUpdateData);

    return result.fold(
      () => {
        // If we get here, means that it didn't throw an error
        expect.fail("Expected an error but got success");
      },
      (error) => {
        expect(error.message).toBe("Failed to edit smartlist");
      },
    );
  });

  it("should handle error when editing a non-existent smartlist", async () => {
    const nonExistentId = 999;
    const updateData = {
      id: nonExistentId,
      name: "Updated Smartlist Name",
      description: "Updated description",
    };

    const realFetch = createTestFetch<Smartlist>();

    const result = await editSmartlistAction(realFetch, updateData);

    return result.fold(
      () => {
        // If we get here, means that it didn't throw an error
        expect.fail("Expected an error but got success");
      },
      (error) => {
        expect(error.message).toBe("Failed to edit smartlist");
      },
    );
  });
});

describe("deleteSmartlistAction", () => {
  beforeEach(() => {
    // Initialize the store with mock data for testing delete functionality
    smartlistStore.setState({
      byId: {
        1: mockSmartlists[0],
        2: mockSmartlists[1],
      },
      ids: [1, 2],
      count: 2,
      page: 1,
      pageSize: 10,
      fuzzySearchIds: [],
    });
  });

  it("should successfully delete a smartlist", async () => {
    const params = {
      id: 1,
    };
    const realFetch = createTestFetch<boolean>();

    const result = await deleteSmartlistAction(realFetch, params);

    return result.fold(
      (success) => {
        expect(success).toBe(true);
      },
      (error) => {
        expect.fail(`Expected success but got error: ${error.message}`);
      },
    );
  });

  it("should handle error when deleting a smartlist fails", async () => {
    const params = {
      id: 123,
    };
    const realFetch = createTestFetch<boolean>();

    const result = await deleteSmartlistAction(realFetch, params);

    return result.fold(
      () => {
        expect.fail("Expected an error but got success");
      },
      (error) => {
        expect(error.message).toContain(
          "Error calling backend (path: api/v1/smartlist/group/123/) because: [UNKNOWN]",
        );
        expect(error.message).toContain("Smartlist not found");
      },
    );
  });

  it("should handle general deletion failure error code (101000)", async () => {
    const params = {
      id: 101,
    };
    const realFetch = createTestFetch<boolean>();

    const result = await deleteSmartlistAction(realFetch, params);

    return result.fold(
      () => {
        expect.fail("Expected an error but got success");
      },
      (error) => {
        expect(error.customErrorCodes).toContain(SMARTLIST_DELETION_FAILED);
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain("General deletion failed");
      },
    );
  });

  it("should handle deletion blocked by communication groups error code (101001)", async () => {
    const params = {
      id: 102,
    };
    const realFetch = createTestFetch<boolean>();

    const result = await deleteSmartlistAction(realFetch, params);

    return result.fold(
      () => {
        expect.fail("Expected an error but got success");
      },
      (error) => {
        expect(error.customErrorCodes).toContain(
          SMARTLIST_DELETION_BLOCKED_BY_COMMUNICATION_GROUPS,
        );
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain(
          "Deletion blocked by communication groups",
        );
      },
    );
  });

  it("should handle deletion blocked by cadences error code (101002)", async () => {
    const params = {
      id: 103,
    };
    const realFetch = createTestFetch<boolean>();

    const result = await deleteSmartlistAction(realFetch, params);

    return result.fold(
      () => {
        expect.fail("Expected an error but got success");
      },
      (error) => {
        expect(error.customErrorCodes).toContain(
          SMARTLIST_DELETION_BLOCKED_BY_CADENCES,
        );
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain("Deletion blocked by cadences");
      },
    );
  });
});

describe("duplicateSmartlistAction", () => {
  beforeEach(() => {
    // Initialize the store with mock data for testing duplicate functionality
    smartlistStore.setState({
      byId: {
        1: mockSmartlists[0],
        2: mockSmartlists[1],
      },
      ids: [1, 2],
      count: 2,
      page: 1,
      pageSize: 10,
      fuzzySearchIds: [],
    });
  });

  it("should successfully duplicate a smartlist", async () => {
    const params = {
      id: 1,
    };
    const realFetch = createTestFetch<Smartlist>();

    const result = await duplicateSmartlistAction(realFetch, params);

    return result.fold(
      (duplicatedSmartlist) => {
        expect(duplicatedSmartlist.id).toBe(1000);
        expect(duplicatedSmartlist.name).toBe(
          `Copy of ${mockSmartlists[0].name}`,
        );
        expect(duplicatedSmartlist.description).toBe(
          mockSmartlists[0].description,
        );
        expect(duplicatedSmartlist.company).toBe(mockSmartlists[0].company);
      },
      (error) => {
        expect.fail(`Expected success but got error: ${error.message}`);
      },
    );
  });

  it("should handle error when duplicating a smartlist fails", async () => {
    const params = {
      id: 123,
    };
    const realFetch = createTestFetch<Smartlist>();

    const result = await duplicateSmartlistAction(realFetch, params);

    return result.fold(
      () => {
        expect.fail("Expected an error but got success");
      },
      (error) => {
        expect(error.message).toBe("Failed to duplicate smartlist");
      },
    );
  });
});
