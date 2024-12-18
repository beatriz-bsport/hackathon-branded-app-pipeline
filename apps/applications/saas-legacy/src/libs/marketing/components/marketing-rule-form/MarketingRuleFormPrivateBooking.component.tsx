import React, { useEffect, useMemo } from 'react';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import { compose } from 'recompose';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Divider from '@material-ui/core/Divider';
import EventIcon from '@material-ui/icons/Event';
import { PRIVATEBOOKING_EVENT_RULES } from '@bsport/common/lib/master-data/notification-rule-events.js';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';

// @ts-expect-error
import { IntegerField, CheckboxField, Submit } from '#src/components/forms';
import { SmartList } from '#src/libs/smart-list/types';
import { ResolvedGenericTags } from '#src/libs/email-editor/types';
import { getSendingTimeNotification } from '#src/libs/marketing/utils';
import MarketingRuleBasicTypeField from '../MarketingRuleBasicTypeField.component';

import MarketingRuleSendingMethodField from '../MarketingRuleSendingMethodField.component';
import MarketingRuleSmartlistField from '../MarketingRuleSmartlistField.component';
import MarketingRuleFormStateField from '../MarketingRuleStateField.component';

const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1;

const PRIVATE_BOOKING_NOTIFICATION_KIND_VALID = 0;
const PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_REFUNDED = 1;

type Props = {
  isSubmitting: boolean;
  emails: Array<any>;
  getEmails: () => void;
  getEmailDetail: (id: number) => void;
  emailDetails: Array<any>;
  emailListLoading: boolean;
  emailDetailLoading: boolean;

  onCancel: () => void;
  onSubmitIntent: () => void;
  initial: any;
  values: any;
  setFieldValue: (key: string, value: any) => void;
  errors: any;
  smartLists: Array<SmartList>;
  getSmartLists: () => void;
  goToSmartlist: () => void;
  tags: { [tag_name: string]: string[] };
  resolvedGenericTags: ResolvedGenericTags;
};

const getNotificationKind = (kind: number) => {
  // @ts-expect-error
  switch (parseInt(kind, 10)) {
    case PRIVATE_BOOKING_NOTIFICATION_KIND_VALID:
      return 'valid';
    case PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_REFUNDED:
      return 'cancelledRefunded';
    default:
      return 'cancelledNotRefunded';
  }
};

const MarketingRuleFormPrivateBooking = (props: Props) => {
  const {
    isSubmitting,
    emails,
    getEmails,
    getEmailDetail,
    emailDetails,
    emailListLoading,
    emailDetailLoading,
    onCancel,
    onSubmitIntent,
    initial,
    values,
    setFieldValue,
    errors,
    tags,
    resolvedGenericTags,
    smartLists,
    getSmartLists,
    goToSmartlist,
  } = props;

  const { t } = useTranslation([
    'paymentPack',
    'privateService',
    'notificationRule',
  ]);
  const {
    kind,
    notify_booking_nb,
    email_design,
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
  const classes = useStyles();

  // To avoid validation errors. If notifyAllEvents is true,
  // then notify_booking_nb will be set to 0 during submission
  if (values.notifyAllEvents && values.notify_booking_nb !== 1) {
    setFieldValue('notify_booking_nb', 1);
  }

  useEffect(() => {
    if (initial) getEmailDetail(initial.email_design);
    getEmails();
    getSmartLists();
  }, [initial, getEmailDetail, getEmails, getSmartLists]);

  const eventTypeChoices: { label: string; value: number }[] = useMemo(
    () => [
      {
        label: t(
          'privateService:privateBookingNotification.form.chooseKind.valid',
        ),
        value: PRIVATEBOOKING_EVENT_RULES.VALID,
      },
      {
        label: t(
          'privateService:privateBookingNotification.form.chooseKind.cancelledRefunded',
        ),
        value: PRIVATEBOOKING_EVENT_RULES.CANCELLED_REFUNDED,
      },
      {
        label: t(
          'privateService:privateBookingNotification.form.chooseKind.cancelledNotRefunded',
        ),
        value: PRIVATEBOOKING_EVENT_RULES.CANCELLED_NOT_REFUNDED,
      },
    ],
    [t],
  );

  return (
    <GenericResponsiveDrawer
      open
      onClose={onCancel}
      subtitle={t('notificationRule:tag.PrivateBooking.name')}
      title={t('privateService:privateBookingNotification.form.title')}
    >
      <Form>
        <div className={classes.warningTitleContainer}>
          <div className={classes.infoIcon}>
            <InfoOutlinedIcon color="inherit" />
          </div>
          <Typography className={classes.breakSpaces} variant="body2">
            {t('privateService:privateBookingNotification.form.intro')}
          </Typography>
        </div>
        <>
          <MarketingRuleFormStateField choices={eventTypeChoices} />
          <Divider className={classes.divider} />
          <div className={classes.fieldContainer}>
            <div className={classes.titleContainer}>
              <EventIcon color="action" />
              <Typography variant="h6">
                {t('notificationRule:triggeringEvent.title')}
              </Typography>
            </div>
            <div
              className={`${classes.inlineContainer} ${
                classes.fieldContainer
              } ${values.notifyAllEvents ? classes.greyText : ''}`}
            >
              <Typography variant="body2">
                {t('privateService:privateBookingNotification.form.notifyNb')}
              </Typography>
              <IntegerField
                className={classes.integerInput}
                disabled={values.notifyAllEvents}
                name="notify_booking_nb"
              />
            </div>
            <div className={classes.fieldContainer}>
              <div className={classes.fieldContainer}>
                <CheckboxField
                  classes={{ label: classes.label }}
                  label={t(
                    'privateService:privateBookingNotification.form.notifyAllEvents',
                  )}
                  name="notifyAllEvents"
                />
              </div>
              <div className={classes.helperText}>
                <Typography className={classes.greyText} variant="caption">
                  {t(
                    `privateService:privateBookingNotification.form.help.${getNotificationKind(
                      kind,
                    )}.${values.notifyAllEvents ? 'notifyAll' : 'default'}`,
                    { notifyNb: notify_booking_nb },
                  )}
                </Typography>
              </div>
            </div>
          </div>
          <MarketingRuleBasicTypeField
            periodScale={periodScale}
            relativeTimeValue={relativeTimeValue}
            setFieldValue={setFieldValue}
            timeComparator={timeComparator}
          />
          <MarketingRuleSmartlistField
            goToSmartList={goToSmartlist}
            smartlist_exclude={smartlist_exclude}
            smartlist_include={smartlist_include}
            smartLists={smartLists}
          />
          <MarketingRuleSendingMethodField
            email_design={email_design}
            emailDetailLoading={emailDetailLoading}
            // @ts-expect-error
            emailDetails={emailDetails}
            emailListLoading={emailListLoading}
            emails={emails}
            errors={errors}
            getEmailDetail={getEmailDetail}
            notificationContent={notificationContent}
            notificationTitle={notificationTitle}
            resolvedGenericTags={resolvedGenericTags}
            send_email={send_email}
            send_notification_push={send_notification_push}
            setFieldValue={setFieldValue}
            tags={tags}
          />

          <DialogActions>
            <Button disabled={isSubmitting} onClick={onCancel}>
              {t('privateService:serviceGroup.form.actions.cancel')}
            </Button>
            <Submit
              color="primary"
              disabled={
                (!values.email_design && values.send_email) ||
                !!errors.hours ||
                !!errors.eventType ||
                !!errors.notify_booking_nb ||
                !!errors.email_design ||
                !!errors.notificationTitle ||
                !!errors.notificationContent ||
                !!errors.atLeastOneChannel
              }
              onClick={onSubmitIntent}
            >
              {t('privateService:serviceGroup.form.actions.submit')}
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
  helperText: {
    paddingTop: theme.spacing(2),
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

const PrivateBookingNotificationSchema = Yup.object().shape({
  marketingKind: Yup.number().required(),
  private_service_id: Yup.number(),
  notify_booking_nb: Yup.number().integer().min(1).required(),
  relativeTimeValue: Yup.number().integer().min(0).required(),
  periodScale: Yup.string().required(),
  timeComparator: Yup.string().required(),
  eventType: Yup.number().required(),

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
    // @ts-expect-error
    mapPropsToValues: ({ initial, serviceId }) => {
      if (initial) {
        const {
          kind: marketingKind,
          email_design,
          push_notification_title,
          push_notification_content,
        } = initial;
        const {
          kind: eventType,
          private_service_id,
          notify_booking_nb,
          hours,
          days,
          smartlist_include,
          smartlist_exclude,
        } = initial.event_rules;

        return {
          send_email: !!email_design,
          send_notification_push:
            push_notification_title !== '' || push_notification_content !== '',
          notificationContent: push_notification_content,
          notificationTitle: push_notification_title,
          marketingKind,
          email_design,
          private_service_id,
          notify_booking_nb,
          eventType,
          timeComparator: hours > 0 || days > 0 ? 'after' : 'before',
          periodScale: hours ? 'hours' : 'days',
          relativeTimeValue: hours ? Math.abs(hours) : Math.abs(days) || 0,
          notifyAllEvents: notify_booking_nb === 0,
          smartlist_include: smartlist_include || [],
          smartlist_exclude: smartlist_exclude || [],
        };
      }
      return {
        send_email: true,
        send_notification_push: false,
        notificationContent: '',
        notificationTitle: '',
        marketingKind: PRIVATE_BOOKING_CREATION_NOTIFICATION,
        notifyAllEvents: false,
        timeComparator: 'before',
        periodScale: 'hours',
        private_service_id: serviceId,
        notify_booking_nb: 1,
        relativeTimeValue: 2,
        eventType: PRIVATE_BOOKING_NOTIFICATION_KIND_VALID,
        smartlist_include: [],
        smartlist_exclude: [],
      };
    },
    validationSchema: PrivateBookingNotificationSchema,
    // @ts-expect-error
    handleSubmit: (values, { props: { onSubmit } }) => {
      const [daysSubmit, hoursSubmit] = getSendingTimeNotification(
        // @ts-expect-error
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
          private_service_id: values.private_service_id,
          notify_booking_nb: values.notifyAllEvents
            ? 0
            : values.notify_booking_nb,
          kind: parseInt(values.eventType, 10),
          hours: hoursSubmit,
          days: daysSubmit,
          smartlist_include: values.smartlist_include,
          smartlist_exclude: values.smartlist_exclude,
        },
      };
      onSubmit(data);
    },
  }),
  // @ts-expect-error
)(MarketingRuleFormPrivateBooking);
