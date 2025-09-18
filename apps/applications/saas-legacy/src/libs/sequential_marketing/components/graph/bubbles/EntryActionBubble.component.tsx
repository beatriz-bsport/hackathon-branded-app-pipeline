import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import {
  MarketingActions,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';
import MultipleMarketingActionForm from '#src/libs/sequential_marketing/components/form/marketing_actions/MultipleMarketingActionForm.component';

import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';
import CadenceBubble from './CadenceBubble.component';
import SmsCostWarningModal from '../../form/marketing_actions/communication_forms/SMS/SmsCostWarningModal';

type Props = {
  isInitial?: boolean;
  marketingActions?: StepMarketingActions[];
  onConfirm: (data: StepMarketingActions[]) => void;
  onCancel?: (value?: StepMarketingActions[]) => void;
} & MarketingActionEssentials;

const EntryActionBubble: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  resolvedGenericTags,
  tagCategories,
  tagList,
  isInitial,
  marketingActions,
  fetchEmailSummaryList,
  getEmailDetail,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles({ color: SequentialMarketingColors.ENTRY_COLOR });

  const [smsCostWarningState, setSmsCostWarningState] = React.useState<
    'dismissed' | 'displayed' | null
  >(null);
  const [isFormValid, setIsFormValid] = React.useState(false);

  const [marketingActionList, setMarketingActionList] = React.useState<
    StepMarketingActions[]
  >([]);

  const updateMarketingActionList = React.useCallback(
    (newConnectedTriggerList: StepMarketingActions[]) =>
      setMarketingActionList(newConnectedTriggerList),
    [setMarketingActionList],
  );

  const handleCancel = React.useCallback(() => {
    onCancel?.(marketingActionList);
  }, [marketingActionList, onCancel]);

  const saveMarketingActions = React.useCallback(() => {
    onConfirm?.(
      marketingActionList?.map((action) => ({
        ...action,
        name: t('cadence.form.marketing_action.defaultName'),
      })) ?? [],
    );
  }, [marketingActionList, onConfirm]);

  const handleSubmit = React.useCallback(() => {
    let isSmsMarketingActionPresent = false;
    for (const action of marketingActionList) {
      if (
        'communication_kind' in action.action_spec &&
        action.action_spec.communication_kind ===
          MarketingActions.CADENCE_MARKETING_ACTION_SMS
      ) {
        isSmsMarketingActionPresent = true;
        break;
      }
    }
    if (isSmsMarketingActionPresent && smsCostWarningState !== 'dismissed') {
      setSmsCostWarningState('displayed');
    } else {
      setSmsCostWarningState(null);
      saveMarketingActions();
    }
  }, [marketingActionList, smsCostWarningState, saveMarketingActions]);

  const handleUpdateFormValidation = React.useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  React.useEffect(() => {
    setMarketingActionList(marketingActions ?? []);
  }, [marketingActions]);

  return (
    <>
      <CadenceBubble
        color={SequentialMarketingColors.ENTRY_COLOR}
        icon="PlayArrow"
        isSubmissionForbidden={!isFormValid}
        onCancelClick={handleCancel}
        onCancelText={
          isInitial ? t('cadence.bubble.previous') : t('cadence.bubble.cancel')
        }
        onConfirmClick={handleSubmit}
        onConfirmText={
          isInitial ? t('cadence.bubble.next') : t('cadence.bubble.confirm')
        }
        title={t('cadence.bubble.entryAction.title')}
      >
        <div className={classes.content}>
          <Alert className={classes.alert} severity="info">
            {t('cadence.bubble.entryAction.helperText')}
          </Alert>
          <MultipleMarketingActionForm
            addActionLabel={`+ ${t('cadence.bubble.entryAction.addAction')}`}
            emailDetailList={emailDetailList}
            emailDetailListLoading={emailDetailListLoading}
            emailSummaryList={emailSummaryList}
            emailSummaryListLoading={emailSummaryListLoading}
            fetchEmailSummaryList={fetchEmailSummaryList}
            getEmailDetail={getEmailDetail}
            marketingActions={marketingActionList}
            resolvedGenericTags={resolvedGenericTags}
            tagCategories={tagCategories}
            tagList={tagList}
            updateFormValidation={handleUpdateFormValidation}
            updateMarketingActions={updateMarketingActionList}
          />
        </div>
      </CadenceBubble>
      {smsCostWarningState === 'displayed' && (
        <SmsCostWarningModal
          handleClose={() => setSmsCostWarningState(null)}
          isOpen={true}
          sendMessageOnClick={() => {
            saveMarketingActions();
          }}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  alert: {
    alignItems: 'center',
  },
}));

export default React.memo(EntryActionBubble);
