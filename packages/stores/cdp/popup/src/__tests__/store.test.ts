import { addPopup, setPopups, updatePopup } from "#src/actions/store";
import { popupStore } from "#src/store";
import { Popup } from "#src/types";

import mockPopups from "./fixtures/popups.json";

describe("store", () => {
  // Populate the store with data from the fixture before each test
  beforeEach(() => {
    // Use the setPopups action to populate the store
    setPopups({
      popups: mockPopups,
    });
  });

  it("should set popups in the store", () => {
    const newPopups: Popup[] = [
      {
        custom_popup_id: 3,
        date_created: "2023-01-01T00:00:00Z",
        name: "New Popup",
        link: "http://new-link-1.com",
        image: "http://localhost:8000/images/new-popup-1.jpg",
        smartlist_id: 103,
      },
    ];

    setPopups({ popups: newPopups });

    const updatedStore = popupStore.getState();

    const expectedStore = {
      byId: {
        "3": newPopups[0],
      },
      count: 1,
      ids: [3],
    };
    expect(updatedStore).toEqual(expectedStore);
  });

  it("should add a popup to the store", () => {
    const popup: Popup = {
      custom_popup_id: 3,
      date_created: "2023-01-01T00:00:00Z",
      name: "New Popup",
      link: "http://new-link.com",
      image: "http://localhost:8000/images/new-popup.jpg",
      smartlist_id: 102,
    };

    addPopup(popup);

    const updatedStore = popupStore.getState();

    expect(Object.keys(updatedStore.byId)).toEqual(["1", "2", "3"]);
    expect(updatedStore.count).toBe(3);
    expect(updatedStore.ids).toEqual([1, 2, 3]);
  });

  it("should update a popup in the store", () => {
    const updatedPopup: Popup = {
      custom_popup_id: mockPopups[0].custom_popup_id,
      date_created: mockPopups[0].date_created,
      name: "Updated Popup Name",
      link: mockPopups[0].link,
      image: mockPopups[0].image,
      smartlist_id: mockPopups[0].smartlist_id,
    };

    updatePopup(updatedPopup);

    const updatedStore = popupStore.getState();

    expect(Object.keys(updatedStore.byId)).toEqual(["1", "2"]);
    expect(updatedStore.count).toBe(2);
    expect(updatedStore.ids).toEqual([1, 2]);
  });

  it("should add a popup if updating a popup that does not exist in the store", () => {
    const newPopup: Popup = {
      custom_popup_id: 3,
      date_created: "2023-01-01T00:00:00Z",
      name: "Newly Added Popup",
      link: "http://newly-added-link.com",
      image: "http://localhost:8000/images/newly-added-popup.jpg",
      smartlist_id: 104,
    };

    updatePopup(newPopup);

    const updatedStore = popupStore.getState();

    expect(Object.keys(updatedStore.byId)).toEqual(["1", "2", "3"]);
    expect(updatedStore.count).toBe(3);
    expect(updatedStore.ids).toEqual([1, 2, 3]);
  });
});
