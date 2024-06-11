import type { RootState } from '#src/reducers';

import memoize from 'memoize-one';

export const getDynamicDataLoading = memoize((state: RootState) => ({
  activity: state.metaActivity.loading,
  payment_pack: state.paymentPack.loading,
  coach: state.coach.loading,
  establishment: state.establishment.loading,
  user: state.member.loading,
  email: state.member.loading,
  billing_group: state.establishment.establishmentBillingGroup.loading,
  billing_establishment: state.establishment.loading,
  private_service: state.privateService.privateService.loading,
  private_slot: state.privateService.privateSlot.loading,
  private_pass: state.privateService.privatePass.loading,
  giftcard: state.giftcard.giftcard.loading,
  coupon: state.coupon.coupon.loading,
  video: state.video.loading,
  contract: state.subscription.contract.loading,
  subshop: state.shop.loading,
  company: state.franchise.loading,
}));

export const getDynamicDataHasBeenLoaded = (state: RootState) => {
  return state.datatypeFiltering.dynamicDataHasBeenLoaded;
};
