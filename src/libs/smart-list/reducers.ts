// @ts-nocheck
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import { AutomatedCampaign, SmartListState } from './types';
import {
  smartListListAction,
  smartListDetailAction,
  updateSmartListAction,
  createSmartListAction,
  smartListCopyAction,
  deleteSmartListAction,
  fetchSmartListFiltersAction,
  filterUpdateAction,
  filterCreateAction,
  filterDeleteAction,
  smartListBulkAction,
  smartListAutoTagListActions,
  updateSmartListAutoTagActions,
  deleteSmartListAutoTagAction,
  createSmartListAutoTagActions,
  smartListFilterAction,
  deleteMultipleSmartListAutoTagAction,
  retrieveSmartListAutomatedCampaignActions,
  listSmartListAutomatedCampaignActions,
  createSmartListAutomatedCampaignActions,
  updateSmartListAutomatedCampaignActions,
  deleteSmartListAutomatedCampaignActions,
  fetchCadencesUsingSmartlistActions,
  fetchStoredCsvExportsActions,
} from './actions';

const initialState: Immutable.Immutable<SmartListState> =
  Immutable<SmartListState>({
    loading: false,
    error: null,
    byId: {},
    allIds: [],
    filtersByCategoryId: {},
    // Create or Update
    upsert: {
      loading: false,
      error: null,
    },
    filter: {
      loading: false,
      error: null,
    },
    smartListTagRules: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    smartListFiltered: {
      items: [],
      loading: false,
      error: null,
    },
    automatedCampaign: {
      loading: false,
      error: null,
      allIds: [],
      byId: {},
      bySmartListId: {},
      createOrUpdate: {
        loading: false,
        error: null,
      },
      delete: {
        loading: false,
        error: null,
      },
    },
    cadencesUsingSmartlist: {
      byId: {},
      loading: false,
      error: null,
    },
    csvExports: {
      loading: false,
      error: null,
      byId: {},
    },
  });

export default handleActions<Immutable.Immutable<SmartListState>, any>(
  {
    [smartListListAction.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.smartListDict,
          },
          { deep: true },
        )
        .set('allIds', payload.smartListIdList);
    },
    [smartListListAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [smartListListAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [smartListBulkAction.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.smartListDict,
          },
          { deep: true },
        )
        .set('allIds', payload.smartListIdList);
    },
    [smartListBulkAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [smartListBulkAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [smartListDetailAction.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload,
        },
        { deep: true },
      );
    },
    [smartListDetailAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [smartListDetailAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [createSmartListAction.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: { [payload.id]: payload },
          },
          { deep: true },
        )
        .update(
          'allIds',
          (myList, newId) => {
            return myList.concat([newId]);
          },
          payload.id,
        );
    },
    [createSmartListAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [createSmartListAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [smartListCopyAction.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: { [payload.id]: payload },
          },
          { deep: true },
        )
        .update(
          'allIds',
          (myList, newId) => {
            return myList.concat([newId]);
          },
          payload.id,
        );
    },
    [updateSmartListAction.success.toString()]: (state, { payload }) => {
      return state.merge({ byId: { [payload.id]: payload } }, { deep: true });
    },

    [updateSmartListAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [updateSmartListAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [deleteSmartListAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [deleteSmartListAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [deleteSmartListAction.success.toString()]: (state, { payload }) => {
      return state
        .updateIn(['byId'], (x) => x.without(`${payload}`))
        .update(
          'allIds',
          (myList, removeId) => {
            const newList = myList.filter((id) => id !== removeId);
            return newList;
          },
          payload,
        );
    },

    // Smart List specific actions
    [fetchSmartListFiltersAction.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          filtersByCategoryId: payload,
        },
        { deep: true },
      );
    },
    [fetchSmartListFiltersAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchSmartListFiltersAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['filter', 'loading'], payload);
    },
    // Filters actions

    [filterCreateAction.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          filtersByCategoryId: {
            [payload.filter_identifier]: {
              [payload.filter.id]: payload.filter,
            },
          },
        },
        { deep: true },
      );
    },
    [filterCreateAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['filter', 'loading'], payload);
    },
    [filterCreateAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['filter', 'error'], payload);
    },
    [filterUpdateAction.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          filtersByCategoryId: {
            [payload.filter_identifier]: {
              [payload.filter.id]: payload.filter,
            },
          },
        },
        { deep: true },
      );
    },

    [filterUpdateAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['filter', 'loading'], payload);
    },
    [filterUpdateAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['filter', 'error'], payload);
    },
    [filterDeleteAction.success.toString()]: (state, { payload }) => {
      return state.updateIn(
        ['filtersByCategoryId', payload.filter_identifier],
        (x) => x.without(`${payload.id}`),
      );
    },
    [filterDeleteAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['filter', 'loading'], payload);
    },
    [filterDeleteAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['filter', 'error'], payload);
    },
    [smartListAutoTagListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['smartListTagRules', 'loading'], payload);
    },
    [smartListAutoTagListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['smartListTagRules', 'error'], payload);
    },
    [smartListAutoTagListActions.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            smartListTagRules: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['smartListTagRules', 'allIds'],
          payload.map((tg) => tg.id),
        );
    },
    [createSmartListAutoTagActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['smartListTagRules', 'loading'], payload);
    },
    [createSmartListAutoTagActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['smartListTagRules', 'error'], payload);
    },
    [createSmartListAutoTagActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .merge(
          {
            smartListTagRules: {
              byId: {
                [payload.id]: payload,
              },
            },
          },
          { deep: true },
        )
        .updateIn(
          ['smartListTagRules', 'allIds'],
          (myList, newId) => {
            return myList.concat([newId]);
          },
          payload.id,
        );
    },
    [deleteSmartListAutoTagAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['smartListTagRules', 'loading'], payload);
    },
    [deleteSmartListAutoTagAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['smartListTagRules', 'error'], payload);
    },
    [deleteSmartListAutoTagAction.success.toString()]: (state, { payload }) => {
      const arr = state.smartListTagRules.allIds.filter(
        (ids) => ids !== payload,
      );
      return state.setIn(['smartListTagRules', 'allIds'], arr);
    },

    [deleteMultipleSmartListAutoTagAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['smartListTagRules', 'loading'], payload);
    },
    [deleteMultipleSmartListAutoTagAction.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['smartListTagRules', 'error'], payload);
    },
    [deleteMultipleSmartListAutoTagAction.success.toString()]: (
      state,
      { payload },
    ) => {
      const ids = Object.values(state.smartListTagRules.byId)
        .filter(
          (autotag) =>
            autotag.smartlist === payload.smartlist &&
            autotag.tag === payload.tag,
        )
        .map((autotag) => autotag.id);

      const arr = state.smartListTagRules.allIds.filter(
        (id) => !ids.includes(id),
      );
      return state.setIn(['smartListTagRules', 'allIds'], arr);
    },

    [updateSmartListAutoTagActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['smartListTagRules', 'loading'], payload);
    },
    [updateSmartListAutoTagActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['smartListTagRules', 'error'], payload);
    },
    [updateSmartListAutoTagActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['smartListTagRules', 'byId', payload.id], payload);
    },
    [smartListFilterAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['smartListFiltered', 'loading'], payload);
    },
    [smartListFilterAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['smartListFiltered', 'error'], payload);
    },
    [smartListFilterAction.success.toString()]: (state, { payload }) => {
      return state.setIn(['smartListFiltered', 'items'], payload);
    },
    [retrieveSmartListAutomatedCampaignActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'loading'], payload);
    },
    [retrieveSmartListAutomatedCampaignActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'error'], payload);
    },
    [retrieveSmartListAutomatedCampaignActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['automatedCampaign', 'allIds'], [payload.id])
        .setIn(['automatedCampaign', 'byId', payload.id], payload)
        .setIn(
          ['automatedCampaign', 'bySmartListId', payload.smartlist],
          payload,
        );
    },
    [listSmartListAutomatedCampaignActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'loading'], payload);
    },
    [listSmartListAutomatedCampaignActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'error'], payload);
    },
    [listSmartListAutomatedCampaignActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['automatedCampaign', 'allIds'],
          payload.map((auto_camp: AutomatedCampaign) => auto_camp.id),
        )
        .merge(
          {
            automatedCampaign: {
              byId: payload.reduce(
                (
                  acc: { [id: number]: AutomatedCampaign },
                  auto_camp: AutomatedCampaign,
                ) => {
                  acc[auto_camp.id] = auto_camp;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['automatedCampaign', 'bySmartListId'],
          payload.reduce(
            (
              acc: { [smartlist_id: number]: AutomatedCampaign[] },
              auto_camp: AutomatedCampaign,
            ) => {
              if (acc[auto_camp.smartlist]) {
                acc[auto_camp.smartlist] = [
                  ...acc[auto_camp.smartlist],
                  auto_camp,
                ];
              } else {
                acc[auto_camp.smartlist] = [auto_camp];
              }
              return acc;
            },
            {},
          ),
        );
    },
    [createSmartListAutomatedCampaignActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'loading'], payload);
    },
    [createSmartListAutomatedCampaignActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'error'], payload);
    },
    [createSmartListAutomatedCampaignActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['automatedCampaign', 'allIds'],
          [...state.automatedCampaign.allIds, payload.id],
        )
        .setIn(['automatedCampaign', 'byId', payload.id], payload)
        .setIn(
          ['automatedCampaign', 'bySmartListId', payload.smartlist],
          [
            ...(
              state.automatedCampaign.bySmartListId[payload.smartlist] || []
            ).filter((auto_c) => auto_c.id !== payload.id),
            payload,
          ],
        );
    },

    [updateSmartListAutomatedCampaignActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'loading'], payload);
    },
    [updateSmartListAutomatedCampaignActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'error'], payload);
    },
    [updateSmartListAutomatedCampaignActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['automatedCampaign', 'byId', payload.id], payload)
        .setIn(
          ['automatedCampaign', 'bySmartListId', payload.smartlist],
          [
            ...(
              state.automatedCampaign.bySmartListId[payload.smartlist] || []
            ).filter((auto_c) => auto_c.id !== payload.id),
            payload,
          ],
        );
    },

    [deleteSmartListAutomatedCampaignActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'loading'], payload);
    },
    [deleteSmartListAutomatedCampaignActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['automatedCampaign', 'error'], payload);
    },
    [deleteSmartListAutomatedCampaignActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['automatedCampaign', 'allIds'],
          state.automatedCampaign.allIds.filter((id) => id !== payload.id),
        )
        .updateIn(['automatedCampaign', 'byId'], (x) => x.without(payload.id));
    },

    [fetchCadencesUsingSmartlistActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadencesUsingSmartlist', 'loading'], payload);
    },
    [fetchCadencesUsingSmartlistActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadencesUsingSmartlist', 'error'], payload);
    },
    [fetchCadencesUsingSmartlistActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          smartlist_id: number;
          cadences: number[];
        };
      },
    ) => {
      return state.setIn(
        ['cadencesUsingSmartlist', 'byId', payload.smartlist_id],
        payload.cadences,
      );
    },

    [fetchStoredCsvExportsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['csvExports', 'loading'], payload);
    },
    [fetchStoredCsvExportsActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['csvExports', 'error'], payload);
    },
    [fetchStoredCsvExportsActions.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['csvExports', 'byId', payload.smartlist_id],
        payload.link,
      );
    },
  },
  initialState,
);
