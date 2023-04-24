// @ts-nocheck
import { Offer_FULL } from '../offer/types';
import { ExtraDataFromQueryParams } from './types';

export function withExtraDataFromQueryParams(
  offerList: Array<Offer_FULL>,
  offerExtraDataList: ExtraDataFromQueryParams,
) {
  return offerList.map((offer) => {
    const offerExtraData =
      offerExtraDataList.find((data) => {
        return data.offer_id === offer.id;
      }) || {};
    const spot_id = offerExtraData?.spot_id;
    const spot_information = offerExtraData?.spot_information;

    return { ...offer, spot_id, spot_information };
  });
}
