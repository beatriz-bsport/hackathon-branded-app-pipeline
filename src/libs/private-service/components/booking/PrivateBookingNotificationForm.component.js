// @flow
import React, { useState, useEffect } from 'react';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import { compose } from 'recompose';

import { useTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Collapse from '@material-ui/core/Collapse';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import LinearProgress from '@material-ui/core/LinearProgress';
import InfoIcon from '@material-ui/icons/Info';
import DialogTitle from '@material-ui/core/DialogTitle';

import EmailSelector from '../../../email-editor/components/EmailSelector.component';

import {
  IntegerField,
  RadioGroupField,
  CheckboxField,
  Actions,
  Submit,
} from '../../../../components/forms';

const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1;

const PRIVATE_BOOKING_NOTIFICATION_KIND_VALID = 0;
const PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_REFUNDED = 1;
const PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_NOT_REFUNDED = 2;

type Props = {
  isSubmitting: boolean,
  emails: Array<any>,
  getEmails: () => void,
  getEmailDetail: (id: number) => void,
  emailDetails: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,

  onCancel: () => void,
  initial: any,
  values: any,
  setFieldValue: (key: string, value: any) => void,
  errors: any,
};

const getNotificationKind = (kind: number) => {
  switch (parseInt(kind, 10)) {
    case PRIVATE_BOOKING_NOTIFICATION_KIND_VALID:
      return 'valid';
    case PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_REFUNDED:
      return 'cancelledRefunded';
    default:
      return 'cancelledNotRefunded';
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

const PrivateBookingNotificationForm = (props: Props) => {
  const { t } = useTranslation(['paymentPack', 'privateService']);
  const { values, setFieldValue } = props;
  const { kind, notify_booking_nb, email_design } = values;
  const classes = useStyles();
  const [formIsSecondStep, setFormIsSecondStep] = useState(false);
  const [displayMailPreview, setDisplayMailPreview] = useState(false);

  // To avoid validation errors. If notifyAllEvents is true,
  // then notify_booking_nb will be set to 0 during submission
  if (values.notifyAllEvents && values.notify_booking_nb !== 1) {
    setFieldValue('notify_booking_nb', 1);
  }

  useEffect(() => {
    if (props.initial) props.getEmailDetail(props.initial.email_design);
    props.getEmails();
  }, []);
  return (
    <Dialog open>
      <div className={classes.dialog}>
        <DialogTitle>
          {t('privateService:privateBookingNotification.form.title')}
        </DialogTitle>
        <Form>
          {/* First step */}
          {!formIsSecondStep && !props.initial && (
            <>
              <DialogContent>
                <Typography variant="body2">
                  {t('privateService:privateBookingNotification.form.intro')}
                </Typography>
                <div className={classes.fieldContainer}>
                  <Typography variant="subtitle2">
                    {t(
                      'privateService:privateBookingNotification.form.chooseKind.title',
                    )}
                  </Typography>
                  <RadioGroupField
                    classes={{ label: classes.label }}
                    name="kind"
                    choices={[
                      {
                        label: t(
                          'privateService:privateBookingNotification.form.chooseKind.valid',
                        ),
                        value: PRIVATE_BOOKING_NOTIFICATION_KIND_VALID,
                      },
                      {
                        label: t(
                          'privateService:privateBookingNotification.form.chooseKind.cancelledRefunded',
                        ),
                        value: PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_REFUNDED,
                      },
                      {
                        label: t(
                          'privateService:privateBookingNotification.form.chooseKind.cancelledNotRefunded',
                        ),
                        value: PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_NOT_REFUNDED,
                      },
                    ]}
                  />
                </div>
                <div
                  className={`${classes.inlineContainer} ${
                    classes.fieldContainer
                  } ${values.notifyAllEvents ? classes.greyText : ''}`}
                >
                  <Typography variant="body2">
                    {t(
                      'privateService:privateBookingNotification.form.notifyNb',
                    )}
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
                    label={t(
                      'privateService:privateBookingNotification.form.notifyAllEvents',
                    )}
                  />
                </div>
                <Typography variant="caption" className={classes.greyText}>
                  {t(
                    `privateService:privateBookingNotification.form.help.${getNotificationKind(
                      kind,
                    )}.${values.notifyAllEvents ? 'notifyAll' : 'default'}`,
                    { notifyNb: notify_booking_nb },
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={props.onCancel}>
                  {t('privateService:serviceGroup.form.actions.cancel')}
                </Button>
                <Button
                  color="primary"
                  onClick={() => setFormIsSecondStep(true)}
                  disabled={!!props.errors.notify_booking_nb}
                >
                  {t('privateService:privateBookingNotification.form.next')}
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
                    {t(
                      'privateService:privateBookingNotification.form.chooseWhen.title',
                    )}
                  </Typography>
                  <RadioGroupField
                    classes={{ label: classes.label }}
                    name="when"
                    choices={[
                      {
                        label: t(
                          'privateService:privateBookingNotification.form.chooseWhen.before',
                        ),
                        value: 'before',
                      },
                      {
                        label: t(
                          'privateService:privateBookingNotification.form.chooseWhen.after',
                        ),
                        value: 'after',
                      },
                    ]}
                  />
                </div>
                <div className={classes.fieldContainer}>
                  <Typography variant="subtitle2">
                    {t(
                      'privateService:privateBookingNotification.form.chooseTime.title',
                    )}
                  </Typography>
                  <div className={classes.inlineContainer}>
                    <Typography variant="caption">
                      {t(
                        'privateService:privateBookingNotification.form.chooseTime.first',
                      )}
                    </Typography>
                    <IntegerField
                      className={classes.integerInput}
                      name="hours"
                    />
                    <Typography variant="caption">
                      {t(
                        `privateService:privateBookingNotification.form.chooseTime.second.${values.when}`,
                      )}
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
                        error
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
                  {t('privateService:serviceGroup.form.actions.cancel')}
                </Button>
                <Submit
                  color="primary"
                  disabled={!!props.errors.hours || !!props.errors.email_design}
                >
                  {t('privateService:serviceGroup.form.actions.submit')}
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

const PrivateBookingNotificationSchema = Yup.object().shape({
  marketingKind: Yup.number().required(),
  email_design: Yup.number().required(),
  private_service_id: Yup.number(),
  notify_booking_nb: Yup.number().integer().min(1).required(),
  hours: Yup.number().integer().min(1).required(),
  kind: Yup.number(),
});

export default compose(
  withFormik({
    mapPropsToValues: ({ initial, serviceId }) => {
      if (initial) {
        const { kind: marketingKind, email_design } = initial;
        const {
          kind,
          private_service_id,
          notify_booking_nb,
          hours,
        } = initial.event_rules;

        return {
          marketingKind,
          email_design,
          private_service_id,
          notify_booking_nb,
          hours: Math.abs(hours),
          kind,
          when: hours > 0 ? 'after' : 'before',
          notifyAllEvents: notify_booking_nb === 0,
        };
      }
      return {
        marketingKind: PRIVATE_BOOKING_CREATION_NOTIFICATION,
        email_design: null,
        notifyAllEvents: false,
        when: 'before',
        private_service_id: serviceId,
        notify_booking_nb: 1,
        hours: 2,
        kind: PRIVATE_BOOKING_NOTIFICATION_KIND_VALID,
      };
    },
    validationSchema: PrivateBookingNotificationSchema,
    handleSubmit: (values, { props: { onSubmit } }) => {
      const data = {
        kind: values.marketingKind,
        email_design: values.email_design,
        event_rules: {
          private_service_id: values.private_service_id,
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
)(PrivateBookingNotificationForm);
