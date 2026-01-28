import { setPopups } from "#src/actions/store";
import { selectPopup, selectPopups } from "#src/selectors";
import { popupStore } from "#src/store";

import mockPopups from "./fixtures/popups.json";

describe("popup selectors", () => {
  // Populate the store with data from the fixture before each test
  beforeEach(() => {
    // Use the setPopups action to populate the store
    setPopups({
      popups: mockPopups,
    });
  });

  describe("selectPopups", () => {
    it("should return all popups from the store", () => {
      const storeState = popupStore.getState();
      const popups = selectPopups(storeState);
      expect(popups).toHaveLength(mockPopups.length);
      expect(popups[0].custom_popup_id).toBe(mockPopups[0].custom_popup_id);
      expect(popups[1].custom_popup_id).toBe(mockPopups[1].custom_popup_id);
    });
  });

  describe("selectSmartlist", () => {
    it("should return the correct popup by ID", () => {
      const targetId = mockPopups[0].custom_popup_id;
      const storeState = popupStore.getState();

      const popups = selectPopup(storeState, targetId);
      expect(popups).toBeDefined();
      expect(popups?.custom_popup_id).toBe(targetId);
      expect(popups?.name).toBe(mockPopups[0].name);
    });
  });
});
