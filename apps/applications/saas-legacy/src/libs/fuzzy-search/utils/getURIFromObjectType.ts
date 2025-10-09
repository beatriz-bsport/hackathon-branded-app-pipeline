import type { SearchObjectType } from '#src/libs/fuzzy-search/types';

import Config from '../../../config';

const API_V1_URI_BOOK = Config.REACT_APP_BASE_URI_BOOK_V1;
const API_V1_URI_BUYABLE = Config.REACT_APP_BASE_URI_BUYABLE_V1;
const API_V0_URI_BUYABLE = Config.REACT_APP_BASE_URI_BUYABLE_V0;
const API_V0_URI_BUSINESS_INSIGHTS =
  Config.REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V0;
const API_V1_URI_FS = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;
const API_V1_URI_CDP = Config.REACT_APP_BASE_URI_CDP_V1;
const API_V0_URI_CDP = Config.REACT_APP_BASE_URI_CDP_V0;
const API_V1_URI_CORE = Config.REACT_APP_BASE_URI_CORE_V1;
const API_V1_URI_COMMUNICATE = Config.REACT_APP_BASE_URI_COMMUNICATE_V1;

const typeToURIMap: Record<SearchObjectType, Array<string>> = {
  coach_payment_rules: ['coach_payment_rules', API_V1_URI_FS],
  coupon: ['coupon', API_V1_URI_BUYABLE],
  coupon_template: ['coupon/coupon_template', API_V1_URI_BUYABLE],
  email_design: ['email_design', API_V1_URI_CDP],
  establishment: ['establishment', API_V1_URI_CORE],
  giftcard: ['giftcard/giftcard', API_V1_URI_BUYABLE],
  giftcard_template: ['giftcard/giftcard-template', API_V1_URI_BUYABLE],
  meta_activity: ['meta-activity', API_V1_URI_BOOK],
  custom_level: ['master-data/level', API_V1_URI_CORE],
  instalment_payment: ['payment/instalment-payment', API_V1_URI_FS],
  payment_combo: ['payment_combo', API_V1_URI_BUYABLE],
  payment_pack: ['payment-pack/payment-pack', API_V1_URI_BUYABLE],
  payment_pack_category: [
    'payment-pack/payment-pack-category',
    API_V1_URI_BUYABLE,
  ],
  cadence: ['sequential_marketing/cadence', API_V1_URI_CDP],
  performance_tracking_program: [
    'performance_tracking/program',
    API_V1_URI_CORE,
  ],
  private_service: ['private_service/private_service', API_V1_URI_BOOK],
  private_slot: ['private_service/private_slot', API_V1_URI_BOOK],
  private_pass: ['private_service/private_pass', API_V1_URI_BOOK],
  private_pass_category: [
    'private_service/private_pass_category',
    API_V1_URI_BOOK,
  ],
  private_pass_template: [
    'private_service/private-pass-template',
    API_V1_URI_BOOK,
  ],
  franchise_user_private_pass: [
    'franchise_user_profile/private_consumer_pass',
    API_V1_URI_BUYABLE,
  ],
  franchise_user_payment_pack: [
    'franchise_user_profile/consumer_payment_pack',
    API_V1_URI_BUYABLE,
  ],
  shop_item: ['shop/item', API_V1_URI_BUYABLE],
  shop_item_template: ['shop/shopitemtemplate', API_V1_URI_BUYABLE],
  smart_list: ['smartlist/group', API_V1_URI_CDP],
  sub_shop: ['shop/subshop', API_V1_URI_BUYABLE],
  sub_shop_template: ['shop/subshoptemplate', API_V1_URI_BUYABLE],
  video: ['vod/video', API_V1_URI_BUYABLE],
  tag: ['tagging/tag', API_V0_URI_CDP],
  contract: ['subscription/contract', API_V0_URI_BUYABLE],
  contract_template: ['subscription/contract-template', API_V0_URI_BUYABLE],
  associated_coach: ['associated_coach', API_V1_URI_CORE],
  establishment_group: ['establishment-group', API_V1_URI_CORE],
  custom_form: ['custom_form/custom_form', API_V1_URI_CDP],
  coach_payment_rule_groups: ['coach_payment_rule_group', API_V1_URI_FS],
  reportV2: ['reporting/reports-v2', API_V0_URI_BUSINESS_INSIGHTS],
  payment_pack_template: [
    'payment-pack/payment-pack-template',
    API_V1_URI_BUYABLE,
  ],
  universal_payment_pack_template: [
    'payment-pack/universal-pass-template',
    API_V1_URI_BUYABLE,
  ],
  communication_sent_group_config: [
    'communication/communication-sent-group-config',
    API_V1_URI_COMMUNICATE,
  ],
};

const typeToV0URIMap: { [key in SearchObjectType]?: Array<string> } = {
  tag: ['tagging/tag', API_V0_URI_CDP],
  contract: ['subscription/contract', API_V0_URI_BUYABLE],
  contract_template: ['subscription/contract-template', API_V0_URI_BUYABLE],
  reportV2: ['reporting/reports-v2', API_V0_URI_BUSINESS_INSIGHTS],
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
    return `${API_V1_URI_BOOK}/private_service/franchise_user_profile/${objectId}/private_consumer_pass/search/`;
  }
  if (objectType === 'franchise_user_payment_pack') {
    return `${API_V1_URI_BUYABLE}/payment-pack/franchise_user_profile/${objectId}/consumer_payment_pack/search/`;
  }
  if (objectType in typeToV0URIMap) {
    const [objectPath, uri] = typeToV0URIMap[objectType];
    return `${uri}/${objectPath}/search/`;
  }
  const [objectPath, uri] = typeToURIMap[objectType];
  return `${uri}/${objectPath}/search/`;
};
