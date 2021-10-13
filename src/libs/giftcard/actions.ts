import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

// import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import {
  fetchGiftcardList as fetchGiftcardListAPI,
  retrieveGiftcard as retrieveGiftcardAPI,
  deleteGiftcard as deleteGiftcardAPI,
  createOrUpdateGiftcard as createOrUpdateGiftcardAPI,
  fetchConsumerGiftcardList as fetchConsumerGiftcardListAPI,
  retrieveConsumerGiftcard as retrieveConsumerGiftcardAPI,
  attributeMember as attributeMemberAPI,
  sendEmailInvitation as sendEmailInvitationAPI,
  fetchGiftcardBackgroundList as fetchGiftcardBackgroundImageListAPI,
  deleteGiftcardBackgroundImage as deleteGiftcardBackgroundImageAPI,
  retrieveConsumerGiftcardByActivationCode as retrieveConsumerGiftcardByActivationCodeAPI,
  createGiftcardBackgroundImage as createGiftcardBackgroundImageAPI,
  restoreGiftcard as restoreGiftcardAPI,
} from './api';
import { ConsumerGiftcard, Giftcard, GiftcardBackgroundImage } from './types';
import type { Dispatch } from '../../state/types';
import { OptionCallback } from '../../state/types';

export const retrieveGiftcardActions = {
  error: createAction('GIFTCARD/RETRIEVE/ERROR'),
  isLoading: createAction('GIFTCARD/RETRIEVE/LOADING'),
  success: createAction('GIFTCARD/RETRIEVE/SUCCESS'),
};

export function retrieveGiftcard(
  id: number,
  options?: OptionCallback<Giftcard>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveGiftcardActions.isLoading(true));
    dispatch(retrieveGiftcardActions.error(null));

    try {
      const response = await retrieveGiftcardAPI(id);
      dispatch(
        retrieveGiftcardActions.success(
          response.data,
          // page: response.data.next_page,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(retrieveGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(retrieveGiftcardActions.error(error));
    }

    dispatch(retrieveGiftcardActions.isLoading(false));
  };
}

export const restoreGiftcardActions = {
  error: createAction('GIFTCARD/RESTORE/ERROR'),
  isLoading: createAction('GIFTCARD/RESTORE/LOADING'),
  success: createAction('GIFTCARD/RESTORE/SUCCESS'),
};

export function restoreGiftcard(
  id: number,
  options?: OptionCallback<Giftcard>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(restoreGiftcardActions.isLoading(true));
    dispatch(restoreGiftcardActions.error(null));

    try {
      const response = await restoreGiftcardAPI(id);
      dispatch(
        restoreGiftcardActions.success(
          response.data,
          // page: response.data.next_page,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(restoreGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(restoreGiftcardActions.error(error));
    }

    dispatch(restoreGiftcardActions.isLoading(false));
  };
}

export const listGiftcardActions = {
  error: createAction('GIFTCARD/LIST/ERROR'),
  isLoading: createAction('GIFTCARD/LIST/LOADING'),
  success: createAction('GIFTCARD/LIST/SUCCESS'),
};

export function fetchGiftcardList(
  params?: any,
  options?: OptionCallback<Array<Giftcard>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listGiftcardActions.isLoading(true));
    dispatch(listGiftcardActions.error(null));

    try {
      const response = await fetchGiftcardListAPI(params);
      dispatch(
        listGiftcardActions.success(
          response.data,
          // page: response.data.next_page,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(listGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(listGiftcardActions.error(error));
    }

    dispatch(listGiftcardActions.isLoading(false));
  };
}

export const listBulkGiftcardActions = {
  error: createAction('GIFTCARD/LIST_BULK/ERROR'),
  isLoading: createAction('GIFTCARD/LIST_BULK/LOADING'),
  success: createAction('GIFTCARD/LIST_BULK/SUCCESS'),
};

export function fetchGiftcardBulk(
  ids: Array<number>,
  options?: OptionCallback<Array<Giftcard>>,
) {
  return async (dispatch: Dispatch) => {
    const ids_uniq = uniq(ids);
    if (!ids_uniq || !ids_uniq.length) return;
    dispatch(listBulkGiftcardActions.isLoading(true));
    dispatch(listBulkGiftcardActions.error(null));

    try {
      const response = await fetchGiftcardListAPI({ id__in: ids_uniq });
      dispatch(
        listBulkGiftcardActions.success(
          response.data,
          // page: response.data.next_page,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(listBulkGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(listBulkGiftcardActions.error(error));
    }

    dispatch(listBulkGiftcardActions.isLoading(false));
  };
}

export const createOrUpdateGiftcardActions = {
  error: createAction('GIFTCARD/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('GIFTCARD/CREATE_OR_UPDATE/LOADING'),
  success: createAction('GIFTCARD/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateGiftcard(
  id: number,
  data: any,
  options?: OptionCallback<Giftcard>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateGiftcardActions.isLoading(true));
    dispatch(createOrUpdateGiftcardActions.error(null));

    try {
      const response = await createOrUpdateGiftcardAPI(id, data);
      dispatch(createOrUpdateGiftcardActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(createOrUpdateGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(createOrUpdateGiftcardActions.error(error));
    }

    dispatch(createOrUpdateGiftcardActions.isLoading(false));
  };
}

export const deleteGiftcardActions = {
  error: createAction('GIFTCARD/DELETE/ERROR'),
  isLoading: createAction('GIFTCARD/DELETE/LOADING'),
  success: createAction('GIFTCARD/DELETE/SUCCESS'),
};

export function deleteGiftcard(id: number, options?: OptionCallback<Giftcard>) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteGiftcardActions.isLoading(true));
    dispatch(deleteGiftcardActions.error(null));

    try {
      const response = await deleteGiftcardAPI(id);
      dispatch(deleteGiftcardActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(deleteGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(deleteGiftcardActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(deleteGiftcardActions.isLoading(false));
  };
}

export const retrieveConsumerGiftcardActions = {
  error: createAction('CONSUMER_GIFTCARD/RETRIEVE/ERROR'),
  isLoading: createAction('CONSUMER_GIFTCARD/RETRIEVE/LOADING'),
  success: createAction('CONSUMER_GIFTCARD/RETRIEVE/SUCCESS'),
};

export function retrieveConsumerGiftcard(
  id: number,
  options?: OptionCallback<ConsumerGiftcard>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveConsumerGiftcardActions.isLoading(true));
    dispatch(retrieveConsumerGiftcardActions.error(null));

    try {
      const response = await retrieveConsumerGiftcardAPI(id);
      dispatch(
        retrieveConsumerGiftcardActions.success(
          response.data,
          // page: response.data.next_page,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(retrieveConsumerGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(retrieveConsumerGiftcardActions.error(error));
    }

    dispatch(retrieveConsumerGiftcardActions.isLoading(false));
  };
}

export function retrieveConsumerGiftcardByActivationCode(
  activationCode: string,
  options?: OptionCallback<ConsumerGiftcard>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveConsumerGiftcardActions.isLoading(true));
    dispatch(retrieveConsumerGiftcardActions.error(null));

    try {
      const response = await retrieveConsumerGiftcardByActivationCodeAPI(
        activationCode,
      );
      dispatch(
        retrieveConsumerGiftcardActions.success(
          response.data,
          // page: response.data.next_page,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(retrieveConsumerGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(retrieveConsumerGiftcardActions.error(error));
    }

    dispatch(retrieveConsumerGiftcardActions.isLoading(false));
  };
}

export const listConsumerGiftcardActions = {
  error: createAction('CONSUMER_GIFTCARD/LIST/ERROR'),
  isLoading: createAction('CONSUMER_GIFTCARD/LIST/LOADING'),
  success: createAction('CONSUMER_GIFTCARD/LIST/SUCCESS'),
};

export function fetchConsumerGiftcardList(
  params: any,
  options?: OptionCallback<Array<ConsumerGiftcard>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listConsumerGiftcardActions.isLoading(true));
    dispatch(listConsumerGiftcardActions.error(null));

    try {
      const response = await fetchConsumerGiftcardListAPI(params);
      dispatch(
        listConsumerGiftcardActions.success({
          ...response.data,
          page: params?.page,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
      dispatch(listConsumerGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(listConsumerGiftcardActions.error(error));
    }

    dispatch(listConsumerGiftcardActions.isLoading(false));
  };
}

export const attributeToMemberActions = {
  error: createAction('CONSUMER_GIFTCARD/ATTRIBUTE_TO_MEMBER/ERROR'),
  isLoading: createAction('CONSUMER_GIFTCARD/ATTRIBUTE_TO_MEMBER/LOADING'),
  success: createAction('CONSUMER_GIFTCARD/ATTRIBUTE_TO_MEMBER/SUCCESS'),
};

export function attributeToMember(
  id: any,
  data: any,
  options?: OptionCallback<ConsumerGiftcard>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(attributeToMemberActions.isLoading(true));
    dispatch(attributeToMemberActions.error(null));

    try {
      const response = await attributeMemberAPI(id, data);
      dispatch(attributeToMemberActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(attributeToMemberActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(attributeToMemberActions.error(error));
    }

    dispatch(attributeToMemberActions.isLoading(false));
  };
}

export const sendEmailInvitationActions = {
  error: createAction('CONSUMER_GIFTCARD/SEND_EMAIL_INVITATION/ERROR'),
  isLoading: createAction('CONSUMER_GIFTCARD/SEND_EMAIL_INVITATION/LOADING'),
  success: createAction('CONSUMER_GIFTCARD/SEND_EMAIL_INVITATION/SUCCESS'),
};

export function sendEmailInvitation(
  id: number,
  recipientList: Array<string>,
  options?: OptionCallback<ConsumerGiftcard>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sendEmailInvitationActions.isLoading(true));
    dispatch(sendEmailInvitationActions.error(null));

    try {
      const response = await sendEmailInvitationAPI(id, recipientList);
      dispatch(sendEmailInvitationActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(sendEmailInvitationActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(sendEmailInvitationActions.error(error));
      if (options?.onError) options.onError(error);
    }

    dispatch(sendEmailInvitationActions.isLoading(false));
  };
}

export const listGiftcardBackgroundImageActions = {
  error: createAction('GIFTCARD_BACKGROUND_IMAGE/LIST/ERROR'),
  success: createAction('GIFTCARD_BACKGROUND_IMAGE/LIST/SUCCESS'),
  isLoading: createAction('GIFTCARD_BACKGROUND_IMAGE/LIST/LOADING'),
};

export function fetchGiftcardBackgroundImageList(
  companyId: number,
  options?: OptionCallback<GiftcardBackgroundImage>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listGiftcardBackgroundImageActions.isLoading(true));
    dispatch(listGiftcardBackgroundImageActions.error(null));

    try {
      const response = await fetchGiftcardBackgroundImageListAPI(companyId);
      dispatch(listGiftcardBackgroundImageActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(listConsumerGiftcardActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(listGiftcardBackgroundImageActions.error(error));
    }

    dispatch(listGiftcardBackgroundImageActions.isLoading(false));
  };
}

export const createGiftcardBackgroundImageActions = {
  error: createAction('GIFTCARD_BACKGROUND_IMAGE/CREATE/ERROR'),
  success: createAction('GIFTCARD_BACKGROUND_IMAGE/CREATE/SUCCESS'),
  loading: createAction('GIFTCARD_BACKGROUND_IMAGE/CREATE/LOADING'),
};

export function createGiftcardBackgroundImage(
  image: File,
  options?: OptionCallback<GiftcardBackgroundImage>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createGiftcardBackgroundImageActions.loading(true));
    dispatch(createGiftcardBackgroundImageActions.error(null));

    try {
      const data = new FormData();
      data.append('image', image);
      const response = await createGiftcardBackgroundImageAPI(data);
      dispatch(createGiftcardBackgroundImageActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(createGiftcardBackgroundImageActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(createGiftcardBackgroundImageActions.error(error));
    }

    dispatch(createGiftcardBackgroundImageActions.loading(false));
  };
}

export const deleteGiftcardBackgroundImageActions = {
  error: createAction('GIFTCARD_BACKGROUND_IMAGE/DELETE/ERROR'),
  success: createAction('GIFTCARD_BACKGROUND_IMAGE/DELETE/SUCCESS'),
  loading: createAction('GIFTCARD_BACKGROUND_IMAGE/DELETE/LOADING'),
};

export function deleteGiftcardBackgroundImage(
  id: number,
  options?: OptionCallback<GiftcardBackgroundImage>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteGiftcardBackgroundImageActions.loading(true));
    dispatch(deleteGiftcardBackgroundImageActions.error(null));

    try {
      const response = await deleteGiftcardBackgroundImageAPI(id);
      dispatch(deleteGiftcardBackgroundImageActions.success(id));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(deleteGiftcardBackgroundImageActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(deleteGiftcardBackgroundImageActions.error(error));
    }

    dispatch(deleteGiftcardBackgroundImageActions.loading(false));
  };
}

export const listConsumerGiftcardReceivedActions = {
  error: createAction('CONSUMER_GIFTCARD/LIST_RECEIVED/ERROR'),
  isLoading: createAction('CONSUMER_GIFTCARD/LIST_RECEIVED/LOADING'),
  success: createAction('CONSUMER_GIFTCARD/LIST_RECEIVED/SUCCESS'),
};

export function fetchConsumerGiftcardReceivedList(
  memberId: number | null,
  params: any,
  options?: OptionCallback<Array<ConsumerGiftcard>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listConsumerGiftcardReceivedActions.isLoading(true));
    dispatch(listConsumerGiftcardReceivedActions.error(null));

    try {
      const response = await fetchConsumerGiftcardListAPI({
        ...(params || {}),
        ...(memberId ? { dst_member: memberId } : { as_received: true }),
      });
      dispatch(
        listConsumerGiftcardReceivedActions.success({
          ...response.data,
          page: params?.page,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
      dispatch(listConsumerGiftcardReceivedActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(listConsumerGiftcardReceivedActions.error(error));
    }

    dispatch(listConsumerGiftcardReceivedActions.isLoading(false));
  };
}

export const listConsumerGiftcardSentActions = {
  error: createAction('CONSUMER_GIFTCARD/LIST_SENT/ERROR'),
  isLoading: createAction('CONSUMER_GIFTCARD/LIST_SENT/LOADING'),
  success: createAction('CONSUMER_GIFTCARD/LIST_SENT/SUCCESS'),
};

export function fetchConsumerGiftcardSentList(
  memberId: null | number,
  params: any,
  options?: OptionCallback<Array<ConsumerGiftcard>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listConsumerGiftcardSentActions.isLoading(true));
    dispatch(listConsumerGiftcardSentActions.error(null));

    try {
      const response = await fetchConsumerGiftcardListAPI({
        ...(params || {}),
        ...(memberId ? { src_member: memberId } : { as_sent: true }),
      });
      dispatch(
        listConsumerGiftcardSentActions.success({
          ...response.data,
          page: params?.page,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
      dispatch(listConsumerGiftcardSentActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(listConsumerGiftcardSentActions.error(error));
    }

    dispatch(listConsumerGiftcardSentActions.isLoading(false));
  };
}
