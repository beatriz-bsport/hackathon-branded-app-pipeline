import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import SendIcon from '@material-ui/icons/Send';

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import SelectTemplate from '#libs/communication/components/SelectTemplate.component';
import WriteEmail from '#libs/communication/components/WriteEmail.component';
import WriteSMS from '#libs/communication/components/WriteSMS.component';
import WriteNotification from '#libs/communication/components/WriteNotification.component';
import TagSelector from '#libs/tag/components/TagSelector.selector';

import {
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  CADENCE_MARKETING_ACTION_SMS,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  CADENCE_MARKETING_ACTION_CHOICES,
  CadenceMarketingActionsEnum,
} from '#libs/sequential_marketing/constants';

import useMarketingActionsFormContext, {
  MarketingActionData,
} from '#libs/sequential_marketing/components/form/StepMarketingActionsForm/useMarketingActions.hook';
import type {
  EmailTemplate,
  EmailTemplateDetail,
} from '#libs/email-editor/types';
import type { Tag, TagGroup } from '#libs/tag/types';

import MarketingActionList from './MarketingActionCardList.component';
import {
  StepMarketingActions,
  StepMarketingActionsKind,
} from '#libs/sequential_marketing/types';
import { OptionCallback } from '../../../../state/types';

type Props = {
  marketingActions: StepMarketingActions[];
  submitActionConfiguration: (
    data: MarketingActionData,
    options: OptionCallback,
  ) => void;
  getEmailDetail: (id: number) => void;
  emailListLoading: boolean;
  emailDetailLoading: boolean;
  emails: EmailTemplate[];
  emailDetails: EmailTemplateDetail[];
  tagList: Array<Tag<TagGroup>>;
  deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
};

const MarketingActionsForm: React.FC<Props> = ({
  marketingActions,
  getEmailDetail,
  emailListLoading,
  emailDetailLoading,
  emails,
  emailDetails,
  tagList,
  submitActionConfiguration,
  deleteStepMarketingAction,
}) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const marketingActionConfiguredDict = React.useMemo(() => {
    return CADENCE_MARKETING_ACTION_CHOICES.reduce<{
      [key: number]: boolean;
    }>((acc, currentKind) => {
      if (
        currentKind ===
        CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT
      ) {
        acc[currentKind] = !!marketingActions?.find(
          (ma) => ma?.kind === StepMarketingActionsKind.TAG,
        );
      } else {
        acc[currentKind] = !!marketingActions?.find(
          (ma) => ma?.action_spec?.communication_kind === currentKind,
        );
      }

      return acc;
    }, {});
  }, [marketingActions]);

  const marketingActionsCommunication = React.useMemo(
    () =>
      marketingActions?.filter(
        (ma) => ma.kind === StepMarketingActionsKind.COMMUNICATION,
      ),
    [marketingActions],
  );

  const marketingActionsTag = React.useMemo(
    () =>
      marketingActions?.filter(
        (ma) => ma.kind === StepMarketingActionsKind.TAG,
      ),
    [marketingActions],
  );

  const {
    formikValues,
    formikErrors,
    formikSubmit,
    selectedMarketingActionKind,
    handleCommunicationTitleChange,
    handleCommunicationTextContentChange,
    handleSelectEmailDesign,
    handleCancelEmailDesignSelection,
    handleSelectMarketingAction,
    handleChangeTag,
    handleDeleteMarketingAction,
  } = useMarketingActionsFormContext({
    emails,
    marketingActionsCommunication,
    marketingActionsTag,
    submitActionConfiguration,
    deleteStepMarketingAction,
  });

  return (
    <div className={classes.marketingActionsContainer}>
      <Divider />
      <div className={classes.titleWithIcon}>
        <SendIcon className={classes.icon} />
        <Typography variant="h6">{t('cadence.marketingElement')}</Typography>
      </div>
      <div className={classes.alertContainer}>
        <Alert severity="info" className={classes.alert}>
          {t('cadence.form.marketing_action.form.helper')}
        </Alert>
      </div>

      <MarketingActionList
        selectedAction={selectedMarketingActionKind}
        handleChangeAction={(item) => handleSelectMarketingAction(item)}
        marketingActionConfiguredDict={marketingActionConfiguredDict}
      />
      {!!selectedMarketingActionKind && (
        <div className={classes.actionButtons}>
          <Button
            onClick={() => {
              handleDeleteMarketingAction && handleDeleteMarketingAction();
            }}
          >
            <DeleteIcon className={classes.textIcon} />
            {t('cadence.form.marketing_action.form.reset')}
          </Button>
          <Button onClick={() => formikSubmit()}>
            <DoneAllIcon className={classes.textIcon} />
            {t('cadence.form.marketing_action.form.submit')}
          </Button>
        </div>
      )}
      {selectedMarketingActionKind ===
        CADENCE_MARKETING_ACTION_WRITTEN_EMAIL && (
        <WriteEmail
          mailContent={formikValues?.action_spec?.text_content}
          title={formikValues?.action_spec?.subject}
          onChangeContent={handleCommunicationTextContentChange}
          onChangeTitle={handleCommunicationTitleChange}
        />
      )}
      {selectedMarketingActionKind === CADENCE_MARKETING_ACTION_SMS && (
        <WriteSMS
          hideSmsCount
          smsContent={formikValues?.action_spec?.text_content ?? ''}
          onChangeContent={handleCommunicationTextContentChange}
          contentLengthError={!!formikErrors?.action_spec?.text_content}
        />
      )}
      {selectedMarketingActionKind ===
        CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION && (
        <WriteNotification
          notificationTitle={formikValues?.action_spec?.subject}
          onNotificationTitleChange={handleCommunicationTitleChange}
          notificationContent={formikValues?.action_spec?.text_content}
          onNotificationContentChange={handleCommunicationTextContentChange}
        />
      )}
      {selectedMarketingActionKind ===
        CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE && (
        <SelectTemplate
          title={formikValues?.action_spec?.subject}
          selectedMail={formikValues?.action_spec?.email_design}
          onChangeTitle={handleCommunicationTitleChange}
          onChangeTemplate={handleSelectEmailDesign}
          onCancel={handleCancelEmailDesignSelection}
          getEmailDetail={getEmailDetail}
          emailListLoading={emailListLoading}
          emails={emails || []}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
        />
      )}
      {selectedMarketingActionKind ===
        CADENCE_MARKETING_ACTION_TAG_MANAGEMENT && (
        <div className={classes.tagSelector}>
          <TagSelector
            noMulti
            allTagsWithTagGroup={tagList || []}
            placeholder={t('cadence.form.marketing_action.select_tag')}
            selectedTags={[formikValues?.action_spec?.tag_id]}
            isClearable
            closeMenuOnSelect
            inScrollBar
            onChange={(option) => handleChangeTag(option)}
            onDeleteTag={() => handleChangeTag(null)}
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
  tagSelector: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(10),
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
}));
