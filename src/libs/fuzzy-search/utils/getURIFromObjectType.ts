import type { SearchObjectType } from '#src/libs/fuzzy-search/types';
import { API_URI, API_V1_URI } from '../../../http';

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
  franchise_user_private_pass: 'franchise_user_profile/private_consumer_pass',
  franchise_user_payment_pack: 'franchise_user_profile/consumer_payment_pack',
  shop_item: 'shop/item',
  shop_item_template: 'shop/shopitemtemplate',
  smart_list: 'smartlist/group',
  sub_shop: 'shop/subshop',
  sub_shop_template: 'shop/subshoptemplate',
  video: 'vod/video',
  tag: 'tagging/tag', // V0 API
  contract: 'subscription/contract', // V0 API
  associated_coach: 'associated_coach',
  establishment_group: 'establishment-group',
  custom_form: 'custom_form/custom_form',
};

const typeToV0URIMap: { [key in SearchObjectType]?: string } = {
  tag: 'tagging/tag',
  contract: 'subscription/contract',
};

/**
 * This is used to call the right search URL when using the fuzzy search API.
 * @param objectType The type of object to search for
 * @returns The URI to call for the search
 */

export const getSearchObjectURI = (
  objectType: SearchObjectType,
  objectId?: number,
): string => {
  if (objectType === 'franchise_user_private_pass') {
    return `${API_V1_URI}/private_service/franchise_user_profile/${objectId}/private_consumer_pass/search`;
  }
  if (objectType === 'franchise_user_payment_pack') {
    return `${API_V1_URI}/payment-pack/franchise_user_profile/${objectId}/consumer_payment_pack/search`;
  }
  if (objectType in typeToV0URIMap) {
    return `${API_URI}/${typeToV0URIMap[objectType]}/search`;
  }
  return `${API_V1_URI}/${typeToURIMap[objectType]}/search`;
};
