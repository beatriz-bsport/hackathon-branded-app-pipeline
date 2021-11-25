// @flow

import React, { useState, useEffect } from 'react';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Collapse from '@material-ui/core/Collapse';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import InfoIcon from '@material-ui/icons/Info';

import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import WarningIcon from '@material-ui/icons/Warning';

import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import Tooltip from '../../../components/Tooltip.component';
import SmartListSelector from '../../smart-list/components/SmartListSelector.component';
import EmailSelector from '../../email-editor/components/EmailSelector.component';

import {
  IntegerField,
  RadioGroupField,
  Actions,
  Submit,
  CheckboxField,
  TextField,
} from '../../../components/forms';
import NotificationContentInput from '../../communication/components/NotificationContentInput.component';
import { MAX_LENGTH_PUSH_TITLE } from '../../communication/constant';

const CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME = 3;
const CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT = 4;

type Props = {
  getEmails: () => void,
  getSmartLists: () => void,
  getEmailDetail: (id: number) => void,
  emailListLoading: boolean,
  emails: Array<any>,
  smartLists: Array<any>,
  emailDetailLoading: boolean,
  emailDetails: Array<any>,
  onCancel: () => void,
  goToSmartlist: () => void,
  initial: any,
  values: any,
  setFieldValue: (key: string, value: any) => void,
  errors: any,
  isSubmitting: boolean,
  tags: OptionTypeBase[],
};

const getNotificationKind = (notif: any) => {
  if (notif.kind === CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME) {
    return notif.event_rules.days_left < 0 ? 'daysPast' : 'daysLeft';
  }
  return 'creditsLeft';
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
          {t('notification.form.noMailAvailable')}
        </Typography>
      </div>
    );
  }
  return (
    <div className={classes.previewEmpty}>
      <InfoIcon fontSize="large" color="disabled" />
      <Typography color="textSecondary">
        {t('notification.form.selectToShowPreview')}
      </Typography>
    </div>
  );
};

const PaymentPackNotificationForm = (props: Props) => {
  const {
    getEmails,
    getSmartLists,
    getEmailDetail,
    emailListLoading,
    emails,
    smartLists,
    emailDetailLoading,
    emailDetails,
    onCancel,
    goToSmartlist,
    initial,
    values,
    setFieldValue,
    errors,
    isSubmitting,
    tags,
  } = props;
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
  const [displayMailPreview, setDisplayMailPreview] = useState(false);
  const {
    credits_left,
    verboseNotifKind,
    days_left,
    smartlist_exclude,
    smartlist_include,
    send_email,
    send_notification_push,
    notificationContent,
    notificationTitle,
    email_design,
  } = values;

  useEffect(() => {
    if (initial) getEmailDetail(initial.email_design);
    getEmails();
    getSmartLists();
  }, [initial, getEmailDetail, getEmails, getSmartLists]);

  if (verboseNotifKind !== 'creditsLeft' && credits_left === '') {
    setFieldValue('credits_left', 0);
  }
  if (verboseNotifKind === 'creditsLeft' && days_left === '') {
    setFieldValue('days_left', 0);
  }

  return (
    <Dialog open>
      <DialogTitle>{t('notificationForm')}</DialogTitle>
      <div className={classes.dialogContainer}>
        <Form>
          <div className={classes.fieldContainer} id="select_notification_type">
            <Typography variant="subtitle2">
              {t('notification.form.typeTitle')}
            </Typography>
            <RadioGroupField
              classes={{ label: classes.label }}
              name="verboseNotifKind"
              choices={[
                {
                  label: t('notification.form.creditType'),
                  value: 'creditsLeft',
                },
                {
                  label: t('notification.form.daysType'),
                  value: 'daysLeft',
                },
                {
                  label: t('notification.form.daysPastType'),
                  value: 'daysPast',
                },
              ]}
            />
            {verboseNotifKind === 'creditsLeft' && (
              <div className={classes.inlineContainer}>
                <Typography variant="caption">
                  {t('notification.creditsLeft.first')}
                </Typography>
                <IntegerField
                  name="credits_left"
                  className={classes.textInput}
                />
                <Typography variant="caption">
                  {t('notification.creditsLeft.second')}
                </Typography>
              </div>
            )}

            {verboseNotifKind === 'daysLeft' && (
              <div className={classes.inlineContainer}>
                <Typography variant="caption">
                  {t('notification.daysLeft.first')}
                </Typography>
                <IntegerField className={classes.textInput} name="days_left" />
                <Typography variant="caption">
                  {t('notification.daysLeft.second')}
                </Typography>
              </div>
            )}

            {verboseNotifKind === 'daysPast' && (
              <div className={classes.inlineContainer}>
                <Typography variant="caption">
                  {t('notification.daysPast.first')}
                </Typography>
                <IntegerField className={classes.textInput} name="days_left" />
                <Typography variant="caption">
                  {t('notification.daysPast.second')}
                </Typography>
              </div>
            )}

            {verboseNotifKind !== 'creditsLeft' && (
              <>
                <div className={classes.smartListSelector}>
                  <Typography variant="caption">
                    {t('notification.form.smartListHelper')}
                  </Typography>
                  <SmartListSelector
                    smartLists={smartLists}
                    values={smartlist_exclude}
                    onChange={(ev) =>
                      setFieldValue(
                        'smartlist_exclude',
                        ev.map((item) => item.value),
                      )
                    }
                    helperText={t('notification.form.smartListSelection')}
                  />
                </div>
                <div className={classes.smartListSelector}>
                  <Typography variant="caption">
                    {t('notification.form.smartListHelperInclude')}
                  </Typography>
                  <SmartListSelector
                    smartLists={smartLists}
                    values={smartlist_include}
                    onChange={(ev) =>
                      setFieldValue(
                        'smartlist_include',
                        ev.map((item) => item.value),
                      )
                    }
                    helperText={t('notification.form.smartListSelection')}
                  />
                </div>
                {!smartlist_include.length && !smartlist_exclude.length && (
                  <div className={classes.warningContainer}>
                    <WarningIcon />
                    <Typography
                      style={{ marginRight: '8px', marginLeft: '16px' }}
                    >
                      {t('notification.form.warning')}
                    </Typography>
                    <Button variant="outlined" onClick={goToSmartlist}>
                      {t('notification.form.createSmartList')}
                    </Button>
                  </div>
                )}
              </>
            )}
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
          {send_email && (
            <div
              className={classes.fieldContainer}
              id="select_notification_template"
            >
              <Typography variant="subtitle2">
                {t('paymentPack:notification.form.mailSettings')}
              </Typography>
              <Typography
                variant="caption"
                className={errors.email_design ? classes.errorText : null}
              >
                {t('notification.form.mailTitle')}
              </Typography>
              {emailListLoading ? (
                <LinearProgress className={classes.selectorContainer} />
              ) : (
                <div name="email_design" className={classes.selectorContainer}>
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
                      <VisibilityOffIcon className={classes.visibilityIcon} />
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
                  {email_design && !!emailDetails[email_design] ? (
                    <div>
                      <div
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                          __html: emailDetails
                            ? emailDetails[email_design].html
                            : null,
                        }}
                      />
                    </div>
                  ) : (
                    renderEmptyOrLoading(emailDetailLoading, emails, t, classes)
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
                    errors.notificationTitle || errors.notificationContent,
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
                {`${notificationTitle?.length ?? 0}/${MAX_LENGTH_PUSH_TITLE}`}
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
          <Actions>
            <Button
              onClick={() => {
                onCancel();
              }}
              disabled={isSubmitting}
            >
              {t('booking:notification.form.cancel')}
            </Button>
            <Submit
              color="primary"
              disabled={
                !!errors.email_design ||
                !!errors.days_left ||
                !!errors.credits_left ||
                !!errors.notificationTitle ||
                !!errors.notificationContent ||
                !!errors.atLeastOneChannel
              }
            >
              {t('booking:notification.form.submit')}
            </Submit>
          </Actions>
        </Form>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  bottomButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  smartListSelector: {
    marginTop: theme.spacing(2),
  },
  fieldContainer: {
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  textInput: {
    width: '70px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  inlineContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  selectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  previewEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(6),
  },
  dialogContainer: {
    padding: theme.spacing(1),
    minWidth: '500px',
  },
  visibilityIcon: {
    marginRight: theme.spacing(1),
  },
  errorText: {
    color: 'red',
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
  flex: {
    display: 'flex',
  },
}));

const PaymentPackNotificationSchema = Yup.object().shape({
  kind: Yup.number(),
  payment_pack_id: Yup.number().required(),
  days_left: Yup.number().min(0).required(),
  credits_left: Yup.number().min(0).required(),
  smartlist_include: Yup.array().of(Yup.number()).nullable(),
  smartlist_exclude: Yup.array().of(Yup.number()).nullable(),

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
    validateOnMount: true,
    mapPropsToValues: ({ initial, id }) => {
      if (initial) {
        const {
          kind,
          email_design,
          push_notification_title,
          push_notification_content,
        } = initial;
        const {
          payment_pack_id,
          days_left,
          credits_left,
          smartlist_include,
          smartlist_exclude,
        } = initial.event_rules;
        const verboseNotifKind = getNotificationKind(initial);
        return {
          send_email: !!email_design,
          send_notification_push:
            push_notification_title !== '' || push_notification_content !== '',
          notificationContent: push_notification_content,
          notificationTitle: push_notification_title,
          kind,
          email_design,
          payment_pack_id,
          days_left: Math.abs(days_left) || 0,
          credits_left: credits_left || 0,
          smartlist_include: smartlist_include || [],
          smartlist_exclude: smartlist_exclude || [],
          verboseNotifKind,
        };
      }
      const values = {
        send_email: true,
        send_notification_push: false,
        notificationContent: '',
        notificationTitle: '',
        kind: CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
        email_design: null,
        payment_pack_id: id,
        days_left: 2,
        credits_left: 2,
        smartlist_include: [],
        smartlist_exclude: [],
        verboseNotifKind: 'creditsLeft',
      };
      return values;
    },
    validationSchema: PaymentPackNotificationSchema,
    handleSubmit: (values, { props: { onSubmit } }) => {
      const data = {
        kind:
          values.verboseNotifKind === 'creditsLeft'
            ? CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT
            : CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
        email_design: values.send_email ? values.email_design : null,
        push_notification_title: values.send_notification_push
          ? values.notificationTitle
          : '',
        push_notification_content: values.send_notification_push
          ? values.notificationContent
          : '',
        event_rules: {
          payment_pack_id: values.payment_pack_id,
        },
      };
      switch (values.verboseNotifKind) {
        case 'daysLeft':
          data.event_rules.days_left = values.days_left;
          data.event_rules.smartlist_include = values.smartlist_include;
          data.event_rules.smartlist_exclude = values.smartlist_exclude;
          break;
        case 'daysPast':
          data.event_rules.days_left = values.days_left * -1;
          data.event_rules.smartlist_include = values.smartlist_include;
          data.event_rules.smartlist_exclude = values.smartlist_exclude;
          break;
        default:
          data.event_rules.credits_left = values.credits_left;
          break;
      }
      onSubmit(data);
    },
  }),
)(PaymentPackNotificationForm);
