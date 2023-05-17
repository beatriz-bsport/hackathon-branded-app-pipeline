import * as Yup from 'yup';
import moment from 'moment-timezone';

import { isDateTooFar } from '#libs/offer/utils';
import { OFFER_RECURRENCE } from '#libs/offer/constants';

const OfferFormCreateValidationSchema = Yup.object().shape({
  effectif: Yup.number()
    .typeError('offer:form.errors.required')
    .required('offer:form.errors.required')
    .min(0, 'offer:form.errors.minZero')
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
  level: Yup.number()
    .required('offer:form.errors.required')
    .positive('offer:form.errors.positiveNumber'),
  establishment: Yup.number()
    .typeError('offer:form.errors.required')
    .required('offer:form.errors.required'),
  broadcastLink: Yup.string()
    // KEEPING FOR REFERENCE
    //
    // .when(
    //   ['isMetaActivityBroadcast', 'isZoomAppEnabled'],
    //   (isMetaActivityBroadcast, isZoomAppEnabled, schema) => {
    //     if (isMetaActivityBroadcast && !isZoomAppEnabled) {
    //       return schema.required(OFFER_BROADCAST_LINK_MISSING);
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
  isRecurrence: Yup.boolean(),
  dateIntervalEnd: Yup.date()
    .typeError('offer.form.errors.dateFormat')
    .when('isRecurrence', (isRecurrence, schema) => {
      if (isRecurrence) {
        return schema.required('offer:form.errors.required');
      }
      return schema;
    })
    .test({
      name: 'isInvalidEndDate',
      test: function invalidEndDate() {
        const dateStart = moment(this.parent.dateIntervalStart);
        const dateEnd = moment(this.parent.dateIntervalEnd);
        const isInvalidDateEnd =
          this.parent.isRecurrence &&
          dateStart
            .clone()
            .startOf('day')
            .isSameOrAfter(dateEnd.startOf('day'));

        if (isInvalidDateEnd) {
          return this.createError({
            message: 'offer:form.errors.field.dateIntervalEnd',
            path: this.path,
          });
        }
        if (isDateTooFar(this.parent.dateIntervalEnd)) {
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
  recurrence: Yup.string().when('isRecurrence', (isRecurrence, schema) => {
    if (isRecurrence) {
      return schema.oneOf(
        [
          OFFER_RECURRENCE.DAILY,
          OFFER_RECURRENCE.WEEKLY,
          OFFER_RECURRENCE.MONTHLY,
        ],
        'offer:form.errors.required',
      );
    }
    return schema;
  }),
  recurrenceWeekDay: Yup.object().shape({
    '1': Yup.boolean().required('offer:form.errors.required'),
    '2': Yup.boolean().required('offer:form.errors.required'),
    '3': Yup.boolean().required('offer:form.errors.required'),
    '4': Yup.boolean().required('offer:form.errors.required'),
    '5': Yup.boolean().required('offer:form.errors.required'),
    '6': Yup.boolean().required('offer:form.errors.required'),
    '7': Yup.boolean().required('offer:form.errors.required'),
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
});

export default OfferFormCreateValidationSchema;
