import { retrieveOffer } from '#src/libs/offer/api';
import type { Coach } from '#src/libs/associated-coach/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Establishment } from '#src/libs/establishment/types';

import first from 'lodash/first';
import useAsyncFn from '#src/hooks/useAsyncFn';
import { fetchPaymentPackList } from '#src/libs/payment-packs/api';
import { fetchMetaActivityDetails } from '#src/libs/meta-activity/api/common';
import { retrieveEstablishment } from '#src/libs/establishment/api';
import { fetchAssociatedCoaches } from '#src/libs/associated-coach/api';

const buildFetchOfferInformation = async (
  offerId: number,
  companyId: number,
) => {
  const { data: offer } = await retrieveOffer(offerId);

  // Here, we are not calling getAvailablePaymentPacks because One Click Booking
  // target only the simple case of bookings for new members
  const {
    data: { results: paymentPacks },
  } = await fetchPaymentPackList({
    offer: offer.id,
    company: companyId,
    manager_only: false,
    disabled: false,
    as_consumer: true,
    page: 1,
    page_size: 4,
    include_expired: false,
    new_member_only: true,
  });
  let metaActivity: MetaActivity | undefined;
  let establishment: Establishment | undefined;
  let coach: Coach | undefined;
  try {
    metaActivity = (await fetchMetaActivityDetails(offer.meta_activity)).data;
    establishment = (await retrieveEstablishment(offer.establishment)).data;

    coach = first(
      (await fetchAssociatedCoaches({ id__in: [offer.coach] })).data,
    );
  } catch (error) {
    console.error(error);
  }

  return {
    offer,
    paymentPacks,
    metaActivity,
    establishment,
    coach,
  };
};

const useFetchOfferInformation = () => {
  return useAsyncFn(buildFetchOfferInformation);
};

export default useFetchOfferInformation;
