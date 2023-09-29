import React from 'react';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';

import type {
  CadenceStep,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type { Tag, TagGroupAPI } from '#libs/tag/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';

import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import CadenceBubble from './CadenceBubble.component';
import MarketingActionsForm from '#libs/sequential_marketing/components/form/marketing_actions/MarketingActionForm.component';

export type StepEditionBubbleProps = {
  step: CadenceStep;
  emailDetailList: Record<number, EmailTemplateDetail>;
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  tagCategories: { [tag_name: string]: string[] };
  marketingActions?: StepMarketingActions[];
  resolvedGenericTags: ResolvedGenericTags;
  tagList: Tag<TagGroupAPI>[];
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  onCancel?: () => void;
  onConfirm: (data: { list: StepMarketingActions[]; step: number }) => void;
  updateCadenceStepName: (data: { name: string; stepId: number }) => void;
};

type MarketingActionsTitleProps = { title: string };

const MarketingActionsTitle: React.FC<MarketingActionsTitleProps> = React.memo(
  ({ title }) => {
    const classes = useStyles();
    return (
      <div className={classes.title}>
        <div className={classes.flexIconAndText}>
          <CustomMuiIcon
            defaultBackGround
            customColor={SequentialMarketingColors.INNER_STEP_COLOR}
            icon="DoubleArrow"
            withBackground={false}
          />

          <div className={classes.labelContainer}>
            <Typography className={classes.label} variant="subtitle2">
              {title}
            </Typography>
          </div>
        </div>
      </div>
    );
  },
);

const StepEditionBubble: React.FC<StepEditionBubbleProps> = ({
  step,
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  tagCategories,
  marketingActions,
  resolvedGenericTags,
  tagList,
  fetchEmailSummaryList,
  getEmailDetail,
  onCancel,
  onConfirm,
  updateCadenceStepName,
}) => {
  const { t } = useTranslation('marketing');

  const [previousMarketingActions, setPreviousMarketingActions] =
    React.useState<StepMarketingActions[]>([]);

  const [marketingActionList, setMarketingActionList] = React.useState<
    StepMarketingActions[]
  >([]);

  const [stepName, setStepName] = React.useState('');

  React.useEffect(() => {
    const marketingActionPropsUnchanged =
      previousMarketingActions.length === marketingActions.length &&
      previousMarketingActions.every(
        (action, index) => action === marketingActions[index],
      );
    if (!marketingActionPropsUnchanged) {
      setPreviousMarketingActions(marketingActions);
      setMarketingActionList(marketingActions || []);
    }
  }, [marketingActions, previousMarketingActions]);

  React.useEffect(() => {
    setStepName(step?.name || t('cadence.form.cadenceStep'));
  }, [step, t]);

  const updateMarketingActionList = React.useCallback(
    (actionList: StepMarketingActions[]) => setMarketingActionList(actionList),
    [setMarketingActionList],
  );

  const handleSubmit = React.useCallback(() => {
    const stepNameUnchanged = stepName === step?.name;
    const marketingActionsUnchanged =
      marketingActions.length === marketingActionList.length &&
      marketingActions.every((obj, index) =>
        isEqual(obj, marketingActionList[index]),
      );
    !stepNameUnchanged &&
      updateCadenceStepName?.({ name: stepName, stepId: step?.id });
    !marketingActionsUnchanged &&
      onConfirm?.({ list: marketingActionList, step: step?.id });
    onCancel?.();
  }, [
    marketingActionList,
    marketingActions,
    onCancel,
    onConfirm,
    step,
    stepName,
    updateCadenceStepName,
  ]);

  const updateStepName = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      event.preventDefault();
      setStepName(value);
    },
    [],
  );

  return (
    <CadenceBubble
      color={SequentialMarketingColors.INNER_STEP_COLOR}
      icon="DeviceHub"
      onCancelClick={onCancel}
      onConfirmClick={handleSubmit}
      title={stepName}
    >
      <TextField
        fullWidth
        required
        label={t('cadence.bubble.step.name')}
        name="stepName"
        onChange={updateStepName}
        type="text"
        value={stepName}
      />
      <MarketingActionsTitle
        title={t('cadence.bubble.marketingAction.title')}
      />
      <MarketingActionsForm
        isAddActionEnabled
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
        updateMarketingActions={updateMarketingActionList}
      />
    </CadenceBubble>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    position: 'relative',
    alignItems: 'flex-start',
    width: '100%',
  },
  flexIconAndText: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: '100%',
    flex: 1,
  },
  centerAbsolute: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-45%,-45%) rotate(-45deg)',
  },
  labelContainer: {
    overflow: 'hidden',
  },
  label: {
    fontSize: '18px',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  },
}));

export default React.memo(StepEditionBubble);
