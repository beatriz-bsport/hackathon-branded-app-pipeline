import type { Giftcard, GiftcardImage } from "@bsport/api-buyables";

import { giftcardStore } from "#src/store";

export const updateGiftcard = (updatedGiftcard: Giftcard) => {
  giftcardStore.setState((state) => {
    if (!updatedGiftcard) return state;

    const id = updatedGiftcard.id;

    if (!id) return state;

    return {
      giftcards: {
        ...state.giftcards,
        byId: { ...state.giftcards.byId, [id]: updatedGiftcard },
      },
    };
  });
};

export const setGiftcards = ({
  giftcards,
  count,
  page,
}: {
  giftcards: Giftcard[];
  count: number;
  page: number;
}) => {
  giftcardStore.setState((state) => {
    const byId = giftcards.reduce(
      (acc, giftcard) => {
        acc[giftcard.id] = giftcard;
        return acc;
      },
      {} as { [key: number]: Giftcard },
    );

    return {
      giftcards: {
        ...state.giftcards, // In case other properties have been added to giftcards state
        ids: giftcards.map((giftcard) => giftcard.id),
        byId,
        count,
        page,
      },
    };
  });
};

export const updateGiftcardImage = (updatedGiftcardImage: GiftcardImage) => {
  giftcardStore.setState((state) => {
    if (!updatedGiftcardImage) return state;

    const id = updatedGiftcardImage.id;

    if (!id) return state;

    return {
      giftcardImages: {
        ...state.giftcardImages,
        byId: { ...state.giftcardImages.byId, [id]: updatedGiftcardImage },
      },
    };
  });
};

export const setGiftcardImages = ({
  giftcardImages,
  count,
  page,
}: {
  giftcardImages: GiftcardImage[];
  count: number;
  page: number;
}) => {
  giftcardStore.setState((state) => {
    const byId = giftcardImages.reduce(
      (acc, giftcardImage) => {
        acc[giftcardImage.id] = giftcardImage;
        return acc;
      },
      {} as { [key: number]: GiftcardImage },
    );

    return {
      giftcardImages: {
        ...state.giftcardImages, // In case other properties have been added to giftcardImages state
        ids: giftcardImages.map((giftcardImage) => giftcardImage.id),
        byId,
        count,
        page,
      },
    };
  });
};
