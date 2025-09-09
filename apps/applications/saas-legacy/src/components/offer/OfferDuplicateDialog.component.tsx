import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { DateTime } from 'luxon';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import OfferFormDateTime from '#src/libs/offer/form/sections/OfferFormDateTime.component';
import OfferFormRecurrencePreview from '#src/libs/offer/form/OfferFormRecurrencePreview.dialog';
import { getLastOfferInRecurrence } from '#src/libs/offer/api';
import OfferDuplicateValidationSchema from './OfferDuplicateValidationSchema';

import { getOfferRecurrenceDates } from '#src/libs/offer/utils';
import { LuxonDateTime } from '#src/types';
import { OFFER_RECURRENCE } from '#src/libs/offer/constants';
import { Offer, OfferCreate } from '#src/libs/offer/types';
import { OptionBackgroundCallback } from '#src/state/types';
import { Coach, Establishment } from '#src/api/types';
import { Tag } from '#src/libs/tag/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';

type Props = {
  offer: Offer<Coach, Establishment, MetaActivity, number, Tag>;
  onClose: () => void;
  onDuplicate: () => void;
  open: boolean;
  customOnSubmit?: (values: FormValues) => Promise<void>;
  createOffers: (
    offer: OfferCreate,
    options?: OptionBackgroundCallback,
  ) => Promise<void>;
};

// Simplified form values containing only the fields used in OfferFormDateTime
type FormValues = {
  dateIntervalStart: DateTime;
  dateIntervalEnd: DateTime; // Made required since OfferFormDateTime expects it for recurrence calculations
  durationMinute: number;
  isRecurrence?: boolean;
  recurrence?:
    | OFFER_RECURRENCE.WEEKLY
    | OFFER_RECURRENCE.MONTHLY
    | OFFER_RECURRENCE.DAILY;
  recurrenceWeekDay?: {
    '1': boolean;
    '2': boolean;
    '3': boolean;
    '4': boolean;
    '5': boolean;
    '6': boolean;
    '7': boolean;
  };
  isOfferInGroup: boolean;
  calendarSelectedDate: string;
  linkNewOffers: boolean;
  isRecurrenceWeekDayDialogOpen?: boolean; // Required for preview functionality
};

// This is needed to ensure that the validation has the correct values.
// See https://github.com/jaredpalmer/formik/issues/2083#issuecomment-577890337
const FormikValidate = ({
  children,
}: {
  children: (props: { isValid: boolean }) => React.ReactNode;
}) => {
  const { values, validateForm, isValid } = useFormikContext();
  useEffect(() => {
    validateForm();
  }, [values, validateForm]);
  return <>{children({ isValid })}</>;
};

const OfferDuplicateDialog: React.FC<Props> = ({
  offer,
  onClose,
  onDuplicate,
  open,
  customOnSubmit,
  createOffers: dispatchCreateOffers,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOfferDate, setLastOfferDate] = useState<DateTime | null>(null);
  const [isAlreadyRecurring, setIsAlreadyRecurring] = useState(false);
  const { t } = useTranslation('offer');
  const mountedRef = useRef(true);
  const isHybrid = !!offer.linked_hybrid_offer_id;

  // Set mounted ref to false on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch the last offer in recurrence when component mounts or offer changes
  useEffect(() => {
    let isMounted = true;
    if (offer?.id && open) {
      getLastOfferInRecurrence(offer.id)
        .then((response) => {
          if (!isMounted) return;
          if (response.data?.last_offer?.date_start) {
            const lastDate = DateTime.fromISO(
              response.data.last_offer.date_start,
            ).setZone(offer.timezone_name);
            setLastOfferDate(lastDate);
            setIsAlreadyRecurring(response.data.recurrence_count > 1);
          }
        })
        .catch((error) => {
          if (!isMounted) return;
          console.error('Error fetching last offer in recurrence:', error);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [offer?.id, offer?.date_start, offer?.timezone_name, open]);

  // Memoize validation schema to recreate it when lastOfferDate changes
  const validationSchema = React.useMemo(() => {
    return OfferDuplicateValidationSchema(
      lastOfferDate || undefined,
      offer.sync_on_spivi,
    );
  }, [lastOfferDate, offer.sync_on_spivi]);

  const initialValues: FormValues = React.useMemo(() => {
    // Use the last offer date + 1 day if available, otherwise fallback to current offer date or now
    const lastDateWithOffer =
      lastOfferDate ||
      (offer.date_start
        ? DateTime.fromISO(offer.date_start).setZone(offer.timezone_name)
        : DateTime.now().setZone(offer.timezone_name));
    const startDate = lastDateWithOffer.plus({ days: 1 });

    // Get the weekday for recurrence (1=Monday, 7=Sunday in ISO format)
    const recurrenceIsoWeekDay = startDate.weekday;

    return {
      dateIntervalStart: startDate,
      dateIntervalEnd: startDate.plus({ days: 1 }), // Set end date one day after start
      durationMinute: offer.duration_minute || 60,
      isRecurrence: false,
      recurrence: undefined,
      recurrenceWeekDay: {
        '1': recurrenceIsoWeekDay === 1,
        '2': recurrenceIsoWeekDay === 2,
        '3': recurrenceIsoWeekDay === 3,
        '4': recurrenceIsoWeekDay === 4,
        '5': recurrenceIsoWeekDay === 5,
        '6': recurrenceIsoWeekDay === 6,
        '7': recurrenceIsoWeekDay === 7,
      },
      isOfferInGroup: Boolean(offer.group),
      isRecurrenceWeekDayDialogOpen: false, // Initialize preview dialog as closed
      calendarSelectedDate: startDate.toISO() || DateTime.now().toISO(),
      linkNewOffers: isAlreadyRecurring,
    };
  }, [
    isAlreadyRecurring,
    lastOfferDate,
    offer.group,
    offer.date_start,
    offer.duration_minute,
    offer.timezone_name,
  ]);

  const handleSubmit = async (values: FormValues) => {
    // If a custom submit handler is provided, use that instead
    if (customOnSubmit) {
      await customOnSubmit(values);
      return;
    }

    setIsSubmitting(true);

    // Close the dialog immediately when submit is clicked
    onClose();

    try {
      // Convert form dates to timestamps for the API
      const dates = values.isRecurrence
        ? getOfferRecurrenceDates(
            {
              recurrence: values.recurrence,
              recurrenceWeekDay: values.recurrenceWeekDay,
              dateIntervalStart: values.dateIntervalStart,
              dateIntervalEnd: values.dateIntervalEnd,
            },
            offer.timezone_name,
          ).map((d: LuxonDateTime) => d.toUnixInteger())
        : [values.dateIntervalStart.toUnixInteger()];

      // Use original offer data for most fields, only override with form values for date/time
      const duplicateData: OfferCreate = {
        ...offer,
        blacklist_tags: offer.blacklist_tags.map(({ id }) => id),
        whitelist_tags: offer.whitelist_tags.map(({ id }) => id),
        dates: dates,
        credits: offer.credit_price,
        is_hybrid: isHybrid,
        coach_payment_rule: offer.coach_payment_rule_id,
        coach: offer.coach.id,
        establishment: offer.establishment.id,
        meta_activity: offer.meta_activity.id,
        recurrence_id: values.linkNewOffers ? offer.recurrence_id : undefined,
        level: offer.custom_level,
      };

      // Use Redux action which handles background tasks and snackbars automatically
      await dispatchCreateOffers(duplicateData, {
        onSuccess: () => {
          onDuplicate();
        },
      });
    } catch (error) {
      console.error('Error duplicating offer:', error);
      // Error handling is now done by the Redux action with snackbars
    } finally {
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <GenericResponsiveDialog maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>
        {t('offer:form.recurrence.duplicateModalTitle')}
      </DialogTitle>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormikValidate>
          {({ isValid }) => (
            <>
              <Form>
                <DialogContent>
                  <Alert
                    severity="info"
                    style={{ marginBottom: 16 }}
                    variant="outlined"
                  >
                    {isHybrid
                      ? t('offer:form.recurrence.hybridOffer')
                      : isAlreadyRecurring && lastOfferDate
                      ? t('offer:form.recurrence.recurringOffer', {
                          date: lastOfferDate.toLocaleString(
                            DateTime.DATE_FULL,
                          ),
                          time: lastOfferDate.toLocaleString(
                            DateTime.TIME_SIMPLE,
                          ),
                        })
                      : t('offer:form.recurrence.regularOffer')}
                  </Alert>
                  <OfferFormDateTime timezone={offer.timezone_name} />
                  <div style={{ marginTop: 8 }}>
                    <SwitchField
                      id="offer-form-recurrence-switch"
                      label={t('offer:form.recurrence.linkNewOffersLabel')}
                      name="linkNewOffers"
                      switchColor="secondary"
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button color="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    disabled={!isValid || isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    {isSubmitting
                      ? t('offer:form.recurrence.duplicating')
                      : t('offer:form.recurrence.duplicate')}
                  </Button>
                </DialogActions>
                {/* Add the preview dialog inside our main dialog to avoid z-index conflicts */}
                <OfferFormRecurrencePreview timezone={offer.timezone_name} />
              </Form>
            </>
          )}
        </FormikValidate>
      </Formik>
    </GenericResponsiveDialog>
  );
};

export default OfferDuplicateDialog;
