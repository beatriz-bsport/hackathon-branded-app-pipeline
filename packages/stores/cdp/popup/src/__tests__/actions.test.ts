import { describe, expect, it } from "vitest";

import { BackgroundTask } from "@bsport/store-shared-background-task";

import { createSmartlistPopupAction, fetchPopupsAction } from "#src/actions";
import { selectPopups } from "#src/selectors";
import { popupStore } from "#src/store";
import { CreateSmartlistPopupParams, Popup } from "#src/types";

import mockPopups from "./fixtures/popups.json";
import { createTestFetch, createTestXhr } from "./utils/fetch";

describe("fetchPopupsAction", () => {
  it("should fetch and set popups in the store", async () => {
    const realFetch = createTestFetch<Popup[]>();

    await fetchPopupsAction(realFetch, null);

    const storeState = popupStore.getState();
    const storePopups = selectPopups(storeState);

    expect(storePopups).toHaveLength(mockPopups.length);
    expect(storePopups[0].custom_popup_id).toBe(mockPopups[0].custom_popup_id);
    expect(storePopups[1].custom_popup_id).toBe(mockPopups[1].custom_popup_id);
  });
});

describe("createSmartlistPopupAction", () => {
  it("should create a smartlist popup", async () => {
    const newPopup: CreateSmartlistPopupParams = {
      name: mockPopups[0].name,
      link: mockPopups[0].link,
      image: new File(["cool gym pic"], "popup.png", { type: "image/png" }),
      smartlist_id: mockPopups[0].smartlist_id,
    };

    const realXhr = createTestXhr<string | null>();
    const realFetchBgTask = createTestFetch<BackgroundTask<Popup>>();
    const realFetchList = createTestFetch<Popup[]>();

    const result = await createSmartlistPopupAction(
      newPopup,
      realXhr,
      realFetchBgTask,
      realFetchList,
    );

    return result.fold(
      (createdPopup) => {
        expect(createdPopup).toStrictEqual(mockPopups[0]);

        // the store was repopulated by fetchPopupsAction
        const storeState = popupStore.getState();
        const storePopups = selectPopups(storeState);
        expect(storePopups).toHaveLength(mockPopups.length);
      },
      (error) => {
        // If we get here, means that it didn't throw an error
        expect.fail(`Expected success but got error: ${error.message}`);
      },
    );
  });

  it("should handle error when creating a smartlist popup with invalid data", async () => {
    const invalidPopup = {
      name: "Invalid Popup",
      link: "https://example.com/invalid-link",
      image: new File(["invalid image"], "invalid.png", { type: "image/png" }),
      smartlist_id: 456,
    };

    const realXhr = createTestXhr<string | null>();
    const realFetchBgTask = createTestFetch<BackgroundTask<Popup>>();
    const realFetchList = createTestFetch<Popup[]>();

    const result = await createSmartlistPopupAction(
      invalidPopup,
      realXhr,
      realFetchBgTask,
      realFetchList,
    );

    return result.fold(
      (response) => {
        // If we get here, means that it didn't throw an error
        expect.fail(`Expected error but got success: ${response}`);
      },
      (error) => {
        expect(error.context).toBe("Failed to create popup");
      },
    );
  });

  it("should handle error when no backgroundTaskUuid is returned", async () => {
    const popupData: CreateSmartlistPopupParams = {
      name: "Test Popup",
      link: "https://example.com/popup",
      image: new File(["test image"], "test.png", { type: "image/png" }),
      smartlist_id: 789,
    };

    const realXhr = async (): Promise<{
      data: string | null;
      status: number;
      backgroundTaskUuid: string | null;
    }> => {
      return { data: null, status: 200, backgroundTaskUuid: null };
    };

    const realFetchBgTask = createTestFetch<BackgroundTask<Popup>>();
    const realFetchList = createTestFetch<Popup[]>();

    const result = await createSmartlistPopupAction(
      popupData,
      realXhr,
      realFetchBgTask,
      realFetchList,
    );

    return result.fold(
      (response) => {
        // If we get here, means that it didn't throw an error
        expect.fail(`Expected error but got success: ${response}`);
      },
      (error) => {
        expect(error.context).toBe("Failed to create popup");
      },
    );
  });

  it("should handle error when fetching the creation result fails", async () => {
    const popupData: CreateSmartlistPopupParams = {
      name: "Test Popup",
      link: "https://example.com/popup",
      image: new File(["test image"], "test.png", { type: "image/png" }),
      smartlist_id: 789,
    };

    const realXhr = createTestXhr<string | null>();

    const realFetchBgTask = async (): Promise<{
      data: BackgroundTask<Popup>;
      status: number;
      backgroundTaskUuid: string | null;
    }> => {
      return {
        data: {
          uuid: "task-uuid",
          status: 2,
          error_detail: "Something dumb happened",
          task_name: "create_smartlist_popup",
          return_value: null as unknown as Popup,
        },
        status: 200,
        backgroundTaskUuid: null,
      };
    };

    const realFetchList = createTestFetch<Popup[]>();

    const result = await createSmartlistPopupAction(
      popupData,
      realXhr,
      realFetchBgTask,
      realFetchList,
    );

    return result.fold(
      (response) => {
        // If we get here, means that it didn't throw an error
        expect.fail(`Expected error but got success: ${response}`);
      },
      (error) => {
        expect(error.context).toBe("Failed to get created popup");
      },
    );
  });
});
