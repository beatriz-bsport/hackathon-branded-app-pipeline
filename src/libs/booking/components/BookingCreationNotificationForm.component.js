// @flow

import React, { useState, useEffect } from 'react';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Collapse from '@material-ui/core/Collapse';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import InfoIcon from '@material-ui/icons/Info';

import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import EmailSelector from '../../email-editor/components/EmailSelector.component';
import Tooltip from '../../../components/Tooltip.component';
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';

import {
  IntegerField,
  RadioGroupField,
  CheckboxField,
  TextField,
  Actions,
  Submit,
} from '../../../components/forms';
import NotificationContentInput from '../../communication/components/NotificationContentInput.component';
import { MAX_LENGTH_PUSH_TITLE } from '../../communication/constant';

const BOOKING_CREATION_NOTIFICATION = 2;

const BOOKING_NOTIFICATION_VALID_ATTENDANCE = 3;
const BOOKING_NOTIFICATION_VALID_ABSENCE = 4;
const BOOKING_NOTIFICATION_CANCELLED_REFUNDED = 5;
const BOOKING_NOTIFICATION_CANCELLED_NOT_REFUNDED = 6;

type Props = {
  isSubmitting: boolean,

  onCancel: () => void,
  getEmails: () => void,
  emails: Array<any>,
  getEmailDetail: (id: number) => void,
  emailDetails: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  initial: any,
  values: any,
  setFieldValue: (key: string, value: any) => void,
  errors: any,
  tags: OptionTypeBase[],
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

const renderEmptyOrLoading = (
  loading: boolean,
  emails: Array<any>,
  t: TFunction,
  classes: any,
) => {
  if (loading) {
    return <CircularProgress />;
  }
  if (!emails.length) {
    return (
      <div className={classes.previewEmpty}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography color="textSecondary">
          {t('paymentPack:notification.form.noMailAvailable')}
        </Typography>
      </div>
    );
  }
  return (
    <div className={classes.previewEmpty}>
      <InfoIcon fontSize="large" color="disabled" />
      <Typography color="textSecondary">
        {t('paymentPack:notification.form.selectToShowPreview')}
      </Typography>
    </div>
  );
};

const BookingCreationNotificationForm = (props: Props) => {
  const {
    isSubmitting,
    onCancel,
    getEmails,
    emails,
    getEmailDetail,
    emailDetails,
    emailListLoading,
    emailDetailLoading,
    initial,
    values,
    setFieldValue,
    errors,
    tags,
  } = props;
  const { t } = useTranslation(['booking', 'paymentPack']);
  const classes = useStyles();
  const {
    kind,
    notify_booking_nb,
    email_design,
    bookingStatus,
    send_email,
    send_notification_push,
    notificationContent,
    notificationTitle,
  } = values;
  const [formIsSecondStep, setFormIsSecondStep] = useState(false);
  const [displayMailPreview, setDisplayMailPreview] = useState(false);

  // To avoid validation errors. If notifyAllEvents is true,
  // then notify_booking_nb will be set to 0 during submission
  if (values.notifyAllEvents && notify_booking_nb !== 1) {
    setFieldValue('notify_booking_nb', 1);
  }

  useEffect(() => {
    if (initial) getEmailDetail(initial.email_design);
    getEmails();
  }, [initial, getEmails, getEmailDetail]);

  // Update kind when bookingStatus changes so that we always have a checked
  // radio input on the screen
  if (
    values.bookingStatus === 'cancelled' &&
    [
      BOOKING_NOTIFICATION_VALID_ATTENDANCE,
      BOOKING_NOTIFICATION_VALID_ABSENCE,
    ].includes(parseInt(kind, 10))
  ) {
    setFieldValue('kind', BOOKING_NOTIFICATION_CANCELLED_REFUNDED);
  }
  if (
    values.bookingStatus === 'valid' &&
    [
      BOOKING_NOTIFICATION_CANCELLED_REFUNDED,
      BOOKING_NOTIFICATION_CANCELLED_NOT_REFUNDED,
    ].includes(parseInt(kind, 10))
  ) {
    setFieldValue('kind', BOOKING_NOTIFICATION_VALID_ATTENDANCE);
  }

  const getWordingBefore = () => {
    if (send_email && send_notification_push)
      return 'booking:notification.form.sendBeforeNotifications';

    if (send_email) return 'booking:notification.form.sendBeforeMail';

    if (send_notification_push)
      return 'booking:notification.form.sendBeforeNotification';

    return 'booking:notification.form.sendBeforeMail';
  };

  const getWordingAfter = () => {
    if (send_email && send_notification_push)
      return 'booking:notification.form.sendAfterNotifications';

    if (send_email) return 'booking:notification.form.sendAfterMail';

    if (send_notification_push)
      return 'booking:notification.form.sendAfterNotification';

    return 'booking:notification.form.sendAfterMail';
  };

  return (
    <Dialog open>
      <div className={classes.dialog}>
        <DialogTitle>{t('booking:notification.form.title')}</DialogTitle>
        <Form>
          {/* First step */}
          {!formIsSecondStep && !initial && (
            <>
              <DialogContent>
                <Typography variant="body2">
                  {t('booking:notification.form.explain')}
                </Typography>
                <div className={classes.fieldContainer}>
                  <Typography variant="subtitle2">
                    {t('booking:notification.form.chooseStatus.title')}
                  </Typography>
                  <RadioGroupField
                    classes={{ label: classes.label }}
                    name="bookingStatus"
                    choices={[
                      {
                        label: t(
                          'booking:notification.form.chooseStatus.valid',
                        ),
                        value: 'valid',
                      },
                      {
                        label: t(
                          'booking:notification.form.chooseStatus.cancelled',
                        ),
                        value: 'cancelled',
                      },
                    ]}
                  />
                </div>
                <div className={classes.fieldContainer}>
                  <Typography variant="subtitle2">
                    {t('booking:notification.form.chooseKind.title')}
                  </Typography>
                  {bookingStatus === 'valid' && (
                    <RadioGroupField
                      classes={{ label: classes.label }}
                      name="kind"
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
                  )}
                  {bookingStatus === 'cancelled' && (
                    <RadioGroupField
                      classes={{ label: classes.label }}
                      name="kind"
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
                <div className={classes.fieldContainer}>
                  <CheckboxField
                    classes={{ label: classes.label }}
                    name="notifyAllEvents"
                    label={t('booking:notification.form.notifyAllEvents')}
                  />
                </div>
                <Typography variant="caption" className={classes.greyText}>
                  {values.notifyAllEvents
                    ? t(
                        `booking:notification.form.help.allEvents.${getNotificationKind(
                          kind,
                        )}`,
                      )
                    : `${t('booking:notification.form.help.text')} ${t(
                        `booking:notification.form.help.${getNotificationKind(
                          kind,
                        )}`,
                        { notify_booking_nb },
                      )}`}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={onCancel}>
                  {t('booking:notification.form.cancel')}
                </Button>
                <Button
                  color="primary"
                  onClick={() => setFormIsSecondStep(true)}
                  disabled={!!errors.notify_booking_nb}
                >
                  {t('booking:notification.form.next')}
                </Button>
              </DialogActions>
            </>
          )}
          {/* Second Step */}
          {(!!initial || formIsSecondStep) && (
            <>
              <DialogContent>
                <div className={classes.fieldContainer}>
                  <Typography variant="subtitle2">
                    {t('booking:notification.form.typeTitle')}
                  </Typography>
                  <RadioGroupField
                    classes={{ label: classes.label }}
                    name="when"
                    choices={[
                      {
                        label: t(getWordingBefore()),
                        value: 'before',
                      },
                      {
                        label: t(getWordingAfter()),
                        value: 'after',
                      },
                    ]}
                  />
                  <div className={classes.inlineContainer}>
                    <Typography variant="caption">
                      {t('booking:notification.form.chooseTime.first')}
                    </Typography>
                    <IntegerField
                      className={classes.integerInput}
                      name="hours"
                    />
                    <Typography variant="caption">
                      {t('booking:notification.form.chooseTime.second', {
                        context: values.when,
                      })}
                    </Typography>
                  </div>
                </div>
                <FeatureListProvider>
                  {(featureList) => {
                    const hasUpsell =
                      featureList.upsell &&
                      featureList.upsell.find(
                        (f) => f.readable_identifier === 'push_notification',
                      );

                    return (
                      <div className={classes.fieldContainer}>
                        <Typography
                          variant="subtitle2"
                          className={classes.spacingTop}
                        >
                          {t('booking:notification.form.sendingMethod')}
                        </Typography>
                        <CheckboxField
                          name="send_email"
                          label={t('booking:notification.form.mail')}
                          checked={send_email}
                        />
                        <Tooltip
                          title={t('booking:notification.form.needPushUpsell')}
                          hide={hasUpsell}
                          placement="bottom-start"
                        >
                          <div className={classes.flex}>
                            <CheckboxField
                              name="send_notification_push"
                              label={t('booking:notification.form.push')}
                              checked={send_notification_push}
                              disabled={!hasUpsell}
                            />
                          </div>
                        </Tooltip>
                        {send_notification_push && (
                          <Typography variant="caption" color="textSecondary">
                            {t('booking:notification.form.pushHelper')}
                          </Typography>
                        )}
                      </div>
                    );
                  }}
                </FeatureListProvider>
                <Typography
                  variant="subtitle1"
                  className={classNames(
                    [classes.spacingTop],
                    [classes.spacingBottom],
                  )}
                >
                  {t('booking:notification.form.settingTitle')}
                </Typography>
                {/* Render Email Selector */}
                {send_email && (
                  <div className={classes.fieldContainer}>
                    <Typography variant="subtitle2">
                      {t('paymentPack:notification.form.mailSettings')}
                    </Typography>
                    <Typography
                      variant="caption"
                      className={errors.email_design ? classes.errorText : null}
                    >
                      {t('paymentPack:notification.form.mailTitle')}
                    </Typography>
                    {emailListLoading ? (
                      <LinearProgress className={classes.selectorContainer} />
                    ) : (
                      <div
                        name="email_design"
                        className={classes.selectorContainer}
                      >
                        <EmailSelector
                          name="email_design"
                          emails={emails}
                          value={email_design}
                          onChange={(ev) => {
                            setFieldValue('email_design', ev ? ev.value : null);
                            if (ev) getEmailDetail(ev.value);
                          }}
                          helperText={t(
                            'paymentPack:notification.form.mailSelection',
                          )}
                        />
                      </div>
                    )}
                    <div className={classes.buttonContainer}>
                      <Button
                        onClick={() =>
                          setDisplayMailPreview((prevDisplay) => !prevDisplay)
                        }
                      >
                        {displayMailPreview ? (
                          <div className={classes.inlineContainer}>
                            <VisibilityOffIcon
                              className={classes.visibilityIcon}
                            />
                            <Typography variant="caption">
                              {t('paymentPack:notification.form.hideMail')}
                            </Typography>
                          </div>
                        ) : (
                          <div className={classes.inlineContainer}>
                            <VisibilityIcon
                              className={classes.visibilityIcon}
                            />
                            <Typography variant="caption">
                              {t('paymentPack:notification.form.showMail')}
                            </Typography>
                          </div>
                        )}
                      </Button>
                    </div>
                    <Collapse in={displayMailPreview}>
                      <div className={classes.mailPreview}>
                        {email_design && !!emailDetails[email_design] ? (
                          <div>
                            <div
                              // eslint-disable-next-line
                              dangerouslySetInnerHTML={{
                                __html: emailDetails
                                  ? emailDetails[email_design].html
                                  : null,
                              }}
                            />
                          </div>
                        ) : (
                          renderEmptyOrLoading(
                            emailDetailLoading,
                            emails,
                            t,
                            classes,
                          )
                        )}
                      </div>
                    </Collapse>
                  </div>
                )}
                {send_notification_push && (
                  <div className={classes.fieldContainer}>
                    <Typography
                      variant="subtitle2"
                      className={classNames([classes.spacingTop], {
                        [classes.errorText]:
                          errors.notificationTitle ||
                          errors.notificationContent,
                      })}
                    >
                      {t('paymentPack:notification.form.pushTitle')}
                    </Typography>
                    <TextField
                      label={t('communication:mail.titleNotification')}
                      name="notificationTitle"
                      fullWidth
                      inputProps={{ maxLength: MAX_LENGTH_PUSH_TITLE }}
                      className={classes.notificationInput}
                    />
                    <Typography variant="caption" className={classes.grey}>
                      {`${
                        notificationTitle?.length ?? 0
                      }/${MAX_LENGTH_PUSH_TITLE}`}
                    </Typography>
                    <NotificationContentInput
                      label={t('communication:mail.contentNotification')}
                      name="notificationContent"
                      className={classes.notificationInput}
                      value={notificationContent}
                      tags={tags}
                    />
                  </div>
                )}
              </DialogContent>
              <Actions>
                <Button
                  onClick={() => {
                    onCancel();
                    setFormIsSecondStep(false);
                  }}
                  disabled={isSubmitting}
                >
                  {t('booking:notification.form.cancel')}
                </Button>
                <Submit
                  color="primary"
                  disabled={
                    !!errors.hours ||
                    !!errors.email_design ||
                    !!errors.notificationTitle ||
                    !!errors.notificationContent ||
                    !!errors.atLeastOneChannel
                  }
                >
                  {t('booking:notification.form.submit')}
                </Submit>
              </Actions>
            </>
          )}
        </Form>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
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
  selectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  visibilityIcon: {
    marginRight: theme.spacing(1),
  },
  previewEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(6),
  },
  mailPreview: {
    border: '1px solid grey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    minHeight: '30vh',
    minWidth: '40vh',
  },
  integerInput: {
    width: '70px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  errorText: {
    color: 'red',
  },
  dialog: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  label: {
    fontSize: '0.9rem',
  },
  spacingTop: {
    marginTop: theme.spacing(4),
  },
  spacingBottom: {
    marginBottom: theme.spacing(2),
  },
  notificationInput: {
    marginTop: theme.spacing(2),
  },
}));

const BookingNotificationSchema = Yup.object().shape({
  marketingKind: Yup.number().required(),
  establishment_id: Yup.number().nullable(),
  meta_activity_id: Yup.number().nullable(),
  notify_booking_nb: Yup.number().integer().min(1).required(),
  hours: Yup.number().integer().min(1).required(),
  kind: Yup.number(),

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
          kind,
          establishment_id,
          meta_activity_id,
          notify_booking_nb,
          hours,
        } = initial.event_rules;

        return {
          send_email: !!email_design,
          send_notification_push:
            push_notification_title !== '' || push_notification_content !== '',
          notificationContent: push_notification_content,
          notificationTitle: push_notification_title,
          marketingKind,
          email_design,
          establishment_id,
          meta_activity_id,
          notify_booking_nb,
          hours: Math.abs(hours),
          kind,
          when: hours > 0 ? 'after' : 'before',
          notifyAllEvents: notify_booking_nb === 0,
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
        when: 'before',
        notify_booking_nb: 1,
        hours: 2,
        kind: BOOKING_NOTIFICATION_VALID_ATTENDANCE,
        bookingStatus: 'valid',
      };
      if (identifier === 'establishment') {
        values.establishment_id = objectId;
        values.meta_activity_id = null;
      } else if (identifier === 'meta_activity') {
        values.establishment_id = null;
        values.meta_activity_id = objectId;
      } else if (identifier === 'workshop') {
        values.establishment_id = null;
        values.meta_activity_id = objectId;
      }
      return values;
    },
    validationSchema: BookingNotificationSchema,
    handleSubmit: (values, { props: { onSubmit } }) => {
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
          notify_booking_nb: values.notifyAllEvents
            ? 0
            : values.notify_booking_nb,
          kind: parseInt(values.kind, 10),
          hours: values.when === 'before' ? values.hours * -1 : values.hours,
        },
      };
      onSubmit(data);
    },
  }),
)(BookingCreationNotificationForm);
