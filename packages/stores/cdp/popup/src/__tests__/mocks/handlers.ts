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

  // Handler for fetching a single popup by ID
  http.get(`http://localhost/${API_URL}:id/`, ({ params }) => {
    const id = Number(params.id);
    const popup = mockPopups.find((p) => p.custom_popup_id === id);

    if (!popup) {
      return HttpResponse.json({ error: "Popup not found" }, { status: 404 });
    }

    const result = {
      custom_popup_id: popup.custom_popup_id,
      name: popup.name,
      link: popup.link,
      image: popup.image,
      date_created: popup.date_created,
    };

    return HttpResponse.json(result);
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

  // handler for editing popups
  http.patch(`http://localhost/${API_URL}:id/`, async ({ request, params }) => {
    const id = Number(params.id);
    const formData = await request.formData();
    const popupIndex = mockPopups.findIndex((p) => p.custom_popup_id === id);

    if (popupIndex === -1) {
      return HttpResponse.json({ error: "Popup not found" }, { status: 404 });
    }

    const updatedPopup = {
      ...mockPopups[popupIndex],
      name: formData.get("name")
        ? (formData.get("name") as string)
        : mockPopups[popupIndex].name,
      link: formData.get("link")
        ? (formData.get("link") as string)
        : mockPopups[popupIndex].link,
      image: formData.get("image")
        ? `http://localhost:8000/images/${(formData.get("image") as File).name}`
        : mockPopups[popupIndex].image,
    };

    mockPopups[popupIndex] = updatedPopup;

    return HttpResponse.json(updatedPopup);
  }),
];
