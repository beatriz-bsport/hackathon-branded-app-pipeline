// @flow

import { createAction } from 'redux-actions';

import { snackbarError, snackbarSuccess } from '../../actions/snackbar.actions';
import {
  fetchMemberRelations as fetchMemberRelationsAPI,
  createRelation as createRelationAPI,
  updateRelation as updateRelationAPI,
  createConsumerPassLink as createConsumerPassLinkAPI,
  fetchSharedConsumerPaymentPacks as fetchSharedConsumerPacksAPI,
  unlinkConsumerPassLink as unlinkConsumerPassLinkAPI,
  relinkConsumerPassLink as relinkConsumerPassLinkAPI,
} from './api';

import type { Dispatch } from '../../state/types';

export const memberRelationCreateOrUpdateActions = {
  isLoading: createAction('MEMBER_RELATION/CREATE_OR_UPDATE/LOADING'),
  error: createAction('MEMBER_RELATION/CREATE_OR_UPDATE/ERROR'),
  success: createAction('MEMBER_RELATION/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateRelation(
  relationData: *,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(memberRelationCreateOrUpdateActions.isLoading(true));
    try {
      if (relationData.id) {
        const response = await updateRelationAPI(relationData.id, relationData);
        dispatch(memberRelationCreateOrUpdateActions.success(response.data));
        dispatch(snackbarSuccess('relationship:member.messages.edit.success'));
      } else {
        const response = await createRelationAPI(relationData);
        dispatch(memberRelationCreateOrUpdateActions.success(response.data));
        dispatch(
          snackbarSuccess('relationship:member.messages.create.success'),
        );
      }
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(memberRelationCreateOrUpdateActions.error(err));
      dispatch(
        snackbarError('relationship:member.messages.createOrUpdate.error'),
      );
      if (options && options.onError) options.onError();
    }
    dispatch(memberRelationCreateOrUpdateActions.isLoading(false));
  };
}

export const sharedConsumerPackListActions = {
  isLoading: createAction('RELATIONSHIP/SHARED_PASS/LOADING'),
  error: createAction('RELATIONSHIP/SHARED_PASS/ERROR'),
  success: createAction('RELATIONSHIP/SHARED_PASS/SUCCESS'),
};

export function fetchSharedConsumerPaymentPacks(member_relation: number) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedConsumerPackListActions.isLoading(true));
    dispatch(sharedConsumerPackListActions.error(null));
    try {
      const response = await fetchSharedConsumerPacksAPI({ member_relation });
      dispatch(sharedConsumerPackListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(sharedConsumerPackListActions.error(err));
    }
    dispatch(sharedConsumerPackListActions.isLoading(false));
  };
}

export const memberRelationListActions = {
  isLoading: createAction('MEMBER_RELATION/LIST/LOADING'),
  error: createAction('MEMBER_RELATION/LIST/ERROR'),
  success: createAction('MEMBER_RELATION/LIST/SUCCESS'),
};

export function fetchMemberRelations(
  memberId: number,
  options: { onSuccess: (Array<MemberRelation>) => void, onError: () => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(memberRelationListActions.isLoading(true));
    try {
      const response = await fetchMemberRelationsAPI(memberId);
      dispatch(memberRelationListActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(memberRelationListActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(memberRelationListActions.isLoading(false));
  };
}

export const sharedConsumerPackCreateOrUpdateActions = {
  isLoading: createAction('CONSUMER_PACK_LINK/CREATE_OR_UPDATE/IS_LOADING'),
  error: createAction('CONSUMER_PACK_LINK/CREATE_OR_UPDATE/ERROR'),
  success: createAction('CONSUMER_PACK_LINK/CREATE_OR_UPDATE/SUCCESS'),
};

export function linkToMemberRelation(
  consumerPackId: number,
  relationId: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedConsumerPackCreateOrUpdateActions.isLoading(true));
    dispatch(sharedConsumerPackCreateOrUpdateActions.error(null));
    try {
      const response = await createConsumerPassLinkAPI(
        consumerPackId,
        relationId,
      );
      dispatch(sharedConsumerPackCreateOrUpdateActions.success(response.data));
      dispatch(
        snackbarSuccess(
          'relationship:consumer_payment_pack_links.messages.create.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(sharedConsumerPackCreateOrUpdateActions.error(error));
      dispatch(
        snackbarError(
          'relationship:consumer_payment_pack_links.messages.create.error',
        ),
      );
      if (options && options.onError) options.onError();
    }
    dispatch(sharedConsumerPackCreateOrUpdateActions.isLoading(false));
  };
}

export function unlinkConsumerPaymentPackLink(
  consumerPackLinkId: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedConsumerPackCreateOrUpdateActions.isLoading(true));
    dispatch(sharedConsumerPackCreateOrUpdateActions.error(null));
    try {
      await unlinkConsumerPassLinkAPI(consumerPackLinkId);
      dispatch(
        snackbarSuccess(
          'relationship:consumer_payment_pack_links.messages.unlink.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(
        snackbarError(
          'relationship:consumer_payment_pack_links.messages.unlink.error',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    }
  };
}

export function relinkConsumerPaymentPackLink(
  consumerPackLinkId: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedConsumerPackCreateOrUpdateActions.isLoading(true));
    dispatch(sharedConsumerPackCreateOrUpdateActions.error(null));
    try {
      await relinkConsumerPassLinkAPI(consumerPackLinkId);
      dispatch(
        snackbarSuccess(
          'relationship:consumer_payment_pack_links.messages.relink.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(
        snackbarError(
          'relationship:consumer_payment_pack_links.messages.relink.error',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    }
  };
}
