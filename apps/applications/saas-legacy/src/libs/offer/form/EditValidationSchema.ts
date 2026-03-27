import * as Yup from 'yup';

import { isDateTooFar } from '#src/libs/offer/utils';
import { PartnerSpotCappingStrategy } from '#src/libs/offer/types';

const OfferEditFormValidationSchema = Yup.object().shape({
  effectif: Yup.number()
    .typeError('offer:form.errors.required')
    .required('offer:form.errors.required')
    .min(0, 'offer:form.errors.minZero')
    .test({
      name: 'isGreaterThanBlueprintSpot',
      test: function isGreaterThanBlueprintSpot() {
        const isGreaterThanSpotCount =
          this.parent.effectif > this.parent.roomBlueprintSlots;
        if (
          typeof this.parent.roomBlueprintSlots === 'number' &&
          isGreaterThanSpotCount
        ) {
          return this.createError({
            message: 'offer:form.errors.field.effectif',
            path: this.path,
          });
        }
        return true;
      },
    }),
  waitingListMaxSize: Yup.number()
    .typeError('offer:form.errors.required')
    .min(0, 'offer:form.errors.minZero')
    .required('offer:form.errors.required'),
  level: Yup.number().when('isOfferInGroup', (isOfferInGroup, schema) => {
    if (isOfferInGroup) {
      return schema;
    }
    return schema
      .required('offer:form.errors.required')
      .positive('offer:form.errors.positiveNumber');
  }),
  establishment: Yup.number()
    .typeError('offer:form.errors.required')
    .required('offer:form.errors.required'),
  broadcastLink: Yup.string()
    .nullable()
    // KEEPING FOR REFERENCE
    //
    // .when(
    //   ['isMetaActivityBroadcast', 'isZoomAppEnabled'],
    //   (isMetaActivityBroadcast, isZoomAppEnabled, schema) => {
    //     if (isMetaActivityBroadcast && !isZoomAppEnabled) {
    //       return schema.required('offer:form.errors.required');
    //     }
    //     return schema;
    //   },
    // )
    .url('offer:form.errors.field.broadcastLink'),
  credits: Yup.number()
    .typeError('offer:form.errors.required')
    .required('offer:form.errors.required')
    .min(0, 'offer:form.errors.minZero'),
  dateIntervalStart: Yup.date()
    .typeError('offer.form.errors.dateFormat')
    .required('offer:form.errors.required')
    .test({
      name: 'isDateTooFar',
      test: function dateTooFar() {
        if (isDateTooFar(this.parent.dateIntervalStart.toISOString())) {
          return this.createError({
            message: 'offer:form.errors.dateTooFar',
            path: this.path,
          });
        }
        return true;
      },
    }),
  durationMinute: Yup.number()
    .required('offer:form.errors.required')
    .positive('offer:form.errors.field.durationMinute')
    .test({
      name: 'isSpiviCompatible',
      test: function isSpiviCompatible() {
        if (this.parent.syncOfferOnSpivi) {
          if (
            this.parent.durationMinute < 20 ||
            this.parent.durationMinute > 4 * 60
          ) {
            return this.createError({
              message: 'offer:form.errors.field.durationMinuteSpivi',
              path: this.path,
            });
          }
        }
        return true;
      },
    }),
  coach: Yup.number()
    .typeError('offer:form.errors.required')
    .required('offer:form.errors.required')
    .positive('offer:form.errors.positiveNumber'),
  partnerMaxBookingCount: Yup.number()
    .when('isShowPartnership', (isShowPartnership, schema) => {
      if (isShowPartnership) {
        return schema.required('offer:form.errors.required');
      }
      return schema;
    })
    .test({
      name: 'shouldBeLessThanEffectif',
      test: function lessThanEffectif() {
        if (
          this.parent.availableOnPartnership &&
          this.parent.partnerMaxBookingCount > this.parent.effectif &&
          this.parent.isShowPartnership
        ) {
          return this.createError({
            message: 'offer:form.errors.field.partnerMaxBookingCount',
            path: this.path,
          });
        }
        return true;
      },
    }),
  nameOverride: Yup.string().max(500),
  descriptionOverride: Yup.string(),
  wellhubProductId: Yup.number()
    .nullable()
    .typeError('offer:form.errors.required')
    .positive('offer:form.errors.positiveNumber')
    .test({
      name: 'mandatoryUnderCertainConditions',
      test: function mandatoryUnderCertainConditions() {
        if (
          this.parent.availableOnPartnership &&
          this.parent.isShowPartnership &&
          this.parent.establishment &&
          this.parent.isWellhubProductRequired &&
          !this.parent.wellhubProductId
        ) {
          return this.createError({
            message: 'offer:form.errors.field.wellhubProductMissing',
            path: this.path,
          });
        }
        return true;
      },
    }),
  partnershipOffers: Yup.array()
    .of(
      Yup.object().shape({
        spot_limit: Yup.number()
          .nullable()
          .typeError('offer:form.errors.required')
          .positive('offer:form.errors.positiveNumber'),
      }),
    )
    .test({
      name: 'partnershipOffersSpotLimits',
      test: function partnershipOffersSpotLimits(value: any) {
        const { partnerSpotCappingStrategy, effectif } = this.parent;
        if (
          partnerSpotCappingStrategy !== PartnerSpotCappingStrategy.PER_PARTNER
        ) {
          return true;
        }
        const offers: Array<{
          allowed_on_partner: boolean;
          spot_limit: number | null;
        }> = value ?? [];
        const innerErrors: Yup.ValidationError[] = [];
        offers.forEach((po, idx) => {
          if (!po.allowed_on_partner) return;
          if (po.spot_limit == null) {
            innerErrors.push(
              new Yup.ValidationError(
                'offer:form.errors.required',
                po.spot_limit,
                `${this.path}[${idx}].spot_limit`,
              ),
            );
          } else if (po.spot_limit > (effectif ?? 0)) {
            innerErrors.push(
              new Yup.ValidationError(
                'offer:form.errors.field.partnerSpotLimitExceedsEffectif',
                po.spot_limit,
                `${this.path}[${idx}].spot_limit`,
              ),
            );
          }
        });
        if (innerErrors.length === 0) return true;
        return new Yup.ValidationError(innerErrors as any, value, this.path);
      },
    }),
});

export default OfferEditFormValidationSchema;
