import React from 'react';

import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import { FormikErrors } from 'formik';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import SendIcon from '@material-ui/icons/Send';
import Card from '@material-ui/core/Card';
import EmailIcon from '@material-ui/icons/Email';
import SmsIcon from '@material-ui/icons/Sms';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LabelIcon from '@material-ui/icons/Label';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import IconButton from '@material-ui/core/IconButton';

import SelectTemplate from '#libs/communication/components/SelectTemplate.component';
import WriteEmail from '#libs/communication/components/WriteEmail.component';
import WriteSMS from '#libs/communication/components/WriteSMS.component';
import WriteNotification from '#libs/communication/components/WriteNotification.component';
import TagSelector from '#libs/tag/components/TagSelector.selector';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import {
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  CADENCE_MARKETING_ACTION_SMS,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  CADENCE_MARKETING_ACTION_CHOICES,
  CadenceMarketingActionsEnum,
} from '#libs/sequential_marketing/constants';

import type {
  EmailTemplate,
  EmailTemplateDetail,
} from '#libs/email-editor/types';
import type { Tag, TagGroup } from '#libs/tag/types';

import useFeaturesProvider from '#libs/company/hooks/feature-list-provider.hook ';

const MarketingActionIconEnum = {
  [CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]: EmailIcon,
  [CADENCE_MARKETING_ACTION_SMS]: SmsIcon,
  [CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]: NotificationsIcon,
  [CADENCE_MARKETING_ACTION_TAG_MANAGEMENT]: LabelIcon,
  [CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]: LibraryBooksIcon,
};

const MarktingIconLabel = {
  [CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_WRITTEN_EMAIL}`,
  [CADENCE_MARKETING_ACTION_SMS]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_SMS}`,
  [CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION}`,
  [CADENCE_MARKETING_ACTION_TAG_MANAGEMENT]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_TAG_MANAGEMENT}`,
  [CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE}`,
};

export type MarketingActionsValues = {
  [CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]: {
    configured: boolean;
    title: string;
    content: string;
  };
  [CADENCE_MARKETING_ACTION_SMS]: {
    configured: boolean;
    content: string;
  };
  [CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]: {
    configured: boolean;
    title: string;
    content: string;
  };
  [CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]: {
    configured: boolean;
    email_design_id: number | null;
    title: string;
  };
  [CADENCE_MARKETING_ACTION_TAG_MANAGEMENT]: {
    configured: boolean;
    tag_id: number | null;
  };
};

type Props = {
  selectedMarketingActions: CadenceMarketingActionsEnum;
  handleResetMarketingAction: (item: CadenceMarketingActionsEnum) => void;
  handleMarketingActionChange: (item: CadenceMarketingActionsEnum) => void;
  handleWrittenEmailContentChange: (content: string) => void;
  handleWrittenEmailTitleChange: (title: string) => void;
  handleSmsContentChange: (content: string) => void;
  handlePushNotificationTitleChange: (title: string) => void;
  handlePushNotificationContentChange: (content: string) => void;
  handleEmailTemplateTitleChange: (title: string) => void;
  handleSelectEmailDesign: (id: number) => void;
  onCancel: () => void;
  getEmailDetail: (id: number) => void;
  emailListLoading: boolean;
  emailDetailLoading: boolean;
  emails: EmailTemplate[];
  emailDetails: EmailTemplateDetail[];
  tagList: Array<Tag<TagGroup>>;
  marketing_actions: MarketingActionsValues;
  errors: FormikErrors<MarketingActionsValues>;
};

const MarketingActionsForm: React.FC<Props> = ({
  selectedMarketingActions,
  marketing_actions,
  errors,
  handleResetMarketingAction,
  handleMarketingActionChange,
  handleWrittenEmailContentChange,
  handleWrittenEmailTitleChange,
  handleSmsContentChange,
  handlePushNotificationTitleChange,
  handlePushNotificationContentChange,
  handleEmailTemplateTitleChange,
  handleSelectEmailDesign,
  onCancel,
  getEmailDetail,
  emailListLoading,
  emailDetailLoading,
  emails,
  emailDetails,
  tagList,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const { pushNotificationEnabled, smsEnabled, featuresLoading } =
    useFeaturesProvider();

  return (
    <div className={classes.marketingActionsContainer}>
      <Divider />
      <div className={classes.titleWithIcon}>
        <SendIcon className={classes.icon} />
        <Typography variant="h6">
          {t('cadence.form.trigger.marketing_actions')}
        </Typography>
      </div>
      <div className={classes.alertContainer}>
        <Alert severity="info" className={classes.alert}>
          {t('cadence.form.trigger.select_marketing_actions_helper')}
        </Alert>
      </div>
      <div className={classes.cardsContainer}>
        {CADENCE_MARKETING_ACTION_CHOICES.map((item) => {
          const disabled =
            (item === CADENCE_MARKETING_ACTION_SMS &&
              (!pushNotificationEnabled || featuresLoading)) ||
            (item === CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION &&
              (!smsEnabled || featuresLoading));
          return (
            <div
              key={`reset_marketing_action_button${item}`}
              className={classes.cardContainer}
            >
              {marketing_actions &&
                marketing_actions[item]?.configured &&
                selectedMarketingActions !== item && (
                  <div
                    className={classNames(
                      classes.topRightIconButton,
                      classes.configuredIconContainer,
                    )}
                  >
                    <DoneAllIcon
                      fontSize="small"
                      className={classes.configuredIcon}
                    />
                  </div>
                )}
              {selectedMarketingActions === item && (
                <IconButton
                  className={classes.topRightIconButton}
                  onClick={() => handleMarketingActionChange(null)}
                >
                  <CancelIcon fontSize="small" color="error" />
                </IconButton>
              )}
              <ButtonBase
                disabled={disabled}
                onClick={() => handleMarketingActionChange(item)}
                key={`marketing_action_card${item}`}
              >
                <Card
                  className={classNames(classes.cardOutter, {
                    [classes.borderOutlined]:
                      marketing_actions && marketing_actions[item]?.configured,
                    [classes.strongElevation]:
                      selectedMarketingActions === item,
                  })}
                  key={`marketing_action_card${item}`}
                >
                  <div className={classes.cardInner}>
                    <div
                      className={classNames({
                        [classes.shakeAnimation]:
                          selectedMarketingActions === item,
                      })}
                    >
                      <CustomMuiIcon
                        MuiIcon={MarketingActionIconEnum[item]}
                        variant={disabled ? 'disabled' : 'primary'}
                        MuiIconProps={{ fontSize: 'large' }}
                      />
                    </div>
                    <Typography
                      className={classes.stepLabel}
                      variant="subtitle2"
                    >
                      {t(MarktingIconLabel[item])}
                    </Typography>
                  </div>
                </Card>
              </ButtonBase>
            </div>
          );
        })}
      </div>
      {!!selectedMarketingActions && (
        <div className={classes.actionButtons}>
          <Button
            onClick={() => {
              handleMarketingActionChange(null);
              handleResetMarketingAction(selectedMarketingActions);
            }}
          >
            <DeleteIcon className={classes.textIcon} />
            {t('cadence.form.marketing_action.form.reset')}
          </Button>
          <Button
            onClick={() =>
              handleMarketingActionChange(selectedMarketingActions)
            }
          >
            <DoneAllIcon className={classes.textIcon} />
            {t('cadence.form.marketing_action.form.submit')}
          </Button>
        </div>
      )}
      {selectedMarketingActions === CADENCE_MARKETING_ACTION_WRITTEN_EMAIL && (
        <WriteEmail
          mailContent={
            marketing_actions[CADENCE_MARKETING_ACTION_WRITTEN_EMAIL].content
          }
          title={
            marketing_actions[CADENCE_MARKETING_ACTION_WRITTEN_EMAIL].title
          }
          onChangeContent={handleWrittenEmailContentChange}
          onChangeTitle={handleWrittenEmailTitleChange}
        />
      )}
      {selectedMarketingActions === CADENCE_MARKETING_ACTION_SMS && (
        <WriteSMS
          hideSmsCount
          smsContent={marketing_actions[CADENCE_MARKETING_ACTION_SMS].content}
          onChangeContent={handleSmsContentChange}
          contentLengthError={!!errors?.[CADENCE_MARKETING_ACTION_SMS]?.content}
        />
      )}
      {selectedMarketingActions ===
        CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION && (
        <WriteNotification
          notificationTitle={
            marketing_actions[CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION].title
          }
          onNotificationTitleChange={handlePushNotificationTitleChange}
          notificationContent={
            marketing_actions[CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]
              .content
          }
          onNotificationContentChange={handlePushNotificationContentChange}
        />
      )}
      {selectedMarketingActions === CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE && (
        <SelectTemplate
          title={
            marketing_actions[CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE].title
          }
          selectedMail={
            marketing_actions[CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]
              .email_design_id
          }
          onChangeTitle={handleEmailTemplateTitleChange}
          onChangeTemplate={handleSelectEmailDesign}
          onCancel={onCancel}
          getEmailDetail={getEmailDetail}
          emailListLoading={emailListLoading}
          emails={emails || []}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
        />
      )}
      {selectedMarketingActions === CADENCE_MARKETING_ACTION_TAG_MANAGEMENT && (
        <div className={classes.tagSelector}>
          <TagSelector
            noMulti
            allTagsWithTagGroup={tagList || []}
            placeholder={t('cadence.form.marketing_action.select_tag')}
            selectedTags={[
              marketing_actions[CADENCE_MARKETING_ACTION_TAG_MANAGEMENT].tag_id,
            ]}
            isClearable
            closeMenuOnSelect
            inScrollBar
          />
        </div>
      )}
    </div>
  );
};

export default MarketingActionsForm;

const useStyles = makeStyles((theme: Theme) => ({
  titleWithIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  icon: {
    color: '#868686',
  },
  alertContainer: {
    paddingBottom: theme.spacing(2),
  },
  alert: {
    alignItems: 'center',
  },
  marketingActionsContainer: {
    paddingBottom: theme.spacing(3),
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(4),
  },
  cardContainer: {
    position: 'relative',
  },
  cardOutter: {
    width: '100px',
    height: '100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    border: `1px solid #E0E0E0`,
    '&:hover': {
      boxShadow:
        'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 1px 2px',
    },
  },
  borderOutlined: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  strongElevation: {
    boxShadow:
      'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 8px 16px',
  },
  topRightIconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(50%, -50%)',
    zIndex: 1000,
  },
  cardInner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
  },
  stepLabel: {
    fontWeight: 500,
  },
  tagSelector: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(10),
  },
  shakeAnimation: {
    animation: '$shake 0.75s infinite',
  },
  configuredIconContainer: {
    backgroundColor: green[600],
    borderRadius: '100%',
    height: '20px',
    width: '20px',
  },
  configuredIcon: {
    padding: theme.spacing(0.3),
    color: 'white',
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  textIcon: {
    marginRight: theme.spacing(1),
  },

  '@keyframes shake': {
    '0%': { transform: 'rotate(0)' },
    '15% ': { transform: 'rotate(8deg)' },
    '30%': { transform: 'rotate(-8deg)' },
    '45%': { transform: 'rotate(6deg)' },
    '60%': { transform: 'rotate(-6deg)' },
    '75%': { transform: 'rotate(4deg)' },
    '85%': { transform: 'rotate(-4deg)' },
    '92%': { transform: 'rotate(2deg)' },
    '100%': { transform: 'rotate(0)' },
  },
}));
