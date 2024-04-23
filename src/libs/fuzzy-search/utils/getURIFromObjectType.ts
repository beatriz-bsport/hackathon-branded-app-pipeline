import { API_URI, API_V1_URI } from '../../../http';
import type { SearchObjectType } from '#libs/fuzzy-search/types';

const typeToURIMap: Record<SearchObjectType, string> = {
  coach_payment_rules: 'coach_payment_rules',
  coupon: 'coupon',
  coupon_template: 'coupon/coupon_template',
  email_design: 'email_design',
  establishment: 'establishment',
  giftcard: 'giftcard/giftcard',
  giftcard_template: 'giftcard/giftcard-template',
  meta_activity: 'meta-activity',
  custom_level: 'master-data/level',
  instalment_payment: 'payment/instalment-payment',
  payment_combo: 'payment_combo',
  payment_pack: 'payment-pack/payment-pack',
  payment_pack_category: 'payment-pack/payment-pack-category',
  cadence: 'sequential_marketing/cadence',
  performance_tracking_program: 'performance_tracking/program',
  private_service: 'private_service/private_service',
  private_slot: 'private_service/private_slot',
  private_pass: 'private_service/private_pass',
  private_pass_category: 'private_service/private_pass_category',
  private_pass_template: 'private_service/private-pass-template',
  shop_item: 'shop/item',
  shop_item_template: 'shop/shopitemtemplate',
  smart_list: 'smartlist/group',
  sub_shop: 'shop/subshop',
  sub_shop_template: 'shop/subshoptemplate',
  video: 'vod/video',
  tag: 'tagging/tag', // V0 API
  contract: 'subscription/contract', // V0 API
};

const typeToV0URIMap: { [key in SearchObjectType]?: string } = {
  tag: 'tagging/tag',
  contract: 'subscription/contract',
};

export const getSearchObjectURI = (objectType: SearchObjectType): string => {
  if (objectType in typeToV0URIMap) {
    return `${API_URI}/${typeToV0URIMap[objectType]}/search`;
  }
  return `${API_V1_URI}/${typeToURIMap[objectType]}/search`;
};
