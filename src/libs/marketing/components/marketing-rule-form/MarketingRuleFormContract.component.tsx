import React, { useState, useEffect } from 'react';
import { Form, FormikProps, withFormik } from 'formik';
import { compose } from 'recompose';

import * as Yup from 'yup';
import {
  Button,
  Typography,
  FormControl,
  Collapse,
  Divider,
  CircularProgress,
  LinearProgress,
  Grid,
  ButtonBase,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import classNames from 'classnames';
import SendIcon from '@material-ui/icons/Send';
import EventIcon from '@material-ui/icons/Event';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import InfoIcon from '@material-ui/icons/Info';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import { TFunction } from 'i18next';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
import WarningIcon from '@material-ui/icons/Warning';
import Tooltip from '#components/Tooltip.component';
import { MAX_LENGTH_PUSH_TITLE } from '#libs/communication/constant';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
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
import { MaterialUiMultiSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import { MarketingNotification } from '../../types';
import NotificationContentInput from '#libs/communication/components/NotificationContentInput.component';
import type { FeatureList } from '#libs/company/types';
import { EmailTemplateDetail } from '#libs/email-editor/types';
import { OptionTypeBase } from '#components/Selector/MaterialUISelector.component';

interface InitialFormikValues {
  send_email: boolean;
  send_notification_push: boolean;
  contractPeriod: string | null;
  triggeringEvent: string | null;
  periodScale: string | null;
  timeComparator: string | null;
  emailDesign: number;
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
  periodScale: string | null;
  contract_id: number | null;
  timeComparator: string | null;
  emailDesign: number;
  notificationContent: string | null;
  notificationTitle: string | null;
  daysCountdown1: number | null;
  daysCountdown2: number | null;
}

const CONTRACT_START = 'contractStart';
const CONTRACT_END = 'contractEnd';
const CONTRACT_CREATION = 'contractCreation';
const FIRST_BILLING = 'firstBilling';
const DAY = 'day';
const HOUR = 'hour';
const BEFORE = 'before';
const AFTER = 'after';

const renderEmptyOrLoading = (
  loading: boolean,
  emails: Array<any>,
  t: TFunction,
  classes: Object,
) => {
  if (loading) {
    return <CircularProgress />;
  }
  if (!emails?.length) {
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
  } = props;
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const [displayEmailPreview, setDisplayEmailPreview] = useState(false);
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
  const [openAdvancedOptions, setOpenAdvancedOptions] =
    useState<boolean>(false);

  const {
    contractPeriod,
    triggeringEvent,
    periodScale,
    timeComparator,
    send_email,
    send_notification_push,
    emailDesign,
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
      onClose={props.onCancel}
      title={t('notificationForm.title')}
      subtitle={t('notificationForm.subtitle')}
      mobileMinWidth="0px"
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
            <Typography
              variant="body2"
              className={classNames([classes.breakSpaces])}
            >
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
                name="contractPeriod"
                value={contractPeriod}
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
                    name="triggeringEvent"
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
                    <Typography variant="body2" className={classes.breakSpaces}>
                      {t('notificationForm.notificationType.sendNotification')}
                    </Typography>
                    <IntegerField
                      className={classes.integerField}
                      name="daysCountdown1"
                    />
                    <FormControl className={classes.select} variant="outlined">
                      <Select
                        name="periodScale"
                        defaultValue={{
                          value: periodScale,
                          label: t(
                            `notificationForm.notificationType.${periodScale}`,
                            {
                              count: daysCountdown1,
                            },
                          ),
                        }}
                        onChange={(selected) =>
                          setFieldValue('periodScale', selected.value)
                        }
                        options={[
                          {
                            value: DAY,
                            label: t('notificationForm.notificationType.day', {
                              count: daysCountdown1,
                            }),
                          },
                          {
                            value: HOUR,
                            label: t('notificationForm.notificationType.hour', {
                              count: daysCountdown1,
                            }),
                          },
                        ]}
                      />
                    </FormControl>
                    <Typography variant="body2" className={classes.breakSpaces}>
                      {t(
                        'notificationForm.notificationType.afterSubcriptionCreation',
                      ).toLowerCase()}
                    </Typography>
                  </div>
                </div>
              </>
            )}
          <Divider className={classes.divider} />
          <div className={classes.advancedOptionsSection}>
            <Grid container spacing={4}>
              <div className={classes.row}>
                <ButtonBase
                  onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
                  className={classes.advancedOptionsHeader}
                >
                  <div className={classes.rowLeft}>
                    <SettingsIcon className={classes.icon} />
                    <Typography variant="h6">
                      {t('notificationForm.smartLists.advanced')}
                    </Typography>
                  </div>
                  {openAdvancedOptions ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ButtonBase>
              </div>
              <Collapse in={openAdvancedOptions} style={{ width: '100%' }}>
                <div className={classes.smartListSelector}>
                  <Typography variant="caption">
                    {t('notificationForm.smartLists.smartListHelper')}
                  </Typography>
                  <MaterialUiMultiSelectorField
                    name="smartlist_exclude"
                    options={
                      smartListSelectOptions ? [...smartListSelectOptions] : []
                    }
                    placeholder={t(
                      'notificationForm.smartLists.smartListSelection',
                    )}
                    isMulti
                    isClearable
                    value={smartListSelectOptions?.filter((opt) =>
                      smartlist_exclude?.includes(opt?.value),
                    )}
                  />
                </div>
                <div className={classes.smartListSelector}>
                  <Typography variant="caption">
                    {t('notificationForm.smartLists.smartListHelperInclude')}
                  </Typography>
                  <MaterialUiMultiSelectorField
                    name="smartlist_include"
                    options={
                      smartListSelectOptions ? [...smartListSelectOptions] : []
                    }
                    placeholder={t(
                      'notificationForm.smartLists.smartListSelection',
                    )}
                    isMulti
                    isClearable
                    value={smartListSelectOptions?.filter((opt) =>
                      smartlist_include?.includes(opt?.value),
                    )}
                  />
                </div>
                {!smartlist_include.length && !smartlist_exclude.length && (
                  <div className={classes.warningContainerSmartlist}>
                    <WarningIcon className={classes.warningIcon} />
                    <Typography
                      variant="body2"
                      className={classes.warningContent}
                    >
                      {t('notificationForm.smartLists.warning')}
                      sheehd
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={goToSmartlist}
                      className={classes.createSmartList}
                    >
                      {t('notificationForm.smartLists.createSmartList')}
                    </Button>
                  </div>
                )}
              </Collapse>
            </Grid>
          </div>
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
                    <Typography variant="body2" className={classes.breakSpaces}>
                      {t('notificationForm.notificationType.sendNotification')}
                    </Typography>
                    <IntegerField
                      className={classes.integerField}
                      name="daysCountdown2"
                    />
                    <FormControl className={classes.select} variant="outlined">
                      <Select
                        name="periodScale"
                        defaultValue={{
                          value: periodScale,
                          label: t(
                            `notificationForm.notificationType.${periodScale}`,
                            {
                              count: daysCountdown2,
                            },
                          ),
                        }}
                        onChange={(selected) =>
                          setFieldValue('periodScale', selected.value)
                        }
                        options={[
                          {
                            value: DAY,
                            label: t('notificationForm.notificationType.day', {
                              count: daysCountdown2,
                            }),
                          },
                          {
                            value: HOUR,
                            label: t('notificationForm.notificationType.hour', {
                              count: daysCountdown2,
                            }),
                          },
                        ]}
                      />
                    </FormControl>
                    <FormControl className={classes.select} variant="outlined">
                      <Select
                        name="timeComparator"
                        defaultValue={{
                          value: timeComparator,
                          label: t(
                            `notificationForm.notificationType.${timeComparator}`,
                          ),
                        }}
                        onChange={(selected) =>
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
                    <Typography variant="body2" className={classes.breakSpaces}>
                      {t(
                        'notificationForm.notificationType.firstBilling',
                      ).toLowerCase()}
                    </Typography>
                  </div>
                  {periodScale === DAY && (
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
                        variant="body2"
                        className={classNames([classes.breakSpaces])}
                      >
                        {t('notificationForm.notificationType.warningDayFirst')}
                      </Typography>
                    </div>
                  )}
                  {periodScale === HOUR && (
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
                        variant="body2"
                        className={classNames([classes.breakSpaces])}
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
                  <Typography variant="body2" className={classes.breakSpaces}>
                    {t('notificationForm.notificationType.sendNotification')}
                  </Typography>
                  <IntegerField
                    className={classes.integerField}
                    name="daysCountdown2"
                  />
                  <FormControl className={classes.select} variant="outlined">
                    <Select
                      name="periodScale"
                      defaultValue={{
                        value: periodScale,
                        label: t(
                          `notificationForm.notificationType.${periodScale}`,
                          {
                            count: daysCountdown2,
                          },
                        ),
                      }}
                      onChange={(selected) =>
                        setFieldValue('periodScale', selected.value)
                      }
                      options={[
                        {
                          value: DAY,
                          label: t('notificationForm.notificationType.day', {
                            count: daysCountdown2,
                          }),
                        },
                        {
                          value: HOUR,
                          label: t('notificationForm.notificationType.hour', {
                            count: daysCountdown2,
                          }),
                        },
                      ]}
                    />
                  </FormControl>
                  <FormControl className={classes.select} variant="outlined">
                    <Select
                      name="timeComparator"
                      defaultValue={{
                        value: timeComparator,
                        label: t(
                          `notificationForm.notificationType.${timeComparator}`,
                        ),
                      }}
                      onChange={(selected) =>
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
                  <Typography variant="body2" className={classes.breakSpaces}>
                    {t(
                      'notificationForm.notificationType.contractEnd',
                    ).toLowerCase()}
                  </Typography>
                </div>
                {periodScale === DAY && (
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
                      variant="body2"
                      className={classNames([classes.breakSpaces])}
                    >
                      {t('notificationForm.notificationType.warningDayLast')}
                    </Typography>
                  </div>
                )}
                {periodScale === HOUR && (
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
                      variant="body2"
                      className={classNames([classes.breakSpaces])}
                    >
                      {t('notificationForm.notificationType.warningHourLast')}
                    </Typography>
                  </div>
                )}
              </div>
            </>
          )}
          <Divider className={classes.divider} />
          <div className={classes.fieldContainer}>
            <div className={classes.titleContainer}>
              <SendIcon color="action" />
              <Typography variant="h6">
                {t('notificationForm.sendingMethod.title')}
              </Typography>
            </div>
            <div className={classes.choiceField}>
              <CheckboxField
                name="send_email"
                label={t('notificationForm.sendingMethod.email')}
                checked={send_email}
              />
              <FeatureListProvider>
                {(featureList: FeatureList) => {
                  const hasUpsell =
                    featureList.upsell &&
                    featureList.upsell.find(
                      (f) => f.readable_identifier === 'push_notification',
                    );
                  return (
                    <Tooltip
                      title={t('booking:notification.form.needPushUpsell')}
                      hide={hasUpsell}
                      placement="bottom-start"
                    >
                      <div className={classes.flex}>
                        <CheckboxField
                          name="send_notification_push"
                          label={t(
                            'notificationForm.sendingMethod.notificationPush',
                          )}
                          checked={send_notification_push}
                          disabled={!hasUpsell}
                        />
                      </div>
                    </Tooltip>
                  );
                }}
              </FeatureListProvider>
            </div>
            {send_notification_push && (
              <Typography variant="caption" color="textSecondary">
                {t('notificationForm.notificationPush.warning')}
              </Typography>
            )}
            {send_email && (
              <>
                <Typography
                  className={classNames(
                    [classes.spacingTop],
                    [classes.spacingBottom],
                  )}
                  variant="subtitle2"
                >
                  {t('notificationForm.emailNotification.parameters')}
                </Typography>
                <Typography
                  variant="caption"
                  className={classNames({
                    [classes.errorText]: errors.emailDesign,
                  })}
                >
                  {t('notificationForm.emailNotification.emailToSend')}
                </Typography>
                {emailListLoading ? (
                  <LinearProgress className={classes.selectorContainer} />
                ) : (
                  <div className={classes.selectorContainer}>
                    <EmailSelector
                      emails={emails}
                      value={emailDesign}
                      onChange={(ev) => {
                        setFieldValue('emailDesign', ev ? ev.value : null);
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
                      setDisplayEmailPreview((prevDisplay) => !prevDisplay)
                    }
                  >
                    {displayEmailPreview ? (
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
                <Collapse in={displayEmailPreview}>
                  <div className={classes.emailPreview}>
                    {emailDesign && !!emailDetails[emailDesign] ? (
                      <div>
                        <div
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{
                            __html: emailDetails
                              ? emailDetails[emailDesign].html
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
              </>
            )}
            {send_notification_push && (
              <div className={classes.fieldContainer}>
                <Typography
                  variant="subtitle2"
                  className={classNames(
                    [classes.spacingTop],
                    [classes.spacingBottom],
                    {
                      [classes.errorText]: errors.notificationContent,
                    },
                  )}
                >
                  {t('paymentPack:notification.form.pushTitle')}
                </Typography>
                <TextField
                  label={t('communication:mail.titleNotification')}
                  name="notificationTitle"
                  fullWidth
                  inputProps={{ maxLength: MAX_LENGTH_PUSH_TITLE }}
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
          </div>

          <Actions>
            <Button onClick={onCancel} disabled={isSubmitting}>
              {t('notificationForm.buttons.cancel')}
            </Button>
            <Submit
              color="primary"
              disabled={
                !!errors.contractPeriod ||
                !!errors.triggeringEvent ||
                !!errors.emailDesign ||
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

  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  inlineContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emailPreview: {
    border: '1px solid grey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    minHeight: '30vh',
    minWidth: '40vh',
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
  visibilityIcon: {
    marginRight: theme.spacing(1),
  },
  errorText: {
    color: 'red',
  },
  spacingTop: {
    marginTop: theme.spacing(2),
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
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },

  smartListSelector: {
    marginTop: theme.spacing(2),
  },
  warningContainerSmartlist: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    justifyContent: 'space-between',
  },
  warningContent: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(2),
    color: theme.palette.warning.main,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  createSmartList: {
    borderColor: theme.palette.warning.main,
    color: theme.palette.warning.main,
  },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(1) },
  row: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    color: '#868686',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  advancedOptionsSection: {
    paddingTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  padding: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  rowLeft: { display: 'flex', gap: theme.spacing(2), alignItems: 'center' },
  advancedOptionsHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emailDesign: Yup.number().when('send_email', {
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
          periodScale: days === null ? HOUR : DAY,
          contract_id,
          timeComparator: (days || hours) > 0 ? AFTER : BEFORE,
          emailDesign: email_design,
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
        periodScale: DAY,
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

    handleSubmit: (
      values: FinalFormikData,
      { props: { onSubmit }, setSubmitting },
    ) => {
      const data: MarketingNotification = {
        kind: getEventRulesKind(values),
        email_design: values.send_email ? values.emailDesign : null,
        push_notification_title: values.send_notification_push
          ? values.notificationTitle
          : '',
        push_notification_content: values.send_notification_push
          ? values.notificationContent
          : '',
        event_rules: {
          contract_id: values.contract_id,
          days: values.periodScale === DAY ? getPeriodCount(values) : null,
          hours: values.periodScale === HOUR ? getPeriodCount(values) : null,
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
