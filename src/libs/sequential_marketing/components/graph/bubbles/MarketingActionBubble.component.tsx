import React from 'react';
import { useTranslation } from 'react-i18next';

import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import type { Tag, TagGroupAPI } from '#libs/tag/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';

import CadenceBubble from './CadenceBubble.component';
import MarketingActionForm from '#libs/sequential_marketing/components/form/marketing_actions/MarketingActionForm.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';

export type Props = {
  marketingActions?: StepMarketingActions[];
  emailDetailList: Record<number, EmailTemplateDetail>;
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  tagCategories: { [tag_name: string]: string[] };
  tagList: Tag<TagGroupAPI>[];
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  onCancel?: () => void;
  onClose?: () => void;
  onConfirm: (data: StepMarketingActions[]) => void;
};

const MarketingActionBubble: React.FC<Props> = ({
  marketingActions,
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  resolvedGenericTags,
  tagCategories,
  tagList,
  fetchEmailSummaryList,
  getEmailDetail,
  onCancel,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');
  const [marketingActionList, setMarketingActionList] = React.useState<
    StepMarketingActions[]
  >([]);

  React.useEffect(() => {
    setMarketingActionList(marketingActions || []);
  }, [marketingActions]);

  const updateMarketingActionList = React.useCallback(
    (actionList: StepMarketingActions[]) => setMarketingActionList(actionList),
    [setMarketingActionList],
  );

  const handleSubmit = React.useCallback(() => {
    onConfirm?.(marketingActionList);
    onClose?.();
  }, [marketingActionList, onClose, onConfirm]);

  return (
    <CadenceBubble
      minimalIcon
      color={SequentialMarketingColors.INNER_STEP_COLOR}
      icon="DoubleArrow"
      onCancelClick={onCancel}
      onConfirmClick={handleSubmit}
      title={t('cadence.bubble.marketingAction.title')}
    >
      <MarketingActionForm
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

export default React.memo(MarketingActionBubble);
