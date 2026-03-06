import type { GiftcardState } from "./store";

// ----- Selectors for giftcards -----

export const selectGiftcards = (state: GiftcardState) => {
  const { ids, byId } = state.giftcards;
  return ids.map((id) => byId[id]);
};

export const selectGiftcard = (state: GiftcardState, id?: number) =>
  id ? state.giftcards.byId[id] : null;

export const selectGiftcardsCount = (state: GiftcardState) =>
  state.giftcards.count;

// ----- Selectors for giftcardImages -----

export const selectGiftcardImages = (state: GiftcardState) => {
  const { ids, byId } = state.giftcardImages;
  return ids.map((id) => byId[id]);
};

export const selectGiftcardImage = (state: GiftcardState, id: number) =>
  state.giftcardImages.byId[id];

export const selectGiftcardImagesCount = (state: GiftcardState) =>
  state.giftcardImages.count;

// ----- Selectors for consumerGiftcards -----

export const selectConsumerGiftcards = (state: GiftcardState) => {
  const { ids, byId } = state.consumerGiftcards;
  return ids.map((id) => byId[id]);
};

export const selectConsumerGiftcardsCount = (state: GiftcardState) =>
  state.consumerGiftcards.count;
