import * as Yup from 'yup';

import { isDateTooFar } from '#libs/offer/utils';

const OfferEditFormValidationSchema = Yup.object().shape({
  effectif: Yup.number()
    .typeError('offer:form.errors.required')
    .required('offer:form.errors.required')
    .min(2, 'offer:form.errors.minTwo')
    .test({
      name: 'isGreaterThanBlueprintSpot',
      test: function isGreaterThanBlueprintSpot() {
        const isGreaterThanSpotCount =
          this.parent.roomBlueprintSlots &&
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
    .when(
      ['isMetaActivityBroadcast', 'isZoomAppEnabled'],
      (isMetaActivityBroadcast, isZoomAppEnabled, schema) => {
        if (isMetaActivityBroadcast && !isZoomAppEnabled) {
          return schema.required('offer:form.errors.required');
        }
        return schema;
      },
    )
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
    .positive('offer:form.errors.field.durationMinute'),
  coach: Yup.number()
    .typeError('offer:form.errors.required')
    .required('offer:form.errors.required')
    .positive('offer:form.errors.positiveNumber'),
});

export default OfferEditFormValidationSchema;
