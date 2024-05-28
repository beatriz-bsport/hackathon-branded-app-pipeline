import type { Coach } from '#libs/associated-coach/types';
import type { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import type { Coupon } from '#libs/coupon/types';
import type { EmailTemplate } from '#libs/email-editor/types';
import type {
  Establishment,
  EstablishmentGroupAPI,
} from '#libs/establishment/types';
import type {
  ObjectSearchResult,
  SearchObjectType,
} from '#libs/fuzzy-search/types';
import type { Giftcard } from '#libs/giftcard/types';
import type { InstalmentPayment } from '#libs/instalment-payment-configuration/types';
import type { Level } from '#libs/level/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type {
  PaymentPack,
  PaymentPackCategory,
} from '#libs/payment-packs/types';
import type { PerformanceTrackingProgram } from '#libs/performance-tracking/types';
import type {
  PrivatePass,
  PrivatePassCategory,
  PrivateService,
  PrivateSlot,
} from '#libs/private-service/types';
import type { Cadence } from '#libs/sequential_marketing/types';
import type { ShopItem, SubShop } from '#libs/shop/types';
import type { SmartList } from '#libs/smart-list/types';
import type { Contract } from '#libs/subscription/types';
import type { Tag } from '#libs/tag/types';
import type { Video } from '#libs/video/types';
import type { CustomForm } from '#libs/custom-form/types';

const labelExtractorMap: Record<
  SearchObjectType,
  (item: ObjectSearchResult) => string
> = {
  coach_payment_rules: (coachPaymentRule: CoachPaymentRule) =>
    coachPaymentRule.name,
  coupon: (coupon: Coupon) => coupon.name,
  coupon_template: (coupon: Coupon) => coupon.name,
  custom_form: (customForm: CustomForm) => customForm.name,
  email_design: (emailDesign: EmailTemplate) => emailDesign.title,
  establishment: (establishment: Establishment) => establishment.title,
  giftcard: (giftcard: Giftcard) => giftcard.name,
  giftcard_template: (giftcard: Giftcard) => giftcard.name,
  meta_activity: (metaActivity: MetaActivity) => metaActivity.name,
  custom_level: (level: Level) => level.name,
  instalment_payment: (instalmentPayment: InstalmentPayment) =>
    instalmentPayment.name,
  payment_combo: (paymentCombo: PaymentCombo) => paymentCombo.name,
  payment_pack: (paymentPack: PaymentPack) => paymentPack.name,
  payment_pack_category: (category: PaymentPackCategory) => category.name,
  cadence: (cadence: Cadence) => cadence.name,
  contract: (contract: Contract) => contract.name,
  performance_tracking_program: (program: PerformanceTrackingProgram) =>
    program.name,
  private_pass: (privatePass: PrivatePass) => privatePass.name,
  private_pass_category: (category: PrivatePassCategory) => category.name,
  private_pass_template: (template: PrivatePass) => template.name,
  private_service: (privateService: PrivateService) => privateService.name,
  private_slot: (privateSlot: PrivateSlot) => privateSlot.name,
  shop_item: (shopItem: ShopItem) => shopItem.name,
  shop_item_template: (shopItem: ShopItem) => shopItem.name,
  smart_list: (smartList: SmartList) => smartList.name,
  sub_shop: (subShop: SubShop) => subShop.name,
  sub_shop_template: (subShop: SubShop) => subShop.name,
  tag: (tag: Tag) => tag.name,
  video: (video: Video) => video.name,
  associated_coach: (coach: Coach) => `${coach.firstname} ${coach.lastname}`,
  establishment_group: (group: EstablishmentGroupAPI) => group.name,
};

/**
 * Extracts the option label from an object search result.
 * This is the default label extractor, and can be overriden by using the
 * optionsFormatter prop in the ObjectSearch component.
 */

export const getLabelFromItem = ({
  item,
  searchedObjectType,
}: {
  item: ObjectSearchResult;
  searchedObjectType: SearchObjectType;
}) => {
  return labelExtractorMap[searchedObjectType](item);
};
