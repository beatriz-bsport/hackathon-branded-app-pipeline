import * as Yup from 'yup';

import { isDateTooFar } from '#libs/offer/utils';

const OfferEditFormValidationSchema = Yup.object().shape({
  effectif: Yup.number()
    .typeError('offer:form.errors.required')
    .required('offer:form.errors.required')
    .min(0, 'offer:form.errors.minZero')
    .test({
      name: 'isGreaterThanBlueprintSpot',
      test: function isGreaterThanBlueprintSpot() {
        const isGreaterThanSpotCount =
          typeof this.parent.roomBlueprintSlots === 'number' &&
          this.parent.effectif > this.parent.roomBlueprintSlots;
        if (isGreaterThanSpotCount) {
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
        if (isDateTooFar(this.parent.dateIntervalStart)) {
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
  additionalCoaches: Yup.array<number>()
    .typeError('offer:form.errors.required')
    .test({
      name: 'canBeSetIfMainCoachSet',
      test: function canBeSetIfMainCoachSet(item: number[]) {
        return !!this.parent.coach && !item?.includes(this.parent.coach);
      },
    }),
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
});

export default OfferEditFormValidationSchema;
