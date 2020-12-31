// @flow

import React, { useState, useEffect } from 'react';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';

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

import {
  IntegerField,
  RadioGroupField,
  CheckboxField,
  Actions,
  Submit,
} from '../../../components/forms';

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
  const { t } = useTranslation(['booking', 'paymentPack']);
  const classes = useStyles();
  const { values, setFieldValue } = props;
  const { kind, notify_booking_nb, email_design, bookingStatus } = values;
  const [formIsSecondStep, setFormIsSecondStep] = useState(false);
  const [displayMailPreview, setDisplayMailPreview] = useState(false);

  // To avoid validation errors. If notifyAllEvents is true,
  // then notify_booking_nb will be set to 0 during submission
  if (values.notifyAllEvents && notify_booking_nb !== 1) {
    setFieldValue('notify_booking_nb', 1);
  }

  useEffect(() => {
    if (props.initial) props.getEmailDetail(props.initial.email_design);
    props.getEmails();
  }, []);

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

  return (
    <Dialog open>
      <div className={classes.dialog}>
        <DialogTitle>{t('booking:notification.form.title')}</DialogTitle>
        <Form>
          {/* First step */}
          {!formIsSecondStep && !props.initial && (
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
                    : `${t(
                        'booking:notification.form.help.text',
                      )} ${t(
                        `booking:notification.form.help.${getNotificationKind(
                          kind,
                        )}`,
                        { notify_booking_nb },
                      )}`}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={props.onCancel}>
                  {t('booking:notification.form.cancel')}
                </Button>
                <Button
                  color="primary"
                  onClick={() => setFormIsSecondStep(true)}
                  disabled={!!props.errors.notify_booking_nb}
                >
                  {t('booking:notification.form.next')}
                </Button>
              </DialogActions>
            </>
          )}
          {/* Second Step */}
          {(!!props.initial || formIsSecondStep) && (
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
                        label: t('booking:notification.form.sendBeforeMail'),
                        value: 'before',
                      },
                      {
                        label: t('booking:notification.form.sendAfterMail'),
                        value: 'after',
                      },
                    ]}
                  />
                </div>
                <div className={classes.fieldContainer}>
                  <Typography variant="subtitle2">
                    {t('booking:notification.form.settingTitle')}
                  </Typography>
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
                {/* Render Email Selector */}
                <div className={classes.fieldContainer}>
                  <Typography
                    variant="caption"
                    className={
                      props.errors.email_design ? classes.errorText : null
                    }
                  >
                    {t('paymentPack:notification.form.mailTitle')}
                  </Typography>
                  {props.emailListLoading ? (
                    <LinearProgress className={classes.selectorContainer} />
                  ) : (
                    <div
                      name="email_design"
                      className={classes.selectorContainer}
                    >
                      <EmailSelector
                        name="email_design"
                        emails={props.emails}
                        value={email_design}
                        onChange={(ev) => {
                          setFieldValue('email_design', ev ? ev.value : null);
                          if (ev) props.getEmailDetail(ev.value);
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
                          <VisibilityIcon className={classes.visibilityIcon} />
                          <Typography variant="caption">
                            {t('paymentPack:notification.form.showMail')}
                          </Typography>
                        </div>
                      )}
                    </Button>
                  </div>
                  <Collapse in={displayMailPreview}>
                    <div className={classes.mailPreview}>
                      {email_design && !!props.emailDetails[email_design] ? (
                        <div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: props.emailDetails
                                ? props.emailDetails[email_design].html
                                : null,
                            }}
                          />
                        </div>
                      ) : (
                        renderEmptyOrLoading(
                          props.emailDetailLoading,
                          props.emails,
                          t,
                          classes,
                        )
                      )}
                    </div>
                  </Collapse>
                </div>
              </DialogContent>
              <Actions>
                <Button
                  onClick={() => {
                    props.onCancel();
                    setFormIsSecondStep(false);
                  }}
                  disabled={props.isSubmitting}
                >
                  {t('booking:notification.form.cancel')}
                </Button>
                <Submit
                  color="primary"
                  disabled={!!props.errors.hours || !!props.errors.email_design}
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
}));

const BookingNotificationSchema = Yup.object().shape({
  marketingKind: Yup.number().required(),
  email_design: Yup.number().required(),
  establishment_id: Yup.number().nullable(),
  meta_activity_id: Yup.number().nullable(),
  notify_booking_nb: Yup.number().integer().min(1).required(),
  hours: Yup.number().integer().min(1).required(),
  kind: Yup.number(),
});

export default compose(
  withFormik({
    mapPropsToValues: ({ initial, objectId, identifier }) => {
      if (initial) {
        const { kind: marketingKind, email_design } = initial;
        const {
          kind,
          establishment_id,
          meta_activity_id,
          notify_booking_nb,
          hours,
        } = initial.event_rules;

        return {
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
      }
      return values;
    },
    validationSchema: BookingNotificationSchema,
    handleSubmit: (values, { props: { onSubmit } }) => {
      const data = {
        kind: values.marketingKind,
        email_design: values.email_design,
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
