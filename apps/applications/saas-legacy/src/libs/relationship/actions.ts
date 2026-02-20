import { createAction } from 'redux-actions';

import { isErrorWithCustomCode } from '#src/libs/utils';
import { snackbarError, snackbarSuccess } from '../snackbar/actions';
import {
  fetchMemberRelations as fetchMemberRelationsAPI,
  createRelation as createRelationAPI,
  updateRelation as updateRelationAPI,
  createConsumerPassLink as createConsumerPassLinkAPI,
  fetchSharedConsumerPaymentPacks as fetchSharedConsumerPacksAPI,
  unlinkConsumerPassLink as unlinkConsumerPassLinkAPI,
  relinkConsumerPassLink as relinkConsumerPassLinkAPI,
  createPrivateConsumerPassLink as createPrivateConsumerPassLinkAPI,
  fetchSharedPrivateConsumerPasses as fetchSharedPrivateConsumerPassesAPI,
  unlinkPrivateConsumerPassLink as unlinkPrivateConsumerPassLinkAPI,
  relinkPrivateConsumerPassLink as relinkPrivateConsumerPassLinkAPI,
  deleteRelation as deleteRelationAPI,
  fetchRelatedMemberList as fetchRelatedMemberListAPI,
  fetchControlableMemberList as fetchControlableMemberListAPI,
  fetchRelatedMembersNamesByConsumerPaymentPackLinks as fetchRelatedMembersNamesByConsumerPaymentPackLinksAPI,
  fetchRelatedMembersNamesByPrivateConsumerPassLinks as fetchRelatedMembersNamesByPrivateConsumerPassLinksAPI,
} from './api';

import { Dispatch, OptionCallback } from '../../state/types';
import { MEISUNDEFINED } from './constants';

import type {
  ConsumerPaymentPackLinkWithRelatedMemberNames,
  PrivateConsumerPassLink,
} from './types';
import type { MemberMinimal } from '#src/libs/member/types';
import { AxiosError } from 'axios';

export const memberRelationCreateOrUpdateActions = {
  isLoading: createAction('MEMBER_RELATION/CREATE_OR_UPDATE/LOADING'),
  error: createAction('MEMBER_RELATION/CREATE_OR_UPDATE/ERROR'),
  success: createAction('MEMBER_RELATION/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateRelation(
  relationData: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(memberRelationCreateOrUpdateActions.isLoading(true));
    try {
      if (relationData.id) {
        const response = await updateRelationAPI(relationData.id, relationData);
        dispatch(memberRelationCreateOrUpdateActions.success(response.data));
        dispatch(snackbarSuccess('relationship.edit.success'));
      } else {
        const response = await createRelationAPI(relationData);
        dispatch(memberRelationCreateOrUpdateActions.success(response.data));
        dispatch(snackbarSuccess('relationship.create.success'));
      }
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorCode = String(axiosError?.response?.data?.error_code);
      if (
        isErrorWithCustomCode(axiosError) &&
        ['90007', '90008', '90009'].includes(errorCode)
      ) {
        dispatch(snackbarError(`relationship.createOrUpdate.${errorCode}`));
      } else {
        dispatch(snackbarError('relationship.createOrUpdate.error'));
      }
      dispatch(memberRelationCreateOrUpdateActions.error(error));
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

export function fetchSharedConsumerPaymentPacks(
  member_relation: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedConsumerPackListActions.isLoading(true));
    dispatch(sharedConsumerPackListActions.error(null));
    try {
      const response = await fetchSharedConsumerPacksAPI({ member_relation });
      dispatch(sharedConsumerPackListActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(sharedConsumerPackListActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(sharedConsumerPackListActions.isLoading(false));
  };
}

export const consumerPackLinksActions = {
  isLoading: createAction('RELATIONSHIP/LINK/LOADING'),
  error: createAction('RELATIONSHIP/LINK/ERROR'),
  success: createAction('RELATIONSHIP/LINK/SUCCESS'),
};

export function fetchConsumerPaymentPackLinks(
  links: Array<number>,
  options?: OptionCallback,
) {
  if (!links.length)
    return (dispatch: Dispatch) =>
      dispatch(consumerPackLinksActions.success([]));
  return async (dispatch: Dispatch) => {
    dispatch(consumerPackLinksActions.isLoading(true));
    dispatch(consumerPackLinksActions.error(null));
    try {
      const response = await fetchSharedConsumerPacksAPI({
        id__in: links,
      });
      dispatch(consumerPackLinksActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(consumerPackLinksActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(consumerPackLinksActions.isLoading(false));
  };
}

export const memberRelationListActions = {
  isLoading: createAction('MEMBER_RELATION/LIST/LOADING'),
  error: createAction('MEMBER_RELATION/LIST/ERROR'),
  success: createAction('MEMBER_RELATION/LIST/SUCCESS'),
};

export function fetchMemberRelations(
  memberId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(memberRelationListActions.isLoading(true));
    try {
      const response = await fetchMemberRelationsAPI(memberId);
      dispatch(memberRelationListActions.success(response.data));
      // @ts-expect-error
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
  options: OptionCallback,
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
          'relationship.consumer_payment_pack_links.create.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(sharedConsumerPackCreateOrUpdateActions.error(error));
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarError(
            `relationship.consumer_payment_pack_links.create.error.${String(
              error.response.data.error_code,
            )}`,
          ),
        );
      } else {
        dispatch(
          snackbarError(
            'relationship.consumer_payment_pack_links.create.error.generic',
          ),
        );
      }
      if (options && options.onError) options.onError();
    }
    dispatch(sharedConsumerPackCreateOrUpdateActions.isLoading(false));
  };
}

export function unlinkConsumerPaymentPackLink(
  consumerPackLinkId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedConsumerPackCreateOrUpdateActions.isLoading(true));
    dispatch(sharedConsumerPackCreateOrUpdateActions.error(null));
    try {
      await unlinkConsumerPassLinkAPI(consumerPackLinkId);
      dispatch(
        snackbarSuccess(
          'relationship.consumer_payment_pack_links.unlink.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (_err) {
      dispatch(
        snackbarError('relationship.consumer_payment_pack_links.unlink.error'),
      );
      if (options && options.onSuccess) options.onSuccess();
    }
    dispatch(sharedConsumerPackCreateOrUpdateActions.isLoading(false));
  };
}

export function relinkConsumerPaymentPackLink(
  consumerPackLinkId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedConsumerPackCreateOrUpdateActions.isLoading(true));
    dispatch(sharedConsumerPackCreateOrUpdateActions.error(null));
    try {
      await relinkConsumerPassLinkAPI(consumerPackLinkId);
      dispatch(
        snackbarSuccess(
          'relationship.consumer_payment_pack_links.relink.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (_err) {
      dispatch(
        snackbarError('relationship.consumer_payment_pack_links.relink.error'),
      );
      if (options && options.onSuccess) options.onSuccess();
    }
    dispatch(sharedConsumerPackCreateOrUpdateActions.isLoading(false));
  };
}

export const sharedPrivateConsumerPassListActions = {
  isLoading: createAction('RELATIONSHIP/SHARED_PRIVATE_PASS/LOADING'),
  error: createAction('RELATIONSHIP/SHARED_PRIVATE_PASS/ERROR'),
  success: createAction('RELATIONSHIP/SHARED_PRIVATE_PASS/SUCCESS'),
};

export function fetchSharedPrivateConsumerPasses(
  member_relation: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedPrivateConsumerPassListActions.isLoading(true));
    dispatch(sharedPrivateConsumerPassListActions.error(null));
    try {
      const response = await fetchSharedPrivateConsumerPassesAPI({
        member_relation,
      });
      dispatch(sharedPrivateConsumerPassListActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(sharedPrivateConsumerPassListActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(sharedPrivateConsumerPassListActions.isLoading(false));
  };
}

export const sharedPrivateConsumerPassCreateOrUpdateActions = {
  isLoading: createAction(
    'PRIVATE_CONSUMER_PASS_LINK/CREATE_OR_UPDATE/IS_LOADING',
  ),
  error: createAction('PRIVATE_CONSUMER_PASS_LINK/CREATE_OR_UPDATE/ERROR'),
  success: createAction('PRIVATE_CONSUMER_PASS_LINK/CREATE_OR_UPDATE/SUCCESS'),
};

export function linkPrivatePassToMemberRelation(
  privateConsumerPassId: number,
  relationId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedPrivateConsumerPassCreateOrUpdateActions.isLoading(true));
    dispatch(sharedPrivateConsumerPassCreateOrUpdateActions.error(null));
    try {
      const response = await createPrivateConsumerPassLinkAPI(
        privateConsumerPassId,
        relationId,
      );
      dispatch(
        sharedPrivateConsumerPassCreateOrUpdateActions.success(response.data),
      );
      dispatch(
        snackbarSuccess(
          'relationship.private_consumer_pass_links.create.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(sharedPrivateConsumerPassCreateOrUpdateActions.error(error));
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarError(
            `relationship.private_consumer_pass_links.create.error.${String(
              error.response.data.error_code,
            )}`,
          ),
        );
      } else {
        dispatch(
          snackbarError(
            'relationship.private_consumer_pass_links.create.error.generic',
          ),
        );
      }
      if (options && options.onError) options.onError();
    }
    dispatch(sharedPrivateConsumerPassCreateOrUpdateActions.isLoading(false));
  };
}

export function unlinkPrivateConsumerPassLink(
  privateConsumerPassLinkId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedPrivateConsumerPassCreateOrUpdateActions.isLoading(true));
    dispatch(sharedPrivateConsumerPassCreateOrUpdateActions.error(null));
    try {
      await unlinkPrivateConsumerPassLinkAPI(privateConsumerPassLinkId);
      dispatch(
        snackbarSuccess(
          'relationship.private_consumer_pass_links.unlink.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (_err) {
      dispatch(
        snackbarError('relationship.private_consumer_pass_links.unlink.error'),
      );
      if (options && options.onSuccess) options.onSuccess();
    }
  };
}

export function relinkPrivateConsumerPassLink(
  privateConsumerPassLinkId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sharedPrivateConsumerPassCreateOrUpdateActions.isLoading(true));
    dispatch(sharedPrivateConsumerPassCreateOrUpdateActions.error(null));
    try {
      await relinkPrivateConsumerPassLinkAPI(privateConsumerPassLinkId);
      dispatch(
        snackbarSuccess(
          'relationship.private_consumer_pass_links.relink.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (_err) {
      dispatch(
        snackbarError('relationship.private_consumer_pass_links.relink.error'),
      );
      if (options && options.onSuccess) options.onSuccess();
    }
  };
}

export const deleteRelationActions = {
  isLoading: createAction('RELATIONSHIP/DELETE/IS_LOADING'),
  error: createAction('RELATIONSHIP/DELETE/ERROR'),
  success: createAction('RELATIONSHIP/DELETE/SUCCESS'),
};

export function deleteRelation(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteRelationActions.isLoading(true));
    dispatch(deleteRelationActions.error(null));
    try {
      await deleteRelationAPI(id);
      dispatch(snackbarSuccess('relationship.delete.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (_err) {
      dispatch(snackbarError('relationship.delete.error'));
      if (options && options.onSuccess) options.onSuccess();
    }
  };
}

export const listRelatedMembersActions = {
  isLoading: createAction('RELATIONSHIP/RELATED_MEMBER/IS_LOADING'),
  error: createAction('RELATIONSHIP/RELATED_MEMBER/ERROR'),
  success: createAction('RELATIONSHIP/RELATED_MEMBER/SUCCESS'),
};

export function fetchMyRelatedMemberList(
  company: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listRelatedMembersActions.isLoading(true));
    dispatch(listRelatedMembersActions.error(null));
    try {
      const response = await fetchRelatedMemberListAPI(company);
      dispatch(listRelatedMembersActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(listRelatedMembersActions.error(err));
      if (options && options.onSuccess) options.onSuccess();
    }
    dispatch(listRelatedMembersActions.isLoading(false));
  };
}

export const listControlableMembersActions = {
  isLoading: createAction<boolean>(
    'RELATIONSHIP/CONTROLABLE_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('RELATIONSHIP/CONTROLABLE_MEMBER/ERROR'),
  success: createAction<MemberMinimal[]>(
    'RELATIONSHIP/CONTROLABLE_MEMBER/SUCCESS',
  ),
};

export function fetchMyControlableMemberList(
  company: number,
  options?: OptionCallback<MemberMinimal[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listControlableMembersActions.isLoading(true));
    dispatch(listControlableMembersActions.error(null));
    try {
      const response = await fetchControlableMemberListAPI(company);
      dispatch(listControlableMembersActions.success(response.data));
      options?.onSuccess?.();
    } catch (err) {
      err?.response?.data?.error_code === MEISUNDEFINED &&
        dispatch(snackbarError(`relationship.error.${String(MEISUNDEFINED)}`));

      dispatch(listControlableMembersActions.error(err));
      options?.onSuccess?.();
    } finally {
      dispatch(listControlableMembersActions.isLoading(false));
    }
  };
}

export const fetchRelatedMembersNamesByConsumerPaymentPackLinksActions = {
  isLoading: createAction<boolean>(
    'RELATIONSHIP/RELATED_MEMBER_BY_CONSUMER_PACK_LINK/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'RELATIONSHIP/RELATED_MEMBER_BY_CONSUMER_PACK_LINK/ERROR',
  ),
  success: createAction<ConsumerPaymentPackLinkWithRelatedMemberNames>(
    'RELATIONSHIP/RELATED_MEMBER_BY_CONSUMER_PACK_LINK/SUCCESS',
  ),
};

export const fetchRelatedMembersNamesByConsumerPaymentPackLinks =
  (consumerPackLinks: number[], options?: OptionCallback) =>
  async (dispatch: Dispatch) => {
    dispatch(
      fetchRelatedMembersNamesByConsumerPaymentPackLinksActions.isLoading(true),
    );
    dispatch(
      fetchRelatedMembersNamesByConsumerPaymentPackLinksActions.error(null),
    );
    try {
      const response =
        await fetchRelatedMembersNamesByConsumerPaymentPackLinksAPI({
          id__in: consumerPackLinks,
        });

      dispatch(
        fetchRelatedMembersNamesByConsumerPaymentPackLinksActions.success(
          // @ts-expect-error
          response.data,
        ),
      );
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response);
    } catch (err) {
      dispatch(
        fetchRelatedMembersNamesByConsumerPaymentPackLinksActions.error(err),
      );
      if (options && options.onError) options.onError(err);
    }
    dispatch(
      fetchRelatedMembersNamesByConsumerPaymentPackLinksActions.isLoading(
        false,
      ),
    );
  };

export const fetchRelatedMembersNamesByPrivateConsumerPassLinksActions = {
  isLoading: createAction<boolean>(
    'RELATIONSHIP/RELATED_MEMBER_BY_PRIVATE_CONSUMER_PASS_LINK/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'RELATIONSHIP/RELATED_MEMBER_BY_PRIVATE_CONSUMER_PASS_LINK/ERROR',
  ),
  success: createAction<PrivateConsumerPassLink>(
    'RELATIONSHIP/RELATED_MEMBER_BY_PRIVATE_CONSUMER_PASS_LINK/SUCCESS',
  ),
};

export const fetchRelatedMembersNamesByPrivateConsumerPassLinks =
  (privateConsumerPassLinks: number[], options?: OptionCallback) =>
  async (dispatch: Dispatch) => {
    dispatch(
      fetchRelatedMembersNamesByPrivateConsumerPassLinksActions.isLoading(true),
    );
    dispatch(
      fetchRelatedMembersNamesByPrivateConsumerPassLinksActions.error(null),
    );
    try {
      const response =
        await fetchRelatedMembersNamesByPrivateConsumerPassLinksAPI({
          id__in: privateConsumerPassLinks,
        });

      dispatch(
        fetchRelatedMembersNamesByPrivateConsumerPassLinksActions.success(
          // @ts-expect-error
          response.data,
        ),
      );
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response);
    } catch (err) {
      dispatch(
        fetchRelatedMembersNamesByPrivateConsumerPassLinksActions.error(err),
      );
      if (options && options.onError) options.onError(err);
    }
    dispatch(
      fetchRelatedMembersNamesByPrivateConsumerPassLinksActions.isLoading(
        false,
      ),
    );
  };
