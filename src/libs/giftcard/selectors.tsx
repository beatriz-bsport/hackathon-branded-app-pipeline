import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { RootState } from '../../reducers';
import { Giftcard, ConsumerGiftcard, GiftcardBackgroundImage } from './types';
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

export const getConsumerGiftcardByActivationCode = (
  state: RootState,
  activationCode: number,
) =>
  Object.values(state.giftcard.consumerGiftcard.byId).find(
    (cg) => cg.activation_code === activationCode,
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

export const withGiftcard = memoize((selector) =>
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

export const withSender = memoize((selector) =>
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

export const withReceiver = memoize((selector) =>
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
