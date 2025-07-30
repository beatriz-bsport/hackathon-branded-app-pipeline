import { useCallback, useEffect } from 'react';
import { fetchEstablishmentList } from '#src/libs/establishment/api';
import { fetchAllActivities } from '#src/libs/meta-activity/api/common';
import {
  fetchAllPaymentPackCategory,
  fetchOne,
} from '#src/libs/payment-packs/api';
import {
  fetchAllPrivateServices,
  fetchAllPrivatePassCategory,
  fetchPrivatePass,
  fetchAllPrivateSlots,
} from '#src/libs/private-service/api';

import { usePassCardDataContext } from '#src/pages/checkout/express-checkouts/pass/context/PassCardDataContext';
import useAsyncFn from '#src/hooks/useAsyncFn';

import type {
  PrivatePass,
  PrivatePassCategory,
  PrivateService,
  PrivateSlot,
} from '#src/libs/private-service/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import { PassTypes } from '#src/libs/marketplace/types';

export const useFetchPassData = () => {
  const { passId, passType, companyId, setPassCardData } =
    usePassCardDataContext();

  const fetchPaymentPackData = useCallback(async () => {
    try {
      const { data: paymentPack }: { data: PaymentPack } = await fetchOne(
        passId,
      );
      const establishmentIds = paymentPack?.establishments || [];
      const metaActivityIds = paymentPack?.metaActivities || [];

      const {
        data: { results: establishments },
      } = await fetchEstablishmentList({
        id__in: establishmentIds,
      });

      const {
        data: { results: metaActivities },
      } = await fetchAllActivities({ id__in: metaActivityIds });

      const { data: categories } = await fetchAllPaymentPackCategory({});

      return {
        establishments,
        metaActivities,
        categories,
        paymentPack,
      };
    } catch (error) {
      console.error(error);
    }
  }, [passId]);

  const fetchPrivatePassData = useCallback(async () => {
    try {
      const { data: privatePass } = (await fetchPrivatePass(passId)) as {
        data: PrivatePass;
      };
      const privateServiceIds = privatePass?.private_services || [];
      const { data: privateServices } = (await fetchAllPrivateServices({
        id__in: privateServiceIds,
        company: companyId,
        available: true,
        manager_only: false,
      })) as { data: PrivateService[] };
      const { data: privatePassCategories } =
        (await fetchAllPrivatePassCategory({})) as {
          data: PrivatePassCategory[];
        };
      const { data: privateSlots } = (await fetchAllPrivateSlots({})) as {
        data: PrivateSlot[];
      };
      return {
        privatePass,
        privateServices,
        privatePassCategories,
        privateSlots,
      };
    } catch (error) {
      console.error(error);
    }
  }, [companyId, passId]);

  const [state, fetchData] = useAsyncFn(async () => {
    if (passType === PassTypes.PAYMENTPACK) {
      const paymentPackData = await fetchPaymentPackData();
      return { passType, passId, paymentPackData };
    } else {
      const privatePassData = await fetchPrivatePassData();
      return { passType, passId, privatePassData };
    }
  });

  useEffect(() => {
    if (state.value) {
      setPassCardData(state.value);
    }
  }, [state.value, setPassCardData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading: state.loading,
    error: state.error,
    refetchPassData: fetchData,
  };
};
