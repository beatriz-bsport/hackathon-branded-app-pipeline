import React, { useState, useEffect } from 'react';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import { compose } from 'recompose';
import classNames from 'classnames';

import { useTranslation, TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Collapse from '@material-ui/core/Collapse';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import LinearProgress from '@material-ui/core/LinearProgress';
import InfoIcon from '@material-ui/icons/Info';
import { DialogContent } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

import EmailSelector from '#libs/email-editor/components/EmailSelector.component';
import Tooltip from '#components/Tooltip.component';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';

import HTMLPreview from '#components/html/HTMLPreview.component';
import {
  IntegerField,
  RadioGroupField,
  CheckboxField,
  Actions,
  Submit,
  TextField,
} from '#components/forms';
import NotificationContentInput from '#libs/communication/components/NotificationContentInput.component';
import { MAX_LENGTH_PUSH_TITLE } from '#libs/communication/constant';
import { OptionTypeBase } from '#components/Selector/MaterialUISelector.component';
import { MaterialUiMultiSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import { SmartList } from '#libs/smart-list/types';

const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1;

const PRIVATE_BOOKING_NOTIFICATION_KIND_VALID = 0;
const PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_REFUNDED = 1;
const PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_NOT_REFUNDED = 2;

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
    smartLists,
    getSmartLists,
    goToSmartlist,
  } = props;

  const { t } = useTranslation(['paymentPack', 'privateService']);
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
  } = values;
  const classes = useStyles();
  const [formIsSecondStep, setFormIsSecondStep] = useState(false);
  const [displayMailPreview, setDisplayMailPreview] = useState(false);

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

  const smartListSelectOptions: Array<OptionTypeBase> = smartLists?.map(
    (sm) => ({
      label: sm.name,
      value: sm.id,
    }),
  );
  const getWordingBefore = () => {
    if (send_email && send_notification_push)
      return 'privateService:privateBookingNotification.form.chooseWhen.beforeNotifications';
    if (send_email)
      return 'privateService:privateBookingNotification.form.chooseWhen.beforeMail';

    if (send_notification_push)
      return 'privateService:privateBookingNotification.form.chooseWhen.beforeNotification';

    return 'privateService:privateBookingNotification.form.chooseWhen.beforeMail';
  };

  const getWordingAfter = () => {
    if (send_email && send_notification_push)
      return 'privateService:privateBookingNotification.form.chooseWhen.afterNotifications';
    if (send_email)
      return 'privateService:privateBookingNotification.form.chooseWhen.afterMail';

    if (send_notification_push)
      return 'privateService:privateBookingNotification.form.chooseWhen.afterNotification';

    return 'privateService:privateBookingNotification.form.chooseWhen.afterMail';
  };

  return (
    <GenericResponsiveDrawer
      open
      onClose={onCancel}
      title={t('privateService:privateBookingNotification.form.title')}
    >
      <Form>
        {/* First step */}
        {!formIsSecondStep && !initial && (
          <>
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
                    value:
                      PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_NOT_REFUNDED,
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
                {t('privateService:privateBookingNotification.form.notifyNb')}
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

            <DialogActions>
              <Button onClick={onCancel}>
                {t('privateService:serviceGroup.form.actions.cancel')}
              </Button>
              <Button
                color="primary"
                onClick={() => setFormIsSecondStep(true)}
                disabled={!!errors.notify_booking_nb}
              >
                {t('privateService:privateBookingNotification.form.next')}
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
                  {t(
                    'privateService:privateBookingNotification.form.chooseWhen.title',
                  )}
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
                    {t(
                      'privateService:privateBookingNotification.form.chooseTime.first',
                    )}
                  </Typography>
                  <IntegerField className={classes.integerInput} name="hours" />
                  <Typography variant="caption">
                    {t(
                      `privateService:privateBookingNotification.form.chooseTime.second.${values.when}`,
                    )}
                  </Typography>
                </div>
              </div>
              <>
                <Typography variant="subtitle2" className={classes.spacingTop}>
                  {t('booking:notification.form.advanced')}
                </Typography>
                <div className={classes.smartListSelector}>
                  <Typography variant="caption">
                    {t('notification.form.smartListHelper')}
                  </Typography>
                  <MaterialUiMultiSelectorField
                    name="smartlist_exclude"
                    options={
                      smartListSelectOptions ? [...smartListSelectOptions] : []
                    }
                    placeholder={t('notification.form.smartListSelection')}
                    isMulti
                    isClearable
                    value={smartListSelectOptions?.filter((opt) =>
                      smartlist_exclude?.includes(opt?.value),
                    )}
                  />
                </div>
                <div className={classes.smartListSelector}>
                  <Typography variant="caption">
                    {t('notification.form.smartListHelperInclude')}
                  </Typography>
                  <MaterialUiMultiSelectorField
                    name="smartlist_include"
                    options={
                      smartListSelectOptions ? [...smartListSelectOptions] : []
                    }
                    placeholder={t('notification.form.smartListSelection')}
                    isMulti
                    isClearable
                    value={smartListSelectOptions?.filter((opt) =>
                      smartlist_include?.includes(opt?.value),
                    )}
                  />
                </div>
                {!smartlist_include.length && !smartlist_exclude.length && (
                  <div className={classes.warningContainer}>
                    <WarningIcon className={classes.warningIcon} />
                    <Typography
                      variant="body2"
                      className={classes.warningContent}
                    >
                      {t('notification.form.warning')}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={goToSmartlist}
                      className={classes.createSmartList}
                    >
                      {t('notification.form.createSmartList')}
                    </Button>
                  </div>
                )}
              </>
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
                        error
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
                        <HTMLPreview
                          html={emailDetails?.[email_design]?.html}
                          scrolling
                        />
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
                {t('privateService:serviceGroup.form.actions.cancel')}
              </Button>
              <Submit
                onClick={onSubmitIntent}
                color="primary"
                disabled={
                  !!errors.hours ||
                  !!errors.email_design ||
                  !!errors.notificationTitle ||
                  !!errors.notificationContent ||
                  !!errors.atLeastOneChannel
                }
              >
                {t('privateService:serviceGroup.form.actions.submit')}
              </Submit>
            </Actions>
          </>
        )}
      </Form>
    </GenericResponsiveDrawer>
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
  smartListSelector: {
    marginTop: theme.spacing(2),
  },
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    justifyContent: 'space-between',
  },
  warningContent: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  createSmartList: {
    borderColor: theme.palette.warning.main,
    color: theme.palette.warning.main,
  },
}));

const PrivateBookingNotificationSchema = Yup.object().shape({
  marketingKind: Yup.number().required(),
  private_service_id: Yup.number(),
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
  smartlist_include: Yup.array().of(Yup.number()),
  smartlist_exclude: Yup.array().of(Yup.number()),
});

export default compose(
  withFormik({
    mapPropsToValues: ({ initial, serviceId }) => {
      if (initial) {
        const {
          kind: marketingKind,
          email_design,
          push_notification_title,
          push_notification_content,
        } = initial;
        const {
          kind,
          private_service_id,
          notify_booking_nb,
          hours,
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
          hours: Math.abs(hours),
          kind,
          when: hours > 0 ? 'after' : 'before',
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
        email_design: null,
        notifyAllEvents: false,
        when: 'before',
        private_service_id: serviceId,
        notify_booking_nb: 1,
        hours: 2,
        kind: PRIVATE_BOOKING_NOTIFICATION_KIND_VALID,
        smartlist_include: [],
        smartlist_exclude: [],
      };
    },
    validationSchema: PrivateBookingNotificationSchema,
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
          private_service_id: values.private_service_id,
          notify_booking_nb: values.notifyAllEvents
            ? 0
            : values.notify_booking_nb,
          kind: parseInt(values.kind, 10),
          hours: values.when === 'before' ? values.hours * -1 : values.hours,
          smartlist_include: values.smartlist_include,
          smartlist_exclude: values.smartlist_exclude,
        },
      };
      onSubmit(data);
    },
  }),
)(MarketingRuleFormPrivateBooking);
