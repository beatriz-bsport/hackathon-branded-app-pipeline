import useAsyncFn from '#src/hooks/useAsyncFn';
import { LuxonDateTime } from '#src/types';
import { ActivePartnershipAccountForOfferParams } from './types';
import {
  activatePartnershipAccount,
  createPartnershipAccount,
  deletePartnershipAccount,
  getActivePartnershipAccountForOffer,
  getPartnershipAccounts,
  updatePartnershipAccount,
  validateExternalId,
} from './api';

export const useGetPartnershipAccounts = (partnershipId: number) => {
  const doFetchPartnershipAccounts = async () => {
    const partnershipAccountResponse = await getPartnershipAccounts({
      partnership: partnershipId,
    });

    return partnershipAccountResponse.data;
  };

  return useAsyncFn(doFetchPartnershipAccounts, [partnershipId]);
};

export const useCreatePartnershipAccount = (partnershipId: number) => {
  const doCreatePartnershipAccounts = async (data: {
    establishmentIds: number[];
  }) => {
    const partnershipAccountResponse = await createPartnershipAccount({
      establishment_group: data.establishmentIds,
      partnership: partnershipId,
    });

    return partnershipAccountResponse.data;
  };

  return useAsyncFn(doCreatePartnershipAccounts, [partnershipId]);
};

export const useDeletePartnershipAccount = () => {
  const doDeletePartnershipAccount = async (accountId: string) => {
    await deletePartnershipAccount(accountId);
  };

  return useAsyncFn(doDeletePartnershipAccount, []);
};

export const useUpdatePartnershipAccount = (partnershipId: number) => {
  const doUpdatePartnershipAccount = async (
    accountId: string,
    data: { establishmentIds: number[] },
  ) => {
    const partnershipAccountResponse = await updatePartnershipAccount(
      accountId,
      {
        partnership: partnershipId,
        establishment_group: data.establishmentIds,
      },
    );

    return partnershipAccountResponse.data;
  };

  return useAsyncFn(doUpdatePartnershipAccount, [partnershipId]);
};

export const useActivatePartnershipAccount = () => {
  const doActivatePartnershipAccount = async (accountId: string) => {
    await activatePartnershipAccount(accountId);
  };

  return useAsyncFn(doActivatePartnershipAccount, []);
};

export const useGetActivePartnershipAccountForOffer = () => {
  const doGetActivePartnershipAccountForOffer = async (
    establishment?: number,
    date_start?: LuxonDateTime,
    offer?: number,
  ) => {
    const params: ActivePartnershipAccountForOfferParams = offer
      ? { offer }
      : {
          establishment: establishment as number,
          date_start: date_start?.toISODate() as string,
        };

    const response = await getActivePartnershipAccountForOffer(params);
    return response.data;
  };

  return useAsyncFn(doGetActivePartnershipAccountForOffer, []);
};

export const useValidateExternalId = (partnershipId: number) => {
  const doValidateExternalId = async (externalId: string) => {
    const response = await validateExternalId({
      external_id: externalId,
      partnership: partnershipId,
    });
    return response.data;
  };

  return useAsyncFn(doValidateExternalId, [partnershipId]);
};

export const useCreateWellhubPartnershipAccount = (partnershipId: number) => {
  const doCreate = async (data: {
    externalId: string;
    establishmentIds: number[];
  }) => {
    const response = await createPartnershipAccount({
      external_id: data.externalId,
      establishment_group: data.establishmentIds,
      partnership: partnershipId,
    });
    return response.data;
  };

  return useAsyncFn(doCreate, [partnershipId]);
};
