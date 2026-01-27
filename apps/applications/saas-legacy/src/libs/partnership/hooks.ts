import useAsyncFn from '#src/hooks/useAsyncFn';
import {
  activatePartnershipAccount,
  createPartnershipAccount,
  deletePartnershipAccount,
  getPartnershipAccounts,
  updatePartnershipAccount,
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
