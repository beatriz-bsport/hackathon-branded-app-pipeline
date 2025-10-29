import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import {
  GIFTCARD_ACTIVATION_CODE_ERROR_CODE,
  GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_DISABLED,
  GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_ALREADY_ACTIVATED,
  GIFTCARD_ACTIVATION_FAIL_WHEN_MISSING_RECIPIENT_MEMBER,
} from '@bsport/common/lib/master-data/error-codes/giftcard.js';
import { snackbarError } from '#src/libs/snackbar/actions';
import { isErrorWithCustomCode } from '#src/libs/utils';
import { monitorBackgroundTask } from '../background-task/actions';
import { OptionCallback, Dispatch, PaginatedResponse } from '../../state/types';
import {
  fetchGiftcardList as fetchGiftcardListAPI,
  retrieveGiftcard as retrieveGiftcardAPI,
  deleteGiftcard as deleteGiftcardAPI,
  createOrUpdateGiftcard as createOrUpdateGiftcardAPI,
  fetchConsumerGiftcardList as fetchConsumerGiftcardListAPI,
  retrieveConsumerGiftcard as retrieveConsumerGiftcardAPI,
  attributeMember as attributeMemberAPI,
  attributeByPrintableCode as attributeByPrintableCodeAPI,
  sendEmailInvitation as sendEmailInvitationAPI,
  fetchGiftcardBackgroundList as fetchGiftcardBackgroundImageListAPI,
  deleteGiftcardBackgroundImage as deleteGiftcardBackgroundImageAPI,
  retrieveConsumerGiftcardByActivationCode as retrieveConsumerGiftcardByActivationCodeAPI,
  createGiftcardBackgroundImage as createGiftcardBackgroundImageAPI,
  restoreGiftcard as restoreGiftcardAPI,
  makeGiftcardCopy as makeGiftcardCopyAPI,
  fetchGiftcardTemplateList as fetchGiftcardTemplateListAPI,
  retrieveGiftcardTemplate as retrieveGiftcardTemplateAPI,
  createOrUpdateGiftcardTemplate as createOrUpdateGiftcardTemplateAPI,
  deleteGiftcardTemplate as deleteGiftcardTemplateAPI,
  createGiftcardTemplateInstances as createGiftcardTemplateInstancesAPI,
  deleteGiftcardTemplateInstance as deleteGiftcardTemplateInstanceAPI,
} from './api';
import type {
  ConsumerGiftcard,
  ConsumerGiftcardFilterParams,
  Giftcard,
  GiftcardAttributePrintableCodePayload,
  GiftcardBackgroundImage,
  GiftcardDataAPI,
  GiftcardAttributeMemberPayload,
  GiftcardTemplate,
} from './types';

const GIFTCARD_ACTIVATION_ERRORS = [
  GIFTCARD_ACTIVATION_CODE_ERROR_CODE,
  GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_DISABLED,
  GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_ALREADY_ACTIVATED,
  GIFTCARD_ACTIVATION_FAIL_WHEN_MISSING_RECIPIENT_MEMBER,
];

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
      dispatch(snackbarError(`giftCard.notFound`));

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
  error: createAction<Error | null>('CONSUMER_GIFTCARD/LIST/ERROR'),
  isLoading: createAction<boolean>('CONSUMER_GIFTCARD/LIST/LOADING'),
  success: createAction<PaginatedResponse<ConsumerGiftcard>>(
    'CONSUMER_GIFTCARD/LIST/SUCCESS',
  ),
};

export function fetchConsumerGiftcardList(
  params: ConsumerGiftcardFilterParams,
  options?: OptionCallback<ConsumerGiftcard[]>,
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
  error: createAction<Error | null>(
    'CONSUMER_GIFTCARD/ATTRIBUTE_TO_MEMBER/ERROR',
  ),
  isLoading: createAction<boolean>(
    'CONSUMER_GIFTCARD/ATTRIBUTE_TO_MEMBER/LOADING',
  ),
  success: createAction<ConsumerGiftcard>(
    'CONSUMER_GIFTCARD/ATTRIBUTE_TO_MEMBER/SUCCESS',
  ),
};

/**
 * Link a digital consumer giftcard to a member from an activation link as a member
 * @param id The uuid of the digital giftcard to activate
 * @param data
 */
export function attributeToMember(
  id: number,
  data: GiftcardAttributeMemberPayload,
  options?: OptionCallback<ConsumerGiftcard>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(attributeToMemberActions.isLoading(true));
    dispatch(attributeToMemberActions.error(null));
    try {
      const response = await attributeMemberAPI(id, data);
      dispatch(attributeToMemberActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(attributeToMemberActions.error(error));
      if (isErrorWithCustomCode(error)) {
        dispatch(
          snackbarError(
            `invoice.applyGiftcard.errors.${
              GIFTCARD_ACTIVATION_ERRORS.includes(
                error.response.data?.error_code,
              )
                ? error.response.data?.error_code
                : 'generic'
            }`,
          ),
        );
      }
      options?.onError?.(error);
    }

    dispatch(attributeToMemberActions.isLoading(false));
  };
}

export const attributeByPrintableCodeActions = {
  error: createAction<Error | null>(
    'CONSUMER_GIFTCARD/ATTRIBUTE_BY_PRINTABLE_CODE/ERROR',
  ),
  isLoading: createAction<boolean>(
    'CONSUMER_GIFTCARD/ATTRIBUTE_BY_PRINTABLE_CODE/LOADING',
  ),
  success: createAction<ConsumerGiftcard>(
    'CONSUMER_GIFTCARD/ATTRIBUTE_BY_PRINTABLE_CODE/SUCCESS',
  ),
};

/**
 * Link a printable consumer giftcard to a member from a code as a manager
 * @param data Payload containing the printable code of the consumer giftcard
 * @param options
 */
export function attributeByPrintableCode(
  data: GiftcardAttributePrintableCodePayload,
  options?: OptionCallback<ConsumerGiftcard>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(attributeByPrintableCodeActions.isLoading(true));
    dispatch(attributeByPrintableCodeActions.error(null));
    try {
      const response = await attributeByPrintableCodeAPI(data);
      dispatch(attributeByPrintableCodeActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(attributeByPrintableCodeActions.error(error));
      options?.onError?.(error);
    } finally {
      dispatch(attributeByPrintableCodeActions.isLoading(false));
    }
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
      // @ts-expect-error
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
        // @ts-expect-error
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
      const current_page = response.data?.page ?? params?.page;
      dispatch(
        listConsumerGiftcardReceivedActions.success({
          ...response.data,
          page: current_page,
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
      const current_page = response.data?.page ?? params?.page;
      dispatch(
        listConsumerGiftcardSentActions.success({
          ...response.data,
          page: current_page,
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

export function makeGiftcardCopy(id: number, options: OptionCallback) {
  return async () => {
    try {
      const response = await makeGiftcardCopyAPI(id);
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}

// ========= SHAREDE GIFTCARDS =========

export const listGiftcardTemplateActions = {
  error: createAction('GIFTCARD_TEMPLATE/LIST/ERROR'),
  isLoading: createAction('GIFTCARD_TEMPLATE/LIST/LOADING'),
  success: createAction('GIFTCARD_TEMPLATE/LIST/SUCCESS'),
};

export function fetchGiftcardTemplateList(
  options?: OptionCallback<GiftcardTemplate[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listGiftcardTemplateActions.isLoading(true));
    dispatch(listGiftcardTemplateActions.error(null));
    try {
      const response = await fetchGiftcardTemplateListAPI();
      dispatch(listGiftcardTemplateActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(listGiftcardTemplateActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(listGiftcardTemplateActions.isLoading(false));
  };
}

export const retrieveGiftcardTemplateActions = {
  error: createAction('GIFTCARD_TEMPLATE/RETRIEVE/ERROR'),
  isLoading: createAction('GIFTCARD_TEMPLATE/RETRIEVE/LOADING'),
  success: createAction('GIFTCARD_TEMPLATE/RETRIEVE/SUCCESS'),
};

export function retrieveGiftcardTemplate(
  id: number,
  options?: OptionCallback<GiftcardTemplate>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveGiftcardTemplateActions.isLoading(true));
    dispatch(retrieveGiftcardTemplateActions.error(null));
    try {
      const response = await retrieveGiftcardTemplateAPI(id);
      dispatch(retrieveGiftcardTemplateActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(retrieveGiftcardTemplateActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(retrieveGiftcardTemplateActions.isLoading(false));
  };
}

export const createGiftcardTemplateActions = {
  error: createAction('GIFTCARD_TEMPLATE/CREATE/ERROR'),
  isLoading: createAction('GIFTCARD_TEMPLATE/CREATE/LOADING'),
  success: createAction('GIFTCARD_TEMPLATE/CREATE/SUCCESS'),
};

export const updateGiftcardTemplateActions = {
  success: createAction('GIFTCARD_TEMPLATE/UPDATE/SUCCESS'),
};

export function createOrUpdateGiftcardTemplate(
  id: number | null,
  params: GiftcardDataAPI,
  options?: OptionCallback<GiftcardTemplate>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createGiftcardTemplateActions.isLoading(true));
    dispatch(createGiftcardTemplateActions.error(null));
    try {
      const response = await createOrUpdateGiftcardTemplateAPI(id, params);
      if (!id) {
        // Creation
        dispatch(createGiftcardTemplateActions.success(response.data));
      } else {
        dispatch(updateGiftcardTemplateActions.success(response.data));
      }
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(createGiftcardTemplateActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(createGiftcardTemplateActions.isLoading(false));
  };
}

export const deleteGiftcardTemplateActions = {
  error: createAction('GIFTCARD_TEMPLATE/DELETE/ERROR'),
  isLoading: createAction('GIFTCARD_TEMPLATE/DELETE/LOADING'),
  success: createAction('GIFTCARD_TEMPLATE/DELETE/SUCCESS'),
};

export function deleteGiftcardTemplate(
  id: number,
  options?: OptionCallback<void>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteGiftcardTemplateActions.isLoading(true));
    dispatch(deleteGiftcardTemplateActions.error(null));
    try {
      await deleteGiftcardTemplateAPI(id);
      dispatch(deleteGiftcardTemplateActions.success(id));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(deleteGiftcardTemplateActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteGiftcardTemplateActions.isLoading(false));
  };
}

export const createGiftcardTemplateInstanceActions = {
  error: createAction('GIFTCARD_TEMPLATE_INSTANCE/CREATE/ERROR'),
  isLoading: createAction('GIFTCARD_TEMPLATE_INSTANCE/CREATE/LOADING'),
  success: createAction('GIFTCARD_TEMPLATE_INSTANCE/CREATE/SUCCESS'),
};

export function createGiftcardTemplateInstances(
  params: { companies: Array<number>; giftcard_template: number },
  options?: OptionCallback<void>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createGiftcardTemplateInstanceActions.isLoading(true));
    dispatch(createGiftcardTemplateInstanceActions.error(null));
    try {
      const response = await createGiftcardTemplateInstancesAPI(params);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(createGiftcardTemplateInstanceActions.success());
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            if (options?.onSuccess) options.onSuccess();
            dispatch(retrieveGiftcardTemplate(params.giftcard_template));
          },
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(createGiftcardTemplateInstanceActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(createGiftcardTemplateInstanceActions.isLoading(false));
  };
}

export const deleteGiftcardTemplateInstanceActions = {
  error: createAction('GIFTCARD_TEMPLATE_INSTANCE/DELETE/ERROR'),
  isLoading: createAction('GIFTCARD_TEMPLATE_INSTANCE/DELETE/LOADING'),
  success: createAction('GIFTCARD_TEMPLATE_INSTANCE/DELETE/SUCCESS'),
};

export function deleteGiftcardTemplateInstance(
  giftcardTemplateId: number,
  companyId: number,
  options?: OptionCallback<GiftcardTemplate>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteGiftcardTemplateInstanceActions.isLoading(true));
    dispatch(deleteGiftcardTemplateInstanceActions.error(null));
    try {
      const response = await deleteGiftcardTemplateInstanceAPI(
        giftcardTemplateId,
        companyId,
      );
      dispatch(deleteGiftcardTemplateInstanceActions.success());
      dispatch(retrieveGiftcardTemplate(giftcardTemplateId));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(deleteGiftcardTemplateInstanceActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteGiftcardTemplateInstanceActions.isLoading(false));
  };
}
