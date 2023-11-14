import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, type Theme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import CadenceBubble from './CadenceBubble.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import MultipleMarketingActionForm from '../../form/marketing_actions/MultipleMarketingActionForm.component';

import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';

type Props = {
  isInitial?: boolean;
  marketingActions?: StepMarketingActions[];
  onConfirm: (data: StepMarketingActions[]) => void;
  onClose?: () => void;
} & MarketingActionEssentials;

const EntryActionBubble: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  tagCategories,
  marketingActions,
  resolvedGenericTags,
  tagList,
  isInitial,
  fetchEmailSummaryList,
  getEmailDetail,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles({ color: SequentialMarketingColors.ENTRY_COLOR });

  const [isFormValid, setIsFormValid] = React.useState(false);

  const [marketingActionList, setMarketingActionList] = React.useState<
    StepMarketingActions[]
  >([]);

  const updateMarketingActionList = React.useCallback(
    (newConnectedTriggerList: StepMarketingActions[]) =>
      setMarketingActionList(newConnectedTriggerList),
    [setMarketingActionList],
  );

  const handleSubmit = React.useCallback(() => {
    onConfirm?.(marketingActionList);
    onClose?.();
  }, [marketingActionList, onClose, onConfirm]);

  const handleUpdateFormValidation = React.useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  React.useEffect(() => {
    setMarketingActionList(marketingActions || []);
  }, [marketingActions]);

  return (
    <CadenceBubble
      color={SequentialMarketingColors.ENTRY_COLOR}
      icon="PlayArrow"
      isSubmissionForbidden={!isFormValid}
      onCancelClick={onClose}
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
  );
};

type StylesProps = { color: string };

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  content: {
    width: '100%',
  },
  alert: {
    marginBottom: theme.spacing(4),
  },
}));

export default React.memo(EntryActionBubble);
