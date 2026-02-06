import { PopupState, popupStore } from "#src/store";
import type { Popup } from "#src/types";

export const updatePopup = (updatedPopup: Popup) => {
  popupStore.setState((state: PopupState) => {
    if (!updatedPopup) return state;

    const id = updatedPopup.custom_popup_id;

    if (!id) return state;

    if (!state.byId[id]) {
      return {
        byId: { ...state.byId, [id]: updatedPopup },
        ids: [...state.ids, id],
        count: state.count + 1,
      };
    }

    return {
      byId: { ...state.byId, [id]: updatedPopup },
    };
  });
};

export const addPopup = (newPopup: Popup) => {
  popupStore.setState((state: PopupState) => {
    if (!newPopup) return state;

    const id = newPopup.custom_popup_id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: newPopup },
      ids: [...state.ids, id],
      count: state.count + 1,
    };
  });
};

export const setPopups = ({ popups }: { popups: Popup[] }) => {
  popupStore.setState(() => {
    const byId = popups.reduce(
      (acc, popup) => {
        acc[popup.custom_popup_id] = popup;
        return acc;
      },
      {} as { [key: number]: Popup },
    );

    return {
      ids: popups.map((popup) => popup.custom_popup_id),
      byId,
      count: popups.length,
    };
  });
};
