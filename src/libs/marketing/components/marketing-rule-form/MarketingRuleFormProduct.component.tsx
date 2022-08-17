import React, { useState, useEffect } from 'react';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';

import VisibilityIcon from '@material-ui/icons/Visibility';
import Collapse from '@material-ui/core/Collapse';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import InfoIcon from '@material-ui/icons/Info';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { compose } from 'recompose';
import WarningIcon from '@material-ui/icons/Warning';

import { PAYMENT_PACK_EVENT_RULE } from '@bsport/common/lib/master-data/notification-rule-events';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import Tooltip from '#components/Tooltip.component';
import EmailSelector from '#libs/email-editor/components/EmailSelector.component';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

import {
  IntegerField,
  RadioGroupField,
  Actions,
  Submit,
  CheckboxField,
  TextField,
} from '#components/forms';
import NotificationContentInput from '#libs/communication/components/NotificationContentInput.component';
import { MAX_LENGTH_PUSH_TITLE } from '#libs/communication/constant';
import MaterialUISelector, {
  OptionTypeBase,
} from '#components/Selector/MaterialUISelector.component';
import { MarketingNotification } from '../../types';
import {
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
} from '#libs/private-service/utils';
import {
  CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING,
  CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_OFFER_START,
} from '#libs/payment-packs/utils';
import HTMLPreview from '#components/html/HTMLPreview.component';

interface InitialFormikValues {
  send_email: boolean;
  send_notification_push: boolean;
  notificationContent: string | null;
  notificationTitle: string | null;
  kind: number;
  email_design: number;
  payment_pack_id: number | null;
  private_pass_id: number | null;
  days_left: number | string | null;
  credits_left: number | string | null;
  smartlist_include: Array<number>;
  smartlist_exclude: Array<number>;
  verboseNotifKind: string | null;
  identifier: 'payment_pack' | 'private_pass';
  hours: number;
  creditNotificationKind: 'onBooking' | 'onOfferStart';
}
interface FinalFormikData extends MarketingNotification {
  send_email: boolean;
  send_notification_push: boolean;
  credits_left: number | null;
  notificationContent: string | null;
  notificationTitle: string | null;
  verboseNotifKind: string | null;
  days_left: number;
  payment_pack_id: number | null;
  private_pass_id: number | null;
  identifier: 'payment_pack' | 'private_pass';
  id?: number;
  company?: number;
  kind: number;
  email_design: number;
  is_event_based?: boolean;
  active: boolean;
  push_notification_content: string;
  push_notification_title: string;
  smartlist_include: Array<number>;
  smartlist_exclude: Array<number>;
  hours: number;
  creditNotificationKind: 'onBooking' | 'onOfferStart';
}

const getKind = (identifer: string, values: any) => {
  if (identifer === 'payment_pack') {
    if (values.verboseNotifKind === 'creditsLeft') {
      return PAYMENT_PACK_EVENT_RULE.NOTIFICATION_CREDIT;
    }
    return PAYMENT_PACK_EVENT_RULE.NOTIFICATION_TIME;
  }
  if (values.verboseNotifKind === 'creditsLeft') {
    return PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT;
  }
  return PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME;
};
const getEventRulesKind = (values: any) => {
  return values.creditNotificationKind === 'onBooking'
    ? CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING
    : CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_OFFER_START;
};
type Props = {
  getEmails: () => void;
  getSmartLists: () => void;
  getEmailDetail: (id: number) => void;
  emailListLoading: boolean;
  emails: Array<any>;
  smartLists: Array<any>;
  emailDetailLoading: boolean;
  emailDetails: Array<any>;
  onCancel: () => void;
  goToSmartlist: () => void;
  initial: MarketingNotification;
  values: FinalFormikData;
  setFieldValue: (key: string, value: any) => void;
  errors: any;
  isSubmitting: boolean;
  tags: { [tag_name: string]: string[] };
} & FormikProps<InitialFormikValues>;

const getNotificationKind = (notif: any) => {
  if (
    notif.kind === PAYMENT_PACK_EVENT_RULE.NOTIFICATION_TIME ||
    notif.kind === PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME
  ) {
    return notif.event_rules.days_left < 0 ? 'daysPast' : 'daysLeft';
  }
  return 'creditsLeft';
};

const getPpCreditNotificationKind = (notif: any) => {
  return notif.event_rules.kind === undefined ||
    notif.event_rules.kind ===
      CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING
    ? 'onBooking'
    : 'onOfferStart';
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

const ProductNotificationForm = (props: Props) => {
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
    identifier,
    creditNotificationKind,
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
  const smartListSelectOptions: Array<OptionTypeBase> = smartLists?.map(
    (sm) => ({
      label: sm.name,
      value: sm.id,
    }),
  );
  return (
    <GenericResponsiveDrawer
      open
      onClose={onCancel}
      title={t('notificationForm')}
    >
      <Form>
        <div className={classes.fieldContainer} id="select_notification_type">
          <Typography variant="subtitle2">
            {t('notification.form.typeTitle')}
          </Typography>
          <RadioGroupField
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
              <IntegerField name="credits_left" className={classes.textInput} />
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
                <MaterialUISelector
                  onChange={(selectedValues: Array<OptionTypeBase>) =>
                    setFieldValue(
                      'smartlist_exclude',
                      selectedValues?.map((opt) => opt?.value),
                    )
                  }
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
                <MaterialUISelector
                  onChange={(selectedValues: Array<OptionTypeBase>) =>
                    setFieldValue(
                      'smartlist_include',
                      selectedValues?.map((opt) => opt?.value),
                    )
                  }
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
        {identifier === 'payment_pack' && verboseNotifKind === 'creditsLeft' && (
          <div className={classes.fieldContainer}>
            <Typography variant="subtitle2">
              {t('booking:notification.form.chooseKind.title')}
            </Typography>
            <RadioGroupField
              name="creditNotificationKind"
              choices={[
                {
                  label: t(
                    'notification.form.creditNotificationType.onBooking',
                  ),
                  value: 'onBooking',
                },
                {
                  label: t(
                    'notification.form.creditNotificationType.onOfferStart',
                  ),
                  value: 'onOfferStart',
                },
              ]}
            />
            <div className={classes.inlineContainer}>
              <Typography variant="caption">
                {t('notification.form.chooseTime.first')}
              </Typography>
              <IntegerField className={classes.integerInput} name="hours" />
              <Typography variant="caption">
                {t(
                  `notification.form.chooseTime.${
                    creditNotificationKind === 'onBooking'
                      ? 'secondOnBooking'
                      : 'secondOnOfferStart'
                  }`,
                )}
              </Typography>
            </div>
          </div>
        )}

        <FeatureListProvider>
          {(featureList) => {
            const hasUpsell =
              featureList.upsell &&
              featureList.upsell.find(
                (f) => f.readable_identifier === 'push_notification',
              );

            return (
              <div className={classes.fieldContainer}>
                <Typography variant="subtitle2" className={classes.spacingTop}>
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
          className={classNames([classes.spacingTop], [classes.spacingBottom])}
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
                  helperText={t('paymentPack:notification.form.mailSelection')}
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
                  <HTMLPreview
                    html={emailDetails?.[email_design]?.html}
                    scrolling
                  />
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
            <Typography variant="caption">
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
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  integerInput: {
    width: '70px',
  },
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
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

const ProductNotificationSchema = Yup.object().shape({
  kind: Yup.number(),
  payment_pack_id: Yup.number().when('identifier', {
    is: 'payment_pack',
    then: Yup.number().required(),
    otherwise: Yup.number().nullable(),
  }),
  private_pass_id: Yup.number().when('identifier', {
    is: 'private_pass',
    then: Yup.number().required(),
    otherwise: Yup.number().nullable(),
  }),
  days_left: Yup.number().min(0).required(),
  credits_left: Yup.number().min(0).required(),
  creditNotificationKind: Yup.string().oneOf(['onBooking', 'onOfferStart']),
  hours: Yup.number()
    .min(0)
    .when(['identifier', 'verboseNotifKind'], {
      is: (identifier, verboseNotifKind) =>
        identifier === 'payment_pack' && verboseNotifKind === 'creditsLeft',
      then: Yup.number().required(),
    }),
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
  identifier: Yup.string(),
});

export default compose<any, Props>(
  withFormik({
    validateOnMount: true,
    mapPropsToValues: ({
      initial,
      id,
      identifier,
    }: {
      initial: MarketingNotification;
      id: number;
      identifier: 'payment_pack' | 'private_pass';
    }) => {
      if (initial) {
        const {
          kind,
          email_design,
          push_notification_title,
          push_notification_content,
        } = initial;
        const {
          payment_pack_id,
          private_pass_id,
          days_left,
          credits_left,
          smartlist_include,
          smartlist_exclude,
          hours,
        } = initial.event_rules;
        const verboseNotifKind = getNotificationKind(initial);
        const creditNotificationKind = getPpCreditNotificationKind(initial);
        return {
          send_email: !!email_design,
          send_notification_push:
            push_notification_title !== '' || push_notification_content !== '',
          notificationContent: push_notification_content,
          notificationTitle: push_notification_title,
          kind,
          email_design,
          payment_pack_id,
          private_pass_id,
          days_left: Math.abs(days_left) || 0,
          credits_left: credits_left || 0,
          smartlist_include: smartlist_include || [],
          smartlist_exclude: smartlist_exclude || [],
          hours: Math.abs(hours) || 0,
          creditNotificationKind,
          verboseNotifKind,
          identifier,
        };
      }
      const values: InitialFormikValues = {
        send_email: true,
        send_notification_push: false,
        notificationContent: '',
        notificationTitle: '',
        kind:
          identifier === 'payment_pack'
            ? PAYMENT_PACK_EVENT_RULE.NOTIFICATION_CREDIT
            : PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
        email_design: null,
        payment_pack_id: identifier === 'payment_pack' ? id : null,
        private_pass_id: identifier === 'private_pass' ? id : null,
        days_left: 2,
        credits_left: 2,
        hours: 2,
        creditNotificationKind: 'onBooking',
        smartlist_include: [],
        smartlist_exclude: [],
        verboseNotifKind: 'creditsLeft',
        identifier,
      };
      return values;
    },
    validationSchema: ProductNotificationSchema,
    handleSubmit: (
      values: FinalFormikData,
      { props: { onSubmit, identifier } },
    ) => {
      const data: MarketingNotification = {
        kind: getKind(identifier, values),
        email_design: values.send_email ? values.email_design : null,
        push_notification_title: values.send_notification_push
          ? values.notificationTitle
          : '',
        push_notification_content: values.send_notification_push
          ? values.notificationContent
          : '',
        event_rules: {
          ...(identifier === 'payment_pack'
            ? {
                payment_pack_id: values.payment_pack_id,
              }
            : {
                private_pass_id: values.private_pass_id,
              }),
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
          if (identifier === 'payment_pack') {
            data.event_rules.hours = values.hours;
            data.event_rules.kind = getEventRulesKind(values);
          }
          data.event_rules.credits_left = values.credits_left;
          break;
      }
      onSubmit(data);
    },
  }),
)(ProductNotificationForm);
