import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import { QuicksaleBasketItem } from '@bsport/common/master-data/buyable-items.js';
import {
  QuicksaleConfiguration,
  QuicksaleItem,
  QuicksaleSection,
  QuicksaleState,
} from './types';
import { quicksaleActions, quicksaleUpdateErrorAndLoading } from './actions';

const initialState: Immutable.Immutable<QuicksaleState> =
  Immutable<QuicksaleState>({
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    configurationName: '',
    sections: {
      allIds: [],
      byId: {},
    },
    items: {
      allIdsAndItemIdentifiers: [],
      byItemIdentifierById: {
        [QuicksaleBasketItem.PaymentPackIdentifier]: {},
        [QuicksaleBasketItem.PrivatePassIdentifier]: {},
        [QuicksaleBasketItem.PaymentComboIdentifier]: {},
        [QuicksaleBasketItem.ShopItemIdentifier]: {},
        [QuicksaleBasketItem.SubscriptionIdentifier]: {},
        [QuicksaleBasketItem.GiftcardIdentifier]: {},
      },
    },
  });

export default handleActions<Immutable.Immutable<QuicksaleState>, any>(
  {
    [quicksaleActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.set('loading', payload),
    [quicksaleActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => state.set('error', payload),
    [quicksaleActions.success.toString()]: (
      state,
      { payload }: { payload: QuicksaleConfiguration },
    ) => {
      const sectionsById = payload.configuration.reduce<{
        [section_id: string]: QuicksaleSection;
      }>(
        (previousSectionById, section) => ({
          ...previousSectionById,
          [section.section_id]: section,
        }),
        {},
      );

      const itemIdsAndIdentifiersLists: [QuicksaleBasketItem, number][] = [];
      const itemByIdentifierById: {
        [key in QuicksaleBasketItem]: { [id: number]: QuicksaleItem };
      } = {
        [QuicksaleBasketItem.PaymentPackIdentifier]: {},
        [QuicksaleBasketItem.PrivatePassIdentifier]: {},
        [QuicksaleBasketItem.PaymentComboIdentifier]: {},
        [QuicksaleBasketItem.ShopItemIdentifier]: {},
        [QuicksaleBasketItem.SubscriptionIdentifier]: {},
        [QuicksaleBasketItem.GiftcardIdentifier]: {},
      };

      payload.configuration.forEach((section) =>
        section.items.forEach((item) => {
          itemIdsAndIdentifiersLists.push([
            item.buyable_item_identifier,
            item.object_id,
          ]);
          itemByIdentifierById[item.buyable_item_identifier][item.object_id] =
            item;
        }),
      );

      return state
        .set('configurationName', payload.name)
        .setIn(
          ['sections', 'allIds'],
          payload.configuration.map((section) => section.section_id),
        )
        .setIn(['sections', 'byId'], sectionsById)
        .setIn(
          ['items', 'allIdsAndItemIdentifiers'],
          itemIdsAndIdentifiersLists,
        )
        .setIn(['items', 'byItemIdentifierById'], itemByIdentifierById);
    },
    [quicksaleUpdateErrorAndLoading.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.set('updateLoading', payload),
    [quicksaleUpdateErrorAndLoading.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => state.set('updateError', payload),
    [quicksaleUpdateErrorAndLoading.success.toString()]: (
      state,
      { payload }: { payload: QuicksaleConfiguration },
    ) => {
      const sectionsById = payload.configuration.reduce<{
        [section_id: string]: QuicksaleSection;
      }>(
        (previousSectionById, section) => ({
          ...previousSectionById,
          [section.section_id]: section,
        }),
        {},
      );

      const itemIdsAndIdentifiersLists: [QuicksaleBasketItem, number][] = [];
      const itemByIdentifierById: {
        [key in QuicksaleBasketItem]: { [id: number]: QuicksaleItem };
      } = {
        [QuicksaleBasketItem.PaymentPackIdentifier]: {},
        [QuicksaleBasketItem.PrivatePassIdentifier]: {},
        [QuicksaleBasketItem.PaymentComboIdentifier]: {},
        [QuicksaleBasketItem.ShopItemIdentifier]: {},
        [QuicksaleBasketItem.SubscriptionIdentifier]: {},
        [QuicksaleBasketItem.GiftcardIdentifier]: {},
      };

      payload.configuration.forEach((section) =>
        section.items.forEach((item) => {
          itemIdsAndIdentifiersLists.push([
            item.buyable_item_identifier,
            item.object_id,
          ]);
          itemByIdentifierById[item.buyable_item_identifier][item.object_id] =
            item;
        }),
      );

      return state
        .set('configurationName', payload.name)
        .setIn(
          ['sections', 'allIds'],
          payload.configuration.map((section) => section.section_id),
        )
        .setIn(['sections', 'byId'], sectionsById)
        .setIn(
          ['items', 'allIdsAndItemIdentifiers'],
          itemIdsAndIdentifiersLists,
        )
        .setIn(['items', 'byItemIdentifierById'], itemByIdentifierById);
    },
  },
  initialState,
);
