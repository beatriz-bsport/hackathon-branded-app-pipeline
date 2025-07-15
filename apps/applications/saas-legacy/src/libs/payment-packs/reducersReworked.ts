import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import type { PaginatedResponse } from '#src/state/types';
import {
  PaymentPackStateReworked,
  PaymentPackTemplateAPI,
} from '#src/libs/payment-packs/types';
import {
  listPaymentPackTemplatePaginatedActions,
  listUniversalPaymentPackTemplatePaginatedActions,
} from '#src/libs/payment-packs/actions';
import { FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE } from '#src/libs/payment-packs/constants';

const initialState: Immutable.Immutable<PaymentPackStateReworked> =
  Immutable<PaymentPackStateReworked>({
    paymentPackTemplatePaginated: {
      availablePasses: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
      managerOnlyPasses: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
      archivedPasses: {
        page: 1,
        next_page: null,
        count: 0,
        allIds: [],
        byId: {},
        loading: false,
        error: undefined,
      },
    },
    universalPaymentPackTemplatePaginated: {
      availablePasses: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
      managerOnlyPasses: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
      archivedPasses: {
        page: 1,
        next_page: null,
        count: 0,
        allIds: [],
        byId: {},
        loading: false,
        error: undefined,
      },
    },
  });

export default handleActions<
  Immutable.Immutable<PaymentPackStateReworked>,
  any
>(
  {
    // =====
    // ===== PAGINATED PAYMENTPACKTEMPLATE ACTIONS
    // AVAILABLE PASSES
    [listPaymentPackTemplatePaginatedActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['paymentPackTemplatePaginated', 'availablePasses', 'loading'],
        payload,
      );
    },
    [listPaymentPackTemplatePaginatedActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['paymentPackTemplatePaginated', 'availablePasses', 'error'],
        payload,
      );
    },
    [listPaymentPackTemplatePaginatedActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PaymentPackTemplateAPI> },
    ) => {
      const { next_page, results, count, page } = payload;
      return state
        .setIn(
          ['paymentPackTemplatePaginated', 'availablePasses', 'page'],
          page,
        )
        .setIn(
          ['paymentPackTemplatePaginated', 'availablePasses', 'next_page'],
          next_page,
        )
        .setIn(
          ['paymentPackTemplatePaginated', 'availablePasses', 'count'],
          count,
        )
        .setIn(
          ['paymentPackTemplatePaginated', 'availablePasses', 'allIds'],
          (results ?? []).map((template) => template.id),
        )
        .merge(
          {
            paymentPackTemplatePaginated: {
              availablePasses: {
                byId: (results ?? []).reduce(
                  (acc, v) => ({ ...acc, [v.id]: v }),
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    // MANAGER ONLY PASSES
    [listPaymentPackTemplatePaginatedActions.isLoadingManagerOnly.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['paymentPackTemplatePaginated', 'managerOnlyPasses', 'loading'],
        payload,
      );
    },
    [listPaymentPackTemplatePaginatedActions.errorManagerOnly.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['paymentPackTemplatePaginated', 'managerOnlyPasses', 'error'],
        payload,
      );
    },
    [listPaymentPackTemplatePaginatedActions.successManagerOnly.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PaymentPackTemplateAPI> },
    ) => {
      const { next_page, results, count, page } = payload;
      return state
        .setIn(
          ['paymentPackTemplatePaginated', 'managerOnlyPasses', 'page'],
          page,
        )
        .setIn(
          ['paymentPackTemplatePaginated', 'managerOnlyPasses', 'next_page'],
          next_page,
        )
        .setIn(
          ['paymentPackTemplatePaginated', 'managerOnlyPasses', 'count'],
          count,
        )
        .setIn(
          ['paymentPackTemplatePaginated', 'managerOnlyPasses', 'allIds'],
          (results ?? []).map((template) => template.id),
        )
        .merge(
          {
            paymentPackTemplatePaginated: {
              managerOnlyPasses: {
                byId: (results ?? []).reduce(
                  (acc, v) => ({ ...acc, [v.id]: v }),
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    // ARCHIVED PASSES
    [listPaymentPackTemplatePaginatedActions.isLoadingArchived.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['paymentPackTemplatePaginated', 'archivedPasses', 'loading'],
        payload,
      );
    },
    [listPaymentPackTemplatePaginatedActions.errorArchived.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['paymentPackTemplatePaginated', 'archivedPasses', 'error'],
        payload,
      );
    },
    [listPaymentPackTemplatePaginatedActions.successArchived.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PaymentPackTemplateAPI> },
    ) => {
      const { next_page, results, count, page } = payload;
      return state
        .setIn(['paymentPackTemplatePaginated', 'archivedPasses', 'page'], page)
        .setIn(
          ['paymentPackTemplatePaginated', 'archivedPasses', 'next_page'],
          next_page,
        )
        .setIn(
          ['paymentPackTemplatePaginated', 'archivedPasses', 'count'],
          count,
        )
        .setIn(
          ['paymentPackTemplatePaginated', 'archivedPasses', 'allIds'],
          (results ?? []).map((template) => template.id),
        )
        .merge(
          {
            paymentPackTemplatePaginated: {
              archivedPasses: {
                byId: (results ?? []).reduce(
                  (acc, v) => ({ ...acc, [v.id]: v }),
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    // =====
    // =====
    // ===== PAGINATED UNIVERSAL PAYMENTPACKTEMPLATE ACTIONS
    // AVAILABLE PASSES
    [listUniversalPaymentPackTemplatePaginatedActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['universalPaymentPackTemplatePaginated', 'availablePasses', 'loading'],
        payload,
      );
    },
    [listUniversalPaymentPackTemplatePaginatedActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['universalPaymentPackTemplatePaginated', 'availablePasses', 'error'],
        payload,
      );
    },
    [listUniversalPaymentPackTemplatePaginatedActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PaymentPackTemplateAPI> },
    ) => {
      const { next_page, results, count, page } = payload;
      return state
        .setIn(
          ['universalPaymentPackTemplatePaginated', 'availablePasses', 'page'],
          page,
        )
        .setIn(
          [
            'universalPaymentPackTemplatePaginated',
            'availablePasses',
            'next_page',
          ],
          next_page,
        )
        .setIn(
          ['universalPaymentPackTemplatePaginated', 'availablePasses', 'count'],
          count,
        )
        .setIn(
          [
            'universalPaymentPackTemplatePaginated',
            'availablePasses',
            'allIds',
          ],
          (results ?? []).map((template) => template.id),
        )
        .merge(
          {
            universalPaymentPackTemplatePaginated: {
              availablePasses: {
                byId: (results ?? []).reduce(
                  (acc, v) => ({ ...acc, [v.id]: v }),
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    // MANAGER ONLY PASSES
    [listUniversalPaymentPackTemplatePaginatedActions.isLoadingManagerOnly.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          [
            'universalPaymentPackTemplatePaginated',
            'managerOnlyPasses',
            'loading',
          ],
          payload,
        );
      },
    [listUniversalPaymentPackTemplatePaginatedActions.errorManagerOnly.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(
          [
            'universalPaymentPackTemplatePaginated',
            'managerOnlyPasses',
            'error',
          ],
          payload,
        );
      },
    [listUniversalPaymentPackTemplatePaginatedActions.successManagerOnly.toString()]:
      (
        state,
        { payload }: { payload: PaginatedResponse<PaymentPackTemplateAPI> },
      ) => {
        const { next_page, results, count, page } = payload;
        return state
          .setIn(
            [
              'universalPaymentPackTemplatePaginated',
              'managerOnlyPasses',
              'page',
            ],
            page,
          )
          .setIn(
            [
              'universalPaymentPackTemplatePaginated',
              'managerOnlyPasses',
              'next_page',
            ],
            next_page,
          )
          .setIn(
            [
              'universalPaymentPackTemplatePaginated',
              'managerOnlyPasses',
              'count',
            ],
            count,
          )
          .setIn(
            [
              'universalPaymentPackTemplatePaginated',
              'managerOnlyPasses',
              'allIds',
            ],
            (results ?? []).map((template) => template.id),
          )
          .merge(
            {
              universalPaymentPackTemplatePaginated: {
                managerOnlyPasses: {
                  byId: (results ?? []).reduce(
                    (acc, v) => ({ ...acc, [v.id]: v }),
                    {},
                  ),
                },
              },
            },
            { deep: true },
          );
      },
    // Archived PASSES
    [listUniversalPaymentPackTemplatePaginatedActions.isLoadingArchived.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          [
            'universalPaymentPackTemplatePaginated',
            'archivedPasses',
            'loading',
          ],
          payload,
        );
      },
    [listUniversalPaymentPackTemplatePaginatedActions.errorArchived.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(
          ['universalPaymentPackTemplatePaginated', 'archivedPasses', 'error'],
          payload,
        );
      },
    [listUniversalPaymentPackTemplatePaginatedActions.successArchived.toString()]:
      (
        state,
        { payload }: { payload: PaginatedResponse<PaymentPackTemplateAPI> },
      ) => {
        const { next_page, results, count, page } = payload;
        return state
          .setIn(
            ['universalPaymentPackTemplatePaginated', 'archivedPasses', 'page'],
            page,
          )
          .setIn(
            [
              'universalPaymentPackTemplatePaginated',
              'archivedPasses',
              'next_page',
            ],
            next_page,
          )
          .setIn(
            [
              'universalPaymentPackTemplatePaginated',
              'archivedPasses',
              'count',
            ],
            count,
          )
          .setIn(
            [
              'universalPaymentPackTemplatePaginated',
              'archivedPasses',
              'allIds',
            ],
            (results ?? []).map((template) => template.id),
          )
          .merge(
            {
              universalPaymentPackTemplatePaginated: {
                archivedPasses: {
                  byId: (results ?? []).reduce(
                    (acc, v) => ({ ...acc, [v.id]: v }),
                    {},
                  ),
                },
              },
            },
            { deep: true },
          );
      },
    // =====
  },
  initialState,
);
