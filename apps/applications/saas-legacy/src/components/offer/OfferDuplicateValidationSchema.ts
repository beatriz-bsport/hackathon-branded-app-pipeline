import * as Yup from 'yup';
import { DateTime } from 'luxon';
import { LuxonDateTime } from '#src/types';
import { isDateTooFar } from '#src/libs/offer/utils';
import { OFFER_RECURRENCE } from '#src/libs/offer/constants';

const OfferDuplicateValidationSchema = (
  lastOfferDate?: LuxonDateTime,
  syncOfferOnSpivi?: boolean,
) =>
  Yup.object().shape({
    dateIntervalStart: Yup.date()
      .required('offer:form.errors.required')
      .typeError('offer:form.errors.dateFormat')
      .test(
        'isDateTooFar',
        'offer:form.errors.dateTooFar',
        function dateTooFar(this, value?: Date | null) {
          if (!value) return true;
          if (isDateTooFar(value.toISOString())) {
            return this.createError({
              message: 'offer:form.errors.dateTooFar',
              path: this.path,
            });
          }
          return true;
        },
      )
      .test(
        'notBeforeLastOffer',
        'offer:form.errors.field.dateIntervalStartBeforeLast',
        function (value?: Date | null) {
          if (!value || !lastOfferDate) return true;

          const inputDate = DateTime.fromJSDate(value);
          return inputDate.toMillis() >= lastOfferDate.toMillis();
        },
      ),

    dateIntervalEnd: Yup.date()
      .typeError('offer:form.errors.dateFormat')
      .when('isRecurrence', (isRecurrence, schema) => {
        if (isRecurrence) {
          return schema.required('offer:form.errors.required');
        }
        return schema;
      })
      .test(
        'isInvalidEndDate',
        'offer:form.errors.field.dateIntervalEnd',
        function invalidEndDate(this, value?: Date | null) {
          const { isRecurrence, dateIntervalStart } = this.parent;
          const dateStart = dateIntervalStart
            ? DateTime.fromJSDate(dateIntervalStart)
            : null;
          const dateEnd = value ? DateTime.fromJSDate(value) : null;
          const isInvalidDateEnd =
            isRecurrence &&
            dateStart &&
            dateEnd &&
            dateStart.startOf('day') >= dateEnd.endOf('day');

          if (isInvalidDateEnd) {
            return this.createError({
              message: 'offer:form.errors.field.dateIntervalEnd',
              path: this.path,
            });
          }
          return true;
        },
      )
      .test(
        'isDateTooFar',
        'offer:form.errors.dateTooFar',
        function dateTooFar(this, value?: Date | null) {
          if (!value) return true;
          if (isDateTooFar(value.toISOString())) {
            return this.createError({
              message: 'offer:form.errors.dateTooFar',
              path: this.path,
            });
          }
          return true;
        },
      ),
    durationMinute: Yup.number()
      .required('offer:form.errors.required')
      .positive('offer:form.errors.field.durationMinute')
      .test({
        name: 'isSpiviCompatible',
        test: function isSpiviCompatible() {
          if (syncOfferOnSpivi) {
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
  });

export default OfferDuplicateValidationSchema;
