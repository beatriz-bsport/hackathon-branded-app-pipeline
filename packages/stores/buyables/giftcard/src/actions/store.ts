import type {
  ConsumerGiftcard,
  Giftcard,
  GiftcardImage,
} from "@bsport/api-buyables";

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
    const byId = Object.fromEntries(
      giftcards.map((object) => [object.id, object]),
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
    const byId = Object.fromEntries(
      giftcardImages.map((object) => [object.id, object]),
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

export const updateConsumerGiftcard = (
  updatedConsumerGiftcard: ConsumerGiftcard,
) => {
  giftcardStore.setState((state) => {
    if (!updatedConsumerGiftcard) return state;

    const id = updatedConsumerGiftcard.id;

    if (!id) return state;

    return {
      consumerGiftcards: {
        ...state.consumerGiftcards,
        byId: {
          ...state.consumerGiftcards.byId,
          [id]: updatedConsumerGiftcard,
        },
      },
    };
  });
};

export const setConsumerGiftcards = ({
  objects,
  count,
  page,
}: {
  objects: ConsumerGiftcard[];
  count: number;
  page: number;
}) => {
  giftcardStore.setState((state) => {
    const byId = Object.fromEntries(
      objects.map((object) => [object.id, object]),
    );

    return {
      consumerGiftcards: {
        ...state.consumerGiftcards,
        ids: objects.map((object) => object.id),
        byId,
        count,
        page,
      },
    };
  });
};
