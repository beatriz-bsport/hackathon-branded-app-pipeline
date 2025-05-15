import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchSmartlistsAction } from "#src/actions";
import { selectSmartlists } from "#src/selectors";
import { smartlistStore } from "#src/store";
import type { Smartlist, SmartlistSearchResult } from "#src/types";

import mockSmartlists from "./fixtures/smartlists.json";
import { createTestFetch } from "./utils/fetch";

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
});
