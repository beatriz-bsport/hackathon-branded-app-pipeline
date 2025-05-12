import { beforeEach, describe, expect, it } from "vitest";

import { setSmartlists } from "#src/actions/store";
import { selectCount, selectSmartlist, selectSmartlists } from "#src/selectors";
import { smartlistStore } from "#src/store";

import mockSmartlists from "./fixtures/smartlists.json";

describe("smartlist selectors", () => {
  // Populate the store with data from the fixture before each test
  beforeEach(() => {
    // Use the setSmartlists action to populate the store
    setSmartlists({
      smartlists: mockSmartlists,
      count: mockSmartlists.length,
      page: 1,
      pageSize: 10,
    });
  });

  describe("selectSmartlists", () => {
    it("should return the correct slice of smartlists based on page and pageSize", () => {
      // Test first page with pageSize of 1
      smartlistStore.setState((state) => ({
        ...state,
        page: 1,
        pageSize: 1,
      }));
      const storeState = smartlistStore.getState();

      const firstPageSmartlists = selectSmartlists(storeState);
      expect(firstPageSmartlists).toHaveLength(1);
      expect(firstPageSmartlists[0].id).toBe(mockSmartlists[0].id);

      // Test second page with pageSize of 1
      smartlistStore.setState((state) => ({
        ...state,
        page: 2,
        pageSize: 1,
      }));
      const updatedState = smartlistStore.getState();

      const secondPageSmartlists = selectSmartlists(updatedState);
      expect(secondPageSmartlists).toHaveLength(1);
      expect(secondPageSmartlists[0].id).toBe(mockSmartlists[1].id);
    });

    it("should handle partial pages correctly", () => {
      // Set page size larger than available items
      smartlistStore.setState((state) => ({
        ...state,
        page: 1,
        pageSize: mockSmartlists.length + 5,
      }));
      const storeState = smartlistStore.getState();

      const allSmartlists = selectSmartlists(storeState);
      expect(allSmartlists).toHaveLength(mockSmartlists.length);

      // Test last page with fewer items than pageSize
      const totalPages = Math.ceil(mockSmartlists.length / 2);
      smartlistStore.setState((state) => ({
        ...state,
        page: totalPages,
        pageSize: 2,
      }));
      const updatedState = smartlistStore.getState();

      const lastPageSmartlists = selectSmartlists(updatedState);
      expect(lastPageSmartlists.length).toBeLessThanOrEqual(2);
      expect(lastPageSmartlists.length).toBeGreaterThan(0);
    });
  });

  describe("selectSmartlist", () => {
    it("should return the correct smartlist by id", () => {
      const targetId = mockSmartlists[0].id;
      const storeState = smartlistStore.getState();

      const selectedSmartlist = selectSmartlist(storeState, targetId);
      expect(selectedSmartlist).toBeDefined();
      expect(selectedSmartlist.id).toBe(targetId);
      expect(selectedSmartlist.name).toBe(mockSmartlists[0].name);
    });

    it("should return undefined for non-existent id", () => {
      const nonExistentId = 999999;
      const storeState = smartlistStore.getState();

      const selectedSmartlist = selectSmartlist(storeState, nonExistentId);
      expect(selectedSmartlist).toBeUndefined();
    });
  });

  describe("selectCount", () => {
    it("should return the total count of smartlists", () => {
      const storeState = smartlistStore.getState();
      const count = selectCount(storeState);

      expect(count).toBe(mockSmartlists.length);
    });

    it("should return 0 when there are no smartlists", () => {
      smartlistStore.setState((state) => ({
        ...state,
        count: 0,
      }));
      const storeState = smartlistStore.getState();

      const count = selectCount(storeState);
      expect(count).toBe(0);
    });
  });
});
