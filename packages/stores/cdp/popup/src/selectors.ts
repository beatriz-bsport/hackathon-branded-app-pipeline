import type { PopupState } from "./store";

export const selectPopups = (state: PopupState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectPopup = (state: PopupState, id: number) => state.byId[id];

export const selectCount = (state: PopupState) => state.count;
