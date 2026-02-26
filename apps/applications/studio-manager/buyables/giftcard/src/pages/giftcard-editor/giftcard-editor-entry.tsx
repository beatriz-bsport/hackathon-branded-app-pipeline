import { FC } from "react";

import {
  selectGiftcard,
  useGiftcardStore,
} from "@bsport/store-buyables-giftcard";

import { GiftcardDetailsLoading } from "#src/components/giftcard-details-loading";
import { GiftcardFetchError } from "#src/components/giftcard-fetch-error";
import { useRetrieveId } from "#src/hooks/layout/use-retrieve-id";
import { useFetchGiftcard } from "#src/hooks/use-fetch-giftcard";

import { GiftcardEditorPage } from "./giftcard-editor-page";

export const GiftcardEditorEntry: FC = () => {
  const validId = useRetrieveId();

  const { isLoading, error } = useFetchGiftcard({
    id: validId,
  });

  const giftcard = useGiftcardStore((state) => selectGiftcard(state, validId));

  if (error || !validId) {
    return <GiftcardFetchError />;
  }

  if (isLoading && !giftcard) {
    return <GiftcardDetailsLoading />;
  }

  return <GiftcardEditorPage giftcard={giftcard} />;
};
