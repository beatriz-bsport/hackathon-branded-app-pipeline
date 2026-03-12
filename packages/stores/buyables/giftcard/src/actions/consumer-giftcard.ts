import { Result } from "typescript-result";

import {
  type ConsumerGiftcard,
  type FetchConsumerGiftcardsParams,
  type SendInvitationEmailParams,
  fetchConsumerGiftcardAPI,
  fetchConsumerGiftcardsAPI,
  sendEmailInvitationAPI,
} from "@bsport/api-buyables";
import type { Action, PaginatedResponse } from "@bsport/store-base";
import { createErrorWithContext } from "@bsport/store-base";

import { setConsumerGiftcards, updateConsumerGiftcard } from "./store";

export const fetchConsumerGiftcardsAction: Action<
  FetchConsumerGiftcardsParams,
  PaginatedResponse<ConsumerGiftcard>
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await fetchConsumerGiftcardsAPI(fetch, params);

      setConsumerGiftcards({
        objects: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch Consumer Giftcards",
        params,
      }),
  );
};

export const fetchConsumerGiftcardAction: Action<
  { id: number },
  ConsumerGiftcard
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await fetchConsumerGiftcardAPI(fetch, params);

      updateConsumerGiftcard(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch Consumer Giftcard",
        params,
      }),
  );
};

export const sendEmailInvitationAction: Action<
  SendInvitationEmailParams,
  void
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await sendEmailInvitationAPI(fetch, params);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to send email invitation",
        params,
      }),
  );
};
