import useAsyncFn from '#src/hooks/useAsyncFn';
import { fetchPrivateConsumerPassList } from '../api';
import { PrivateConsumerPassREST } from '../types';

export const useGetPrivateConsumerPass = () => {
  const doFetchPrivateConsumerPass = async (privateConsumerPassId?: number) => {
    if (!privateConsumerPassId) {
      return null;
    }

    // @ts-expect-error
    const privateConsumerPassResponse: { data: PrivateConsumerPassREST[] } =
      await fetchPrivateConsumerPassList({
        id__in: privateConsumerPassId,
      });

    return privateConsumerPassResponse.data[0] || null;
  };

  return useAsyncFn(doFetchPrivateConsumerPass, []);
};
