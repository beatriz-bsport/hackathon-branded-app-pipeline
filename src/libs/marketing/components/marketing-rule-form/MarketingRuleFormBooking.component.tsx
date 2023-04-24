// @ts-nocheck
import React, { useMemo } from 'react';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';

import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Divider } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

import {
  IntegerField,
  RadioGroupField,
  CheckboxField,
  Submit,
} from '#components/forms';
import { ResolvedGenericTags } from '#libs/email-editor/types';
import MarketingRuleBasicTypeField from '../MarketingRuleBasicTypeField.component';

import MarketingRuleSendingMethodField from '../MarketingRuleSendingMethodField.component';
import MarketingRuleSmartlistField from '../MarketingRuleSmartlistField.component';
import MarketingRuleFormStateField from '../MarketingRuleStateField.component';
import { getSendingTimeNotification } from '#libs/marketing/utils';

const BOOKING_CREATION_NOTIFICATION = 2;

const BOOKING_NOTIFICATION_VALID_ATTENDANCE = 3;
const BOOKING_NOTIFICATION_VALID_ABSENCE = 4;
const BOOKING_NOTIFICATION_CANCELLED_REFUNDED = 5;
const BOOKING_NOTIFICATION_CANCELLED_NOT_REFUNDED = 6;

type Props = {
  isSubmitting: boolean;

  onCancel: () => void;
  onSubmitIntent: () => void;
  emails: Array<any>;
  getEmailDetail: (id: number) => void;
  emailDetails: Array<any>;
  emailListLoading: boolean;
  emailDetailLoading: boolean;
  values: any;
  setFieldValue: (key: string, value: any) => void;
  errors: any;
  tags: { [tag_name: string]: string[] };
  smartLists: Array<any>;
  goToSmartlist: () => void;
  resolvedGenericTags: ResolvedGenericTags;
  identifier:
    | 'meta_activity'
    | 'establishment'
    | 'establishment_group'
    | 'workshop';
};

const getNotificationKind = (kind: number) => {
  switch (parseInt(kind, 10)) {
    case BOOKING_NOTIFICATION_VALID_ATTENDANCE:
      return 'attendance';
    case BOOKING_NOTIFICATION_VALID_ABSENCE:
      return 'absence';
    case BOOKING_NOTIFICATION_CANCELLED_REFUNDED:
      return 'refunded';
    default:
      return 'notRefunded';
  }
};

const MarketingRuleFormBooking = (props: Props) => {
  const {
    isSubmitting,
    onCancel,
    onSubmitIntent,
    emails,
    getEmailDetail,
    emailDetails,
    emailListLoading,
    emailDetailLoading,
    values,
    setFieldValue,
    errors,
    tags,
    resolvedGenericTags,
    smartLists,
    identifier,
    goToSmartlist,
  } = props;
  const { t } = useTranslation(['booking', 'paymentPack', 'subscription']);
  const classes = useStyles();
  const {
    eventKind,
    notify_booking_nb,
    email_design,
    eventType,
    send_email,
    send_notification_push,
    notificationContent,
    notificationTitle,
    smartlist_exclude,
    smartlist_include,
    periodScale,
    relativeTimeValue,
    timeComparator,
  } = values;

  // To avoid validation errors. If notifyAllEvents is true,
  // then notify_booking_nb will be set to 0 during submission
  if (values.notifyAllEvents && notify_booking_nb !== 1) {
    setFieldValue('notify_booking_nb', 1);
  }

  // Update kind when eventType changes so that we always have a checked
  // radio input on the screen
  if (
    eventType === 'cancelled' &&
    [
      BOOKING_NOTIFICATION_VALID_ATTENDANCE,
      BOOKING_NOTIFICATION_VALID_ABSENCE,
    ].includes(parseInt(eventKind, 10))
  ) {
    setFieldValue('eventKind', BOOKING_NOTIFICATION_CANCELLED_REFUNDED);
  }
  if (
    eventType === 'valid' &&
    [
      BOOKING_NOTIFICATION_CANCELLED_REFUNDED,
      BOOKING_NOTIFICATION_CANCELLED_NOT_REFUNDED,
    ].includes(parseInt(eventKind, 10))
  ) {
    setFieldValue('eventKind', BOOKING_NOTIFICATION_VALID_ATTENDANCE);
  }

  const eventTypeChoices: {
    label: string;
    value: 'valid' | 'cancelled';
  }[] = useMemo(
    () => [
      {
        label: t('booking:notification.form.chooseStatus.valid'),
        value: 'valid',
      },
      {
        label: t('booking:notification.form.chooseStatus.cancelled'),
        value: 'cancelled',
      },
    ],
    [t],
  );

  return (
    <GenericResponsiveDrawer
      open
      onClose={onCancel}
      title={t('booking:notification.form.title')}
      subtitle={t(`notificationRule:tag.Booking.subtitles.${identifier}`)}
      mobileMinWidth="0px"
    >
      <Form>
        <div className={classes.warningTitleContainer}>
          <div className={classes.infoIcon}>
            <InfoOutlinedIcon color="inherit" />
          </div>
          <Typography variant="body2" className={classes.breakSpaces}>
            {t('notification.form.explain')}
          </Typography>
        </div>
        <>
          <MarketingRuleFormStateField choices={eventTypeChoices} />
          <div className={classes.fieldContainer}>
            <Divider className={classes.divider} />
            <div className={classes.fieldContainer}>
              <div className={classes.titleContainer}>
                <EventIcon color="action" />
                <Typography variant="h6">
                  {t('notificationRule:triggeringEvent.title')}
                </Typography>
              </div>
              {eventType === 'valid' && (
                <div className={classes.choiceField}>
                  <RadioGroupField
                    name="eventKind"
                    choices={[
                      {
                        label: t(
                          'booking:notification.form.chooseKind.attendance',
                        ),
                        value: BOOKING_NOTIFICATION_VALID_ATTENDANCE,
                      },
                      {
                        label: t(
                          'booking:notification.form.chooseKind.absence',
                        ),
                        value: BOOKING_NOTIFICATION_VALID_ABSENCE,
                      },
                    ]}
                  />
                </div>
              )}
              {eventType === 'cancelled' && (
                <div className={classes.choiceField}>
                  <RadioGroupField
                    name="eventKind"
                    choices={[
                      {
                        label: t(
                          'booking:notification.form.chooseKind.refunded',
                        ),
                        value: BOOKING_NOTIFICATION_CANCELLED_REFUNDED,
                      },
                      {
                        label: t(
                          'booking:notification.form.chooseKind.notRefunded',
                        ),
                        value: BOOKING_NOTIFICATION_CANCELLED_NOT_REFUNDED,
                      },
                    ]}
                  />
                </div>
              )}
            </div>
            <div
              className={`${classes.inlineContainer} ${
                classes.fieldContainer
              } ${values.notifyAllEvents ? classes.greyText : ''}`}
            >
              <Typography variant="body2">
                {t('booking:notification.form.eventNb')}
              </Typography>
              <IntegerField
                className={classes.integerInput}
                name="notify_booking_nb"
                disabled={values.notifyAllEvents}
              />
            </div>
            <div className={classes.choiceField}>
              <CheckboxField
                classes={{ label: classes.label }}
                name="notifyAllEvents"
                label={t('booking:notification.form.notifyAllEvents')}
              />
            </div>
            <div className={classes.helperText}>
              <Typography variant="caption" className={classes.greyText}>
                {values.notifyAllEvents
                  ? t(
                      `booking:notification.form.help.allEvents.${getNotificationKind(
                        eventKind,
                      )}`,
                    )
                  : `${t('booking:notification.form.help.text')} ${t(
                      `booking:notification.form.help.${getNotificationKind(
                        eventKind,
                      )}`,
                      { notify_booking_nb },
                    )}`}
              </Typography>
            </div>
          </div>
          <MarketingRuleBasicTypeField
            periodScale={periodScale}
            relativeTimeValue={relativeTimeValue}
            timeComparator={timeComparator}
            setFieldValue={setFieldValue}
          />
          <MarketingRuleSmartlistField
            goToSmartList={goToSmartlist}
            smartLists={smartLists}
            smartlist_include={smartlist_include}
            smartlist_exclude={smartlist_exclude}
          />
          <MarketingRuleSendingMethodField
            send_email={send_email}
            send_notification_push={send_notification_push}
            notificationTitle={notificationTitle}
            notificationContent={notificationContent}
            errors={errors}
            emailListLoading={emailListLoading}
            emails={emails}
            email_design={email_design}
            getEmailDetail={getEmailDetail}
            emailDetailLoading={emailDetailLoading}
            emailDetails={emailDetails}
            setFieldValue={setFieldValue}
            tags={tags}
            resolvedGenericTags={resolvedGenericTags}
          />

          <DialogActions>
            <Button onClick={onCancel} disabled={isSubmitting}>
              {t('booking:notification.form.cancel')}
            </Button>
            <Submit
              onClick={onSubmitIntent}
              color="primary"
              disabled={
                (!values.email_design && values.send_email) ||
                !!errors.hours ||
                !!errors.email_design ||
                !!errors.notificationTitle ||
                !!errors.notificationContent ||
                !!errors.notify_booking_nb ||
                !!errors.atLeastOneChannel
              }
            >
              {t('booking:notification.form.submit')}
            </Submit>
          </DialogActions>
        </>
      </Form>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
  choiceField: {
    marginLeft: theme.spacing(1.5),
    marginTop: theme.spacing(1.75),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },

  fieldContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  inlineContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  greyText: {
    color: 'grey',
  },
  helperText: {
    paddingTop: theme.spacing(2),
  },
  integerInput: {
    width: '70px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  label: {
    fontSize: '0.9rem',
  },
  infoIcon: {
    color: theme.palette.info.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakSpaces: {
    whiteSpace: 'break-spaces',
  },
  warningTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    gap: theme.spacing(2),
  },
}));

const BookingNotificationSchema = Yup.object().shape({
  marketingKind: Yup.number().required(),
  establishment_id: Yup.number().nullable(),
  establishment_group_id: Yup.number().nullable(),
  meta_activity_id: Yup.number().nullable(),
  notify_booking_nb: Yup.number().integer().min(1).required(),
  hours: Yup.number().integer().min(0),
  days: Yup.number().integer().min(0),
  eventKind: Yup.number(),

  atLeastOneChannel: Yup.boolean().when(
    ['send_notification_push', 'send_email'],
    {
      is: (push, email) => push || email,
      then: Yup.boolean().nullable(),
      otherwise: Yup.boolean().required(),
    },
  ),
  notificationContent: Yup.string().when('send_notification_push', {
    is: (value) => value,
    then: Yup.string().required(),
    otherwise: Yup.string().nullable(),
  }),
  email_design: Yup.number().when('send_email', {
    is: (value) => !!value,
    then: Yup.number().required(),
    otherwise: Yup.number().nullable(),
  }),
  smartlist_include: Yup.array().of(Yup.number()),
  smartlist_exclude: Yup.array().of(Yup.number()),
});

export default compose(
  withFormik({
    mapPropsToValues: ({ initial, objectId, identifier }) => {
      if (initial) {
        const {
          kind: marketingKind,
          email_design,
          push_notification_title,
          push_notification_content,
        } = initial;
        const {
          kind: eventKind,
          establishment_id,
          establishment_group_id,
          meta_activity_id,
          notify_booking_nb,
          hours,
          days,
          smartlist_include,
          smartlist_exclude,
        } = initial.event_rules;

        const eventType = [
          BOOKING_NOTIFICATION_VALID_ATTENDANCE,
          BOOKING_NOTIFICATION_VALID_ABSENCE,
        ].includes(eventKind)
          ? 'valid'
          : 'cancelled';

        return {
          send_email: !!email_design,
          send_notification_push:
            push_notification_title !== '' || push_notification_content !== '',
          notificationContent: push_notification_content,
          notificationTitle: push_notification_title,
          marketingKind,
          email_design,
          establishment_id,
          establishment_group_id,
          meta_activity_id,
          notify_booking_nb,

          periodScale: hours ? 'hours' : 'days',
          relativeTimeValue: hours ? Math.abs(hours) : Math.abs(days) || 0,
          timeComparator: hours > 0 || days > 0 ? 'after' : 'before',
          eventType,
          eventKind,
          notifyAllEvents: notify_booking_nb === 0,
          smartlist_include: smartlist_include || [],
          smartlist_exclude: smartlist_exclude || [],
        };
      }
      const values = {
        send_email: true,
        send_notification_push: false,
        notificationContent: '',
        notificationTitle: '',
        marketingKind: BOOKING_CREATION_NOTIFICATION,
        email_design: null,
        notifyAllEvents: false,
        notify_booking_nb: 1,
        eventKind: BOOKING_NOTIFICATION_VALID_ATTENDANCE,
        eventType: 'valid',
        smartlist_include: [],
        smartlist_exclude: [],
        periodScale: 'hours',
        relativeTimeValue: 2,
        timeComparator: 'before',
      };
      if (identifier === 'establishment') {
        values.establishment_id = objectId;
        values.meta_activity_id = null;
        values.establishment_group_id = null;
      } else if (identifier === 'meta_activity') {
        values.establishment_id = null;
        values.meta_activity_id = objectId;
        values.establishment_group_id = null;
      } else if (identifier === 'workshop') {
        values.establishment_id = null;
        values.meta_activity_id = objectId;
        values.establishment_group_id = null;
      } else if (identifier === 'establishment_group') {
        values.establishment_id = null;
        values.meta_activity_id = null;
        values.establishment_group_id = objectId;
      }
      return values;
    },
    validationSchema: BookingNotificationSchema,
    handleSubmit: (values, { props: { onSubmit } }) => {
      const [daysSubmit, hoursSubmit] = getSendingTimeNotification(
        values.timeComparator,
        values.periodScale,
        values.relativeTimeValue,
      );

      const data = {
        kind: values.marketingKind,
        email_design: values.send_email ? values.email_design : null,
        push_notification_title: values.send_notification_push
          ? values.notificationTitle
          : '',
        push_notification_content: values.send_notification_push
          ? values.notificationContent
          : '',
        event_rules: {
          establishment_id: values.establishment_id,
          meta_activity_id: values.meta_activity_id,
          establishment_group_id: values.establishment_group_id,
          notify_booking_nb: values.notifyAllEvents
            ? 0
            : values.notify_booking_nb,
          kind: parseInt(values.eventKind, 10),
          hours: hoursSubmit,
          days: daysSubmit,
          smartlist_include: values.smartlist_include,
          smartlist_exclude: values.smartlist_exclude,
        },
      };
      onSubmit(data);
    },
  }),
)(MarketingRuleFormBooking);
