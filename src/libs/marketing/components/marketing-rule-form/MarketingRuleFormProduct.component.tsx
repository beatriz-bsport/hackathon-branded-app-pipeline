import React, { useEffect } from 'react';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

import NotificationIcon from '@material-ui/icons/Notifications';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import EventIcon from '@material-ui/icons/Event';

import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';

import { PAYMENT_PACK_EVENT_RULE } from '@bsport/common/lib/master-data/notification-rule-events';
import { Divider, Switch } from '@material-ui/core';
import {
  TextField,
  IntegerField,
  RadioGroupField,
  Actions,
  Submit,
  // @ts-expect-error
} from '#components/forms';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { getCreditFactor } from '#libs/theme/selectors';

import {
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
} from '#libs/private-service/utils';
import {
  CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING,
  CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_OFFER_START,
} from '#libs/payment-packs/utils';
import { ResolvedGenericTags } from '#libs/email-editor/types';

import { getCreditsDividedValue } from '#libs/theme/utils';
import MarketingRuleSendingMethodField from '../MarketingRuleSendingMethodField.component';
import MarketingRuleSmartlistField from '../MarketingRuleSmartlistField.component';
import { MarketingNotification } from '../../types';

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
  disabled_if_in_contract: boolean;
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
  disabled_if_in_contract: boolean;
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
  onSubmitIntent: () => void;
  goToSmartlist: () => void;
  initial: MarketingNotification;
  values: FinalFormikData;
  setFieldValue: (key: string, value: any) => void;
  errors: any;
  isSubmitting: boolean;
  tags: { [tag_name: string]: string[] };
  resolvedGenericTags: ResolvedGenericTags;
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
    onSubmitIntent,
    goToSmartlist,
    initial,
    values,
    setFieldValue,
    errors,
    isSubmitting,
    tags,
    resolvedGenericTags,
  } = props;
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
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
    disabled_if_in_contract,
  } = values;

  useEffect(() => {
    if (initial) getEmailDetail(initial.email_design);
    getEmails();
    getSmartLists();
  }, [initial, getEmailDetail, getEmails, getSmartLists]);

  // @ts-expect-error
  if (verboseNotifKind !== 'creditsLeft' && credits_left === '') {
    setFieldValue('credits_left', 0);
  }
  // @ts-expect-error
  if (verboseNotifKind === 'creditsLeft' && days_left === '') {
    setFieldValue('days_left', 0);
  }
  return (
    <GenericResponsiveDrawer
      open
      onClose={onCancel}
      subtitle={
        identifier === 'payment_pack'
          ? t('notificationRule:tag.ConsumerPaymentPack.name')
          : t('notificationRule:tag.PrivateConsumerPass.name')
      }
      title={t('notificationForm')}
    >
      <Form>
        <Divider className={classes.divider} />
        <div id="select_notification_type">
          <div className={classes.fieldContainer}>
            <div className={classes.titleContainer}>
              <NotificationIcon color="action" />
              <Typography variant="h6">
                {t('notification.form.typeTitle')}
              </Typography>
            </div>

            <div className={classes.choiceField}>
              <RadioGroupField
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
                labelClass={classes.labelClass}
                name="verboseNotifKind"
              />
            </div>
            {verboseNotifKind === 'creditsLeft' && (
              <div className={classes.inlineContainer}>
                <Typography variant="body2">
                  {t('notification.creditsLeft.first')}
                </Typography>
                <TextField
                  className={classes.textInput}
                  name="credits_left"
                  type="number"
                />
                <Typography variant="body2">
                  {t('notification.creditsLeft.second')}
                </Typography>
              </div>
            )}

            {verboseNotifKind === 'daysLeft' && (
              <div className={classes.inlineContainer}>
                <Typography variant="body2">
                  {t('notification.daysLeft.first')}
                </Typography>
                <IntegerField className={classes.textInput} name="days_left" />
                <Typography variant="body2">
                  {t('notification.daysLeft.second')}
                </Typography>
              </div>
            )}

            {verboseNotifKind === 'daysPast' && (
              <div className={classes.inlineContainer}>
                <Typography variant="body2">
                  {t('notification.daysPast.first')}
                </Typography>
                <IntegerField className={classes.textInput} name="days_left" />
                <Typography variant="body2">
                  {t('notification.daysPast.second')}
                </Typography>
              </div>
            )}
          </div>
          {identifier === 'payment_pack' &&
            verboseNotifKind === 'creditsLeft' && (
              <>
                <Divider className={classes.divider} />
                <div className={classes.fieldContainer}>
                  <div className={classes.titleContainer}>
                    <EventIcon color="action" />
                    <Typography variant="h6">
                      {t('notificationRule:triggeringEvent.title')}
                    </Typography>
                  </div>
                  <div className={classes.choiceField}>
                    <RadioGroupField
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
                      labelClass={classes.labelClass}
                      name="creditNotificationKind"
                    />
                  </div>
                  <div className={classes.inlineContainer}>
                    <Typography variant="body2">
                      {t('notification.form.chooseTime.first')}
                    </Typography>
                    <IntegerField
                      className={classes.integerInput}
                      name="hours"
                    />
                    <Typography variant="body2">
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
              </>
            )}
          <Divider className={classes.divider} />
          <div className={classes.fieldContainer}>
            <div className={classes.titleContainer}>
              <CreditCardIcon color="action" />
              <Typography variant="h6">
                {t('notification.form.contractTitle')}
              </Typography>
            </div>
            <div className={classes.switchContainer}>
              <Switch
                checked={disabled_if_in_contract}
                onChange={() =>
                  setFieldValue(
                    'disabled_if_in_contract',
                    !disabled_if_in_contract,
                  )
                }
              />
              <Typography variant="body1">
                {t('notification.form.dontSendIfInContract')}
              </Typography>
            </div>
            <div className={classes.infoContainer}>
              <div className={classes.infoIcon}>
                <InfoOutlinedIcon color="inherit" />
              </div>
              <Typography className={classes.breakSpaces} variant="body2">
                {t('notification.form.infoContract')}
              </Typography>
            </div>
          </div>
        </div>
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
        <Actions>
          <Button
            disabled={isSubmitting}
            onClick={() => {
              onCancel();
            }}
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
            onClick={onSubmitIntent}
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
  choiceField: {
    marginLeft: theme.spacing(1.5),
    marginTop: theme.spacing(1.75),
    marginBottom: theme.spacing(1.75),
  },
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  fieldContainer: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  textInput: {
    width: '70px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  inlineContainer: {
    gap: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flex: {
    display: 'flex',
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    gap: theme.spacing(2),
  },
  infoIcon: {
    color: theme.palette.info.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(-1),
  },
  breakSpaces: {
    whiteSpace: 'break-spaces',
  },
  labelClass: {
    gap: theme.spacing(1),
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
  smartlist_include: Yup.array().of(Yup.number()),
  smartlist_exclude: Yup.array().of(Yup.number()),

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
          disabled_if_in_contract,
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
          credits_left: getCreditsDividedValue(credits_left || 0),
          smartlist_include: smartlist_include || [],
          smartlist_exclude: smartlist_exclude || [],
          hours: Math.abs(hours) || 0,
          creditNotificationKind,
          verboseNotifKind,
          identifier,
          disabled_if_in_contract: disabled_if_in_contract ?? true,
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
        disabled_if_in_contract: true,
      };
      return values;
    },
    validationSchema: ProductNotificationSchema,
    handleSubmit: (
      values: FinalFormikData,
      // @ts-expect-error
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
          disabled_if_in_contract: values.disabled_if_in_contract,
          smartlist_include: values.smartlist_include,
          smartlist_exclude: values.smartlist_exclude,
        },
      };
      switch (values.verboseNotifKind) {
        case 'daysLeft':
          data.event_rules.days_left = values.days_left;
          break;
        case 'daysPast':
          data.event_rules.days_left = values.days_left * -1;
          break;
        default:
          if (identifier === 'payment_pack') {
            data.event_rules.hours = values.hours;
            data.event_rules.kind = getEventRulesKind(values);
          }
          data.event_rules.credits_left =
            values.credits_left * getCreditFactor();
          break;
      }
      onSubmit(data);
    },
  }),
)(ProductNotificationForm);
