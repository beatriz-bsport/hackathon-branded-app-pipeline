import { HttpResponse, http } from "msw";

import { BACKGROUND_TASK_UUID_HEADER } from "@bsport/fetch";

import { API_URL, SMARTLIST_POPUP_API_URL } from "#src/api";

import mockPopups from "../fixtures/popups.json";

const bgTaskUuid = "f81d4fae-7dec-11d0-a765-00a0c91e6bf6";

export const handlers = [
  // Handler for fetching all popups
  http.get(`http://localhost/${API_URL}`, () => {
    return HttpResponse.json(mockPopups);
  }),

  // handler for creating smartlist popups
  http.post(
    `http://localhost/${SMARTLIST_POPUP_API_URL}`,
    async ({ request }) => {
      const formData = await request.formData();

      if (formData.get("name") === "Invalid Popup") {
        return HttpResponse.json({ error: "Invalid data" }, { status: 400 });
      }

      return new HttpResponse(null, {
        status: 200,
        headers: {
          [BACKGROUND_TASK_UUID_HEADER]: bgTaskUuid,
        },
      });
    },
  ),

  // Handler for fetching background task result
  http.get(
    `http://localhost/platform/v1/background_task/${bgTaskUuid}/`,
    () => {
      return HttpResponse.json({
        uuid: bgTaskUuid,
        status: 1,
        return_value: mockPopups[0],
      });
    },
  ),
];
