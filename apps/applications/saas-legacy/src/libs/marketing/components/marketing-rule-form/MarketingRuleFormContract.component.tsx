import React, { useEffect } from 'react';
import { Form, FormikProps, withFormik } from 'formik';
import { compose } from 'recompose';

import * as Yup from 'yup';
import { Button, Typography, FormControl, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import classNames from 'classnames';
import EventIcon from '@material-ui/icons/Event';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events.js';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import {
  IntegerField,
  RadioGroupField,
  Actions,
  Submit,
  // @ts-expect-error
} from '#src/components/forms';
import {
  EmailTemplateDetail,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import { MarketingNotification } from '../../types';
import MarketingRuleSendingMethodField from '../MarketingRuleSendingMethodField.component';
import MarketingRuleSmartlistField from '../MarketingRuleSmartlistField.component';

interface InitialFormikValues {
  send_email: boolean;
  send_notification_push: boolean;
  contractPeriod: string | null;
  triggeringEvent: string | null;
  periodScale: 'days' | 'hours';
  timeComparator: 'before' | 'after';
  email_design: number;
  notificationContent: string | null;
  notificationTitle: string | null;
  daysCountdown1: number | null;
  daysCountdown2: number | null;
}
interface FinalFormikData extends MarketingNotification {
  send_email: boolean;
  send_notification_push: boolean;
  contractPeriod: string | null;
  triggeringEvent: string | null;
  periodScale: 'days' | 'hours' | null;
  contract_id: number | null;
  timeComparator: 'before' | 'after';
  email_design: number;
  notificationContent: string | null;
  notificationTitle: string | null;
  daysCountdown1: number | null;
  daysCountdown2: number | null;
}

const CONTRACT_START = 'contractStart';
const CONTRACT_END = 'contractEnd';
const CONTRACT_CREATION = 'contractCreation';
const FIRST_BILLING = 'firstBilling';
const DAYS = 'days';
const HOURS = 'hours';
const BEFORE = 'before';
const AFTER = 'after';

const getEventRulesKind = (values: FinalFormikData) => {
  if (values.contractPeriod === CONTRACT_START) {
    return values.triggeringEvent === CONTRACT_CREATION
      ? NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION
      : NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING;
  }
  return NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END;
};

const getPeriodCount = (values: FinalFormikData) => {
  if (
    values.contractPeriod === CONTRACT_START &&
    values.triggeringEvent === CONTRACT_CREATION
  ) {
    return values.daysCountdown1;
  }

  return values.timeComparator === BEFORE
    ? -values.daysCountdown2
    : values.daysCountdown2;
};

const getContractPeriod = (initial: MarketingNotification) => {
  if (initial.kind === NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END) {
    return CONTRACT_END;
  }
  return CONTRACT_START;
};

const getTriggeringEvent = (initial: MarketingNotification) => {
  if (initial.kind === NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION) {
    return CONTRACT_CREATION;
  }
  return FIRST_BILLING;
};

type Props = {
  getEmails: () => void;
  getEmailDetail: (id: number) => void;
  emailListLoading: boolean;
  emails: Array<any>;
  emailDetailLoading: boolean;
  emailDetails: { [key: string]: EmailTemplateDetail };
  onCancel: () => void;
  initial: MarketingNotification;
  values: FinalFormikData;
  setFieldValue: (key: string, value: any) => void;
  errors: any;
  isSubmitting: boolean;
  tags: { [tag_name: string]: string[] };
  smartLists: Array<any>;
  getSmartLists: () => void;
  goToSmartlist: () => void;
  resolvedGenericTags: ResolvedGenericTags;
} & FormikProps<InitialFormikValues>;

const MarketingRuleFormContract = (props: Props) => {
  const {
    getEmails,
    getEmailDetail,
    emailListLoading,
    emails,
    emailDetailLoading,
    emailDetails,
    onCancel,
    initial,
    values,
    setFieldValue,
    errors,
    isSubmitting,
    tags,
    smartLists,
    getSmartLists,
    goToSmartlist,
    resolvedGenericTags,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation(['subscription', 'notificationRule']);
  useEffect(() => {
    if (initial) getEmailDetail(initial.email_design);
    getEmails();
    getSmartLists();
  }, [initial, getEmailDetail, getEmails, getSmartLists]);

  const {
    contractPeriod,
    triggeringEvent,
    periodScale,
    timeComparator,
    send_email,
    send_notification_push,
    email_design,
    notificationContent,
    notificationTitle,
    daysCountdown1,
    daysCountdown2,
    smartlist_exclude,
    smartlist_include,
  } = values;

  return (
    <GenericResponsiveDrawer
      open
      mobileMinWidth="0px"
      onClose={props.onCancel}
      subtitle={t('notificationForm.subtitle')}
      title={t('notificationForm.title')}
    >
      <div
        className={classNames({
          [classes.paddingBottomEMailSelector]:
            send_email && !send_notification_push,
        })}
      >
        <Form>
          <div className={classes.warningContainer}>
            <div className={classes.infoIcon}>
              <InfoOutlinedIcon color="inherit" />
            </div>
            <Typography className={classes.breakSpaces} variant="body2">
              {t('notificationForm.warning')}
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.fieldContainer}>
            <div className={classes.titleContainer}>
              <AccessTimeIcon color="action" />
              <Typography variant="h6">
                {t('notificationForm.typeSection.title')}
              </Typography>
            </div>
            <div className={classes.choiceField}>
              <RadioGroupField
                choices={[
                  {
                    label: t('notificationForm.typeSection.contractStart'),
                    value: CONTRACT_START,
                  },
                  {
                    label: t('notificationForm.typeSection.contractEnd'),
                    value: CONTRACT_END,
                  },
                ]}
                name="contractPeriod"
                value={contractPeriod}
              />
            </div>
          </div>
          {contractPeriod === CONTRACT_START && (
            <>
              <Divider className={classes.divider} />
              <div className={classes.fieldContainer}>
                <div className={classes.titleContainer}>
                  <EventIcon color="action" />
                  <Typography variant="h6">
                    {t('notificationForm.triggeringEvent.title')}
                  </Typography>
                </div>
                <div className={classes.choiceField}>
                  <RadioGroupField
                    choices={[
                      {
                        label: t(
                          'notificationForm.triggeringEvent.contractCreation',
                        ),
                        value: CONTRACT_CREATION,
                      },
                      {
                        label: t(
                          'notificationForm.triggeringEvent.firstBilling',
                        ),
                        value: FIRST_BILLING,
                      },
                    ]}
                    name="triggeringEvent"
                  />
                </div>
              </div>
            </>
          )}
          {contractPeriod === CONTRACT_START &&
            triggeringEvent === CONTRACT_CREATION && (
              <>
                <Divider className={classes.divider} />
                <div className={classes.fieldContainer}>
                  <div className={classes.titleContainer}>
                    <NotificationsIcon color="action" />
                    <Typography variant="h6">
                      {t('notificationForm.notificationType.title')}
                    </Typography>
                  </div>
                  <div className={classes.rowContainer}>
                    <Typography className={classes.breakSpaces} variant="body2">
                      {t('notificationRule:type.sendNotification')}
                    </Typography>
                    <IntegerField
                      className={classes.integerField}
                      name="daysCountdown1"
                    />
                    <FormControl className={classes.select} variant="outlined">
                      <Select
                        defaultValue={{
                          value: periodScale,
                          label: t(`notificationRule:type.${periodScale}`),
                        }}
                        name="periodScale"
                        onChange={(selected) =>
                          // @ts-expect-error
                          setFieldValue('periodScale', selected.value)
                        }
                        options={[
                          {
                            value: DAYS,
                            label: t('notificationForm.notificationType.day', {
                              count: daysCountdown1,
                            }),
                          },
                          {
                            value: HOURS,
                            label: t('notificationForm.notificationType.hour', {
                              count: daysCountdown1,
                            }),
                          },
                        ]}
                      />
                    </FormControl>
                    <Typography className={classes.breakSpaces} variant="body2">
                      {t(
                        'notificationForm.notificationType.afterSubcriptionCreation',
                      ).toLowerCase()}
                    </Typography>
                  </div>
                </div>
              </>
            )}
          <Divider className={classes.divider} />
          {contractPeriod === CONTRACT_START &&
            triggeringEvent === FIRST_BILLING && (
              <>
                <Divider className={classes.divider} />
                <div className={classes.fieldContainer}>
                  <div className={classes.titleContainer}>
                    <NotificationsIcon color="action" />
                    <Typography variant="h6">
                      {t('notificationForm.notificationType.title')}
                    </Typography>
                  </div>
                  <div className={classes.rowContainer}>
                    <Typography className={classes.breakSpaces} variant="body2">
                      {t('notificationRule:type.sendNotification')}
                    </Typography>
                    <IntegerField
                      className={classes.integerField}
                      name="daysCountdown2"
                    />
                    <FormControl className={classes.select} variant="outlined">
                      <Select
                        defaultValue={{
                          value: periodScale,
                          label: t(`notificationRule:type.${periodScale}`),
                        }}
                        name="periodScale"
                        onChange={(selected) =>
                          // @ts-expect-error
                          setFieldValue('periodScale', selected.value)
                        }
                        options={[
                          {
                            value: DAYS,
                            label: t('notificationForm.notificationType.day', {
                              count: daysCountdown2,
                            }),
                          },
                          {
                            value: HOURS,
                            label: t('notificationForm.notificationType.hour', {
                              count: daysCountdown2,
                            }),
                          },
                        ]}
                      />
                    </FormControl>
                    <FormControl className={classes.select} variant="outlined">
                      <Select
                        defaultValue={{
                          value: timeComparator,
                          label: t(
                            `notificationForm.notificationType.${timeComparator}`,
                          ),
                        }}
                        name="timeComparator"
                        onChange={(selected) =>
                          // @ts-expect-error
                          setFieldValue('timeComparator', selected.value)
                        }
                        options={[
                          {
                            value: BEFORE,
                            label: t(
                              'notificationForm.notificationType.before',
                            ),
                          },
                          {
                            value: AFTER,
                            label: t('notificationForm.notificationType.after'),
                          },
                        ]}
                      />
                    </FormControl>
                    <Typography className={classes.breakSpaces} variant="body2">
                      {t(
                        'notificationForm.notificationType.firstBilling',
                      ).toLowerCase()}
                    </Typography>
                  </div>
                  {periodScale === DAYS && (
                    <div
                      className={classNames(
                        classes.warningContainer,
                        classes.spacingTop,
                      )}
                    >
                      <div className={classes.infoIcon}>
                        <InfoOutlinedIcon color="inherit" />
                      </div>
                      <Typography
                        className={classes.breakSpaces}
                        variant="body2"
                      >
                        {t('notificationForm.notificationType.warningDayFirst')}
                      </Typography>
                    </div>
                  )}
                  {periodScale === HOURS && (
                    <div
                      className={classNames(
                        classes.warningContainer,
                        classes.spacingTop,
                      )}
                    >
                      <div className={classes.infoIcon}>
                        <InfoOutlinedIcon color="inherit" />
                      </div>
                      <Typography
                        className={classNames([classes.breakSpaces])}
                        variant="body2"
                      >
                        {t(
                          'notificationForm.notificationType.warningHourFirst',
                        )}
                      </Typography>
                    </div>
                  )}
                </div>
              </>
            )}
          {contractPeriod === CONTRACT_END && (
            <>
              <Divider className={classes.divider} />
              <div className={classes.fieldContainer}>
                <div className={classes.titleContainer}>
                  <NotificationsIcon color="action" />
                  <Typography variant="h6">
                    {t('notificationForm.notificationType.title')}
                  </Typography>
                </div>
                <div className={classes.rowContainer}>
                  <Typography className={classes.breakSpaces} variant="body2">
                    {t('notificationRule:type.sendNotification')}
                  </Typography>
                  <IntegerField
                    className={classes.integerField}
                    name="daysCountdown2"
                  />
                  <FormControl className={classes.select} variant="outlined">
                    <Select
                      defaultValue={{
                        value: periodScale,
                        label: t(`notificationRule:type.${periodScale}`),
                      }}
                      name="periodScale"
                      onChange={(selected) =>
                        // @ts-expect-error
                        setFieldValue('periodScale', selected.value)
                      }
                      options={[
                        {
                          value: DAYS,
                          label: t('notificationForm.notificationType.day', {
                            count: daysCountdown2,
                          }),
                        },
                        {
                          value: HOURS,
                          label: t('notificationForm.notificationType.hour', {
                            count: daysCountdown2,
                          }),
                        },
                      ]}
                    />
                  </FormControl>
                  <FormControl className={classes.select} variant="outlined">
                    <Select
                      defaultValue={{
                        value: timeComparator,
                        label: t(
                          `notificationForm.notificationType.${timeComparator}`,
                        ),
                      }}
                      name="timeComparator"
                      onChange={(selected) =>
                        // @ts-expect-error
                        setFieldValue('timeComparator', selected.value)
                      }
                      options={[
                        {
                          value: BEFORE,
                          label: t('notificationForm.notificationType.before'),
                        },
                        {
                          value: AFTER,
                          label: t('notificationForm.notificationType.after'),
                        },
                      ]}
                    />
                  </FormControl>
                  <Typography className={classes.breakSpaces} variant="body2">
                    {t(
                      'notificationForm.notificationType.contractEnd',
                    ).toLowerCase()}
                  </Typography>
                </div>
                {periodScale === DAYS && (
                  <div
                    className={classNames(
                      classes.warningContainer,
                      classes.spacingTop,
                    )}
                  >
                    <div className={classes.infoIcon}>
                      <InfoOutlinedIcon color="inherit" />
                    </div>
                    <Typography className={classes.breakSpaces} variant="body2">
                      {t('notificationForm.notificationType.warningDayLast')}
                    </Typography>
                  </div>
                )}
                {periodScale === HOURS && (
                  <div
                    className={classNames(
                      classes.warningContainer,
                      classes.spacingTop,
                    )}
                  >
                    <div className={classes.infoIcon}>
                      <InfoOutlinedIcon color="inherit" />
                    </div>
                    <Typography
                      className={classNames([classes.breakSpaces])}
                      variant="body2"
                    >
                      {t('notificationForm.notificationType.warningHourLast')}
                    </Typography>
                  </div>
                )}
              </div>
            </>
          )}
          <MarketingRuleSmartlistField
            goToSmartList={goToSmartlist}
            smartlist_exclude={smartlist_exclude}
            smartlist_include={smartlist_include}
            smartLists={smartLists}
          />
          <MarketingRuleSendingMethodField
            email_design={email_design}
            emailDetailLoading={emailDetailLoading}
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
            <Button disabled={isSubmitting} onClick={onCancel}>
              {t('notificationForm.buttons.cancel')}
            </Button>
            <Submit
              color="primary"
              disabled={
                !!errors.contractPeriod ||
                !!errors.triggeringEvent ||
                !!errors.email_design ||
                !!errors.notificationContent ||
                !!errors.atLeastOneChannel ||
                isSubmitting
              }
            >
              {t('notificationForm.buttons.submit')}
            </Submit>
          </Actions>
        </Form>
      </div>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  paddingBottomEMailSelector: { paddingBottom: theme.spacing(25) },
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    gap: theme.spacing(2),
  },
  infoIcon: {
    color: theme.palette.info.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  breakSpaces: {
    whiteSpace: 'break-spaces',
  },
  fieldContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  choiceField: {
    marginLeft: theme.spacing(1.5),
    marginTop: theme.spacing(1.75),
  },
  select: {
    minWidth: theme.spacing(20),
  },
  integerField: {
    width: theme.spacing(10),
  },
  spacingTop: {
    marginTop: theme.spacing(2),
  },
  flex: {
    display: 'flex',
  },
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(1) },
  padding: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
}));

const MarketingRuleFormContractSchema = Yup.object().shape({
  contract_id: Yup.number().required(),
  contractPeriod: Yup.string().required(),
  triggeringEvent: Yup.string().when('contractPeriod', {
    is: CONTRACT_START,
    then: Yup.string().required(),
    otherwise: Yup.string().nullable(),
  }),
  periodScale: Yup.string().required(),
  timeComparator: Yup.string().when('contractPeriod', {
    is: CONTRACT_END,
    then: Yup.string().required(),
    otherwise: Yup.string().when('triggeringEvent', {
      is: FIRST_BILLING,
      then: Yup.string().required(),
      otherwise: Yup.string().nullable(),
    }),
  }),
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

export default compose<any, Props>(
  withFormik({
    validateOnMount: true,
    mapPropsToValues: ({
      initial,
      id,
    }: {
      initial: MarketingNotification;
      id: number;
    }) => {
      if (initial) {
        const {
          email_design,
          push_notification_title,
          push_notification_content,
        } = initial;
        const {
          contract_id,
          days,
          hours,
          smartlist_include,
          smartlist_exclude,
        } = initial.event_rules;
        return {
          send_email: !!email_design,
          send_notification_push:
            push_notification_title !== '' || push_notification_content !== '',
          contractPeriod: getContractPeriod(initial),
          triggeringEvent: getTriggeringEvent(initial),
          periodScale: days === null ? HOURS : DAYS,
          contract_id,
          timeComparator: (days || hours) > 0 ? AFTER : BEFORE,
          email_design,
          notificationContent: push_notification_content,
          notificationTitle: push_notification_title,
          daysCountdown1: Math.abs(days || hours),
          daysCountdown2: Math.abs(days || hours),
          smartlist_include: smartlist_include || [],
          smartlist_exclude: smartlist_exclude || [],
        };
      }
      return {
        contractPeriod: CONTRACT_START,
        triggeringEvent: CONTRACT_CREATION,
        periodScale: DAYS,
        timeComparator: BEFORE,
        daysCountdown1: 0,
        daysCountdown2: 1,
        contract_id: id,
        send_email: true,
        send_notification_push: false,
        notificationContent: '',
        notificationTitle: '',
        smartlist_include: [],
        smartlist_exclude: [],
      };
    },
    validationSchema: MarketingRuleFormContractSchema,

    // @ts-expect-error
    handleSubmit: (
      values: FinalFormikData,
      // @ts-expect-error
      { props: { onSubmit }, setSubmitting },
    ) => {
      const data: MarketingNotification = {
        kind: getEventRulesKind(values),
        email_design: values.send_email ? values.email_design : null,
        push_notification_title: values.send_notification_push
          ? values.notificationTitle
          : '',
        push_notification_content: values.send_notification_push
          ? values.notificationContent
          : '',
        event_rules: {
          contract_id: values.contract_id,
          days: values.periodScale === DAYS ? getPeriodCount(values) : null,
          hours: values.periodScale === HOURS ? getPeriodCount(values) : null,
          smartlist_include: values.smartlist_include,
          smartlist_exclude: values.smartlist_exclude,
        },
      };
      onSubmit(data, {
        onSuccess: () => setSubmitting(false),
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  }),
)(MarketingRuleFormContract);
