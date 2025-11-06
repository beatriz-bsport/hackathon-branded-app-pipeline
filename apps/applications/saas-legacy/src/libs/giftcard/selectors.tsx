import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { safeParseFloat } from '#src/utils/numbers';
import { RootState } from '../../reducers';
import type {
  Giftcard,
  ConsumerGiftcard,
  GiftcardBackgroundImage,
  GiftcardTemplate,
} from './types';
import { getMemberListData } from '../member/selectors';

export const getGiftcardData = (state: RootState) =>
  state.giftcard.giftcard.byId;

export const getGiftcard = (state: RootState, id: number) =>
  state.giftcard.giftcard.byId[id];

export const getGiftcardListIds = (state: RootState) =>
  state.giftcard.giftcard.allIds;

export const getGiftcardBackgroundImageData = (state: RootState) =>
  state.giftcard.giftcardBackgroundImage.byId;

export const getGiftcardBackgroundImageListIds = (state: RootState) =>
  state.giftcard.giftcardBackgroundImage.allIds;

export const getConsumerGiftcard = (state: RootState, id: number) =>
  state.giftcard.consumerGiftcard.byId[id];

export const getAttributeByPrintableCodeLoading = (state: RootState) =>
  state.giftcard.consumerGiftcard.attributeByPrintableCode.loading;

export const getConsumerGiftcardByActivationCode = (
  state: RootState,
  activationCode: string,
) =>
  Object.values(state.giftcard.consumerGiftcard.byId).find(
    (cg) => cg.activation_code === activationCode,
  );

export const getAllGiftcardList = createSelector(
  [getGiftcardListIds, getGiftcardData],
  (
    ids: Array<number>,
    data: { [id: number]: Giftcard },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]),
);

export const getGiftcardListActive = createSelector(
  [getGiftcardListIds, getGiftcardData],
  (
    ids: Array<number>,
    data: { [id: number]: Giftcard },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]).filter((g) => !g.disabled && !g.manager_only),
);

export const getGiftcardListUnavailableForSale = createSelector(
  [getGiftcardListIds, getGiftcardData],
  (
    ids: Array<number>,
    data: { [id: number]: Giftcard },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]).filter((g) => !g.disabled && g.manager_only),
);

export const getGiftcardListEnabled = createSelector(
  [getGiftcardListIds, getGiftcardData],
  (
    ids: Array<number>,
    data: { [id: number]: Giftcard },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]).filter((g) => !g.disabled),
);

export const getGiftcardListInactive = createSelector(
  [getGiftcardListIds, getGiftcardData],
  (
    ids: Array<number>,
    data: { [id: number]: Giftcard },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]).filter((g) => !!g.disabled),
);

export const getGiftcardBackgroundImageList = createSelector(
  [getGiftcardBackgroundImageListIds, getGiftcardBackgroundImageData],
  (
    ids: Array<number>,
    data: { [id: number]: GiftcardBackgroundImage },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]),
);

export const getConsumerGiftcardData = (state: RootState) =>
  state.giftcard.consumerGiftcard.byId;

export const getConsumerGiftcardListIds = (state: RootState) =>
  state.giftcard.consumerGiftcard.allIds;

export const getConsumerGiftcardList = createSelector(
  [getConsumerGiftcardListIds, getConsumerGiftcardData],
  (
    ids: Array<number>,
    data: { [id: number]: ConsumerGiftcard },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]),
);

export const getConsumerGiftcardListReceivedIds = (state: RootState) =>
  state.giftcard.consumerGiftcard.asReceiver.allIds;

export const getConsumerGiftcardListSentIds = (state: RootState) =>
  state.giftcard.consumerGiftcard.asSender.allIds;

export const getConsumerGiftcardReceivedList = createSelector(
  [getConsumerGiftcardListReceivedIds, getConsumerGiftcardData],
  (
    ids: Array<number>,
    data: { [id: number]: ConsumerGiftcard },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]),
);

export const getConsumerGiftcardSentList = createSelector(
  [getConsumerGiftcardListSentIds, getConsumerGiftcardData],
  (
    ids: Array<number>,
    data: { [id: number]: ConsumerGiftcard },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]),
);

export const withGiftcard = memoize((selector: any) =>
  createSelector(
    [selector, getGiftcardData],
    (consumerGiftcardList, giftcardData) => {
      if (!consumerGiftcardList) return consumerGiftcardList;
      if (Array.isArray(consumerGiftcardList)) {
        return consumerGiftcardList.map((cg) => ({
          ...cg,
          giftcard: giftcardData[cg.giftcard],
        }));
      }
      return {
        ...consumerGiftcardList,
        giftcard: giftcardData[consumerGiftcardList.giftcard],
      };
    },
  ),
);

export const withSender = memoize((selector: any) =>
  createSelector(
    [selector, getMemberListData],
    (consumerGiftcardList, memberData) => {
      if (!consumerGiftcardList) return consumerGiftcardList;
      if (Array.isArray(consumerGiftcardList)) {
        return consumerGiftcardList.map((cg) => ({
          ...cg,
          src_member: memberData[cg.src_member],
        }));
      }
      return {
        ...consumerGiftcardList,
        src_member: memberData[consumerGiftcardList.src_member],
      };
    },
  ),
);

export const withReceiver = memoize((selector: any) =>
  createSelector(
    [selector, getMemberListData],
    (consumerGiftcardList, memberData) => {
      if (!consumerGiftcardList) return consumerGiftcardList;
      if (Array.isArray(consumerGiftcardList)) {
        return consumerGiftcardList.map((cg) => ({
          ...cg,
          dst_member: memberData[cg.dst_member],
        }));
      }
      return {
        ...consumerGiftcardList,
        dst_member: memberData[consumerGiftcardList.dst_member],
      };
    },
  ),
);

export const onlyUsable = memoize(
  (
    selector: (
      state: RootState,
    ) => Array<ConsumerGiftcard<Giftcard>> | ConsumerGiftcard<Giftcard>,
  ) =>
    createSelector([selector], (consumer_giftcard) => {
      if (!consumer_giftcard) return null;
      if (!Array.isArray(consumer_giftcard)) {
        if (
          safeParseFloat(consumer_giftcard?.price_bought) >
          safeParseFloat(consumer_giftcard?.consumed_amount_gifted)
        ) {
          return consumer_giftcard;
        }
        return null;
      }
      return consumer_giftcard.filter(
        (consumerGiftcard: ConsumerGiftcard<Giftcard>) => {
          return (
            safeParseFloat(consumerGiftcard?.price_bought) >
            safeParseFloat(consumerGiftcard?.consumed_amount_gifted)
          );
        },
      );
    }),
);

// ========= SHARED GIFTCARDS =========

export const getGiftcardTemplateData = (state: RootState) =>
  state.giftcard.giftcardTemplate.byId;

export const getGiftcardTemplateListIds = (state: RootState) =>
  state.giftcard.giftcardTemplate.allIds;

export const getGiftcardTemplateListLoading = (state: RootState) =>
  state.giftcard.giftcardTemplate.list.loading;

export const getGiftcardTemplateFullList = createSelector(
  [getGiftcardTemplateData, getGiftcardTemplateListIds],
  (data: { [id: number]: GiftcardTemplate }, ids: Array<number>) =>
    ids.map((id) => data[id]),
);

export const getGiftcardTemplateActiveList = createSelector(
  [getGiftcardTemplateData, getGiftcardTemplateListIds],
  (data: { [id: number]: GiftcardTemplate }, ids: Array<number>) =>
    ids.map((id) => data[id]).filter((gt) => !gt.manager_only),
);

export const getGiftcardTemplateInactiveList = createSelector(
  [getGiftcardTemplateData, getGiftcardTemplateListIds],
  (data: { [id: number]: GiftcardTemplate }, ids: Array<number>) =>
    ids.map((id) => data[id]).filter((gt) => gt.manager_only),
);

export const getGiftcardTemplateDetail = (state: RootState, id: number) =>
  state.giftcard.giftcardTemplate.byId[id];
