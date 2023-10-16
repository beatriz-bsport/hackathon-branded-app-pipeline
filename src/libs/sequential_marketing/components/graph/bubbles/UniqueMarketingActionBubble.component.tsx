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
import UniqueMarketingActionForm from '#libs/sequential_marketing/components/form/marketing_actions/UniqueMarketingActionForm.component';
import {
  MarketingActions,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';
import { getMarketingActionType } from '#libs/sequential_marketing/components/form/marketing_actions/utils';
import { marketingActionIconDict } from '#libs/sequential_marketing/components/helpers/utils';

export type Props = {
  marketingAction?: Partial<StepMarketingActions>;
  marketingActionKind?: MarketingActions;
  emailDetailList: { [templateId: number]: EmailTemplateDetail };
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  tagCategories: { [tagName: string]: string[] };
  tagList: Tag<TagGroupAPI>[];
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  onClose?: () => void;
  onConfirm: (data: Partial<StepMarketingActions>) => void;
};

const UniqueMarketingActionBubble: React.FC<Props> = ({
  marketingAction,
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  resolvedGenericTags,
  tagCategories,
  tagList,
  fetchEmailSummaryList,
  getEmailDetail,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');

  const [updatedMarketingAction, setUpdatedMarketingAction] =
    React.useState<Partial<StepMarketingActions> | null>(null);

  React.useEffect(() => {
    !!marketingAction &&
      !updatedMarketingAction &&
      setUpdatedMarketingAction(marketingAction);
  }, [marketingAction, updatedMarketingAction]);

  const updateMarketingAction = React.useCallback(
    (action: StepMarketingActions) => setUpdatedMarketingAction(action),
    [setUpdatedMarketingAction],
  );

  const handleSubmit = React.useCallback(() => {
    onConfirm?.(updatedMarketingAction);
    onClose?.();
  }, [updatedMarketingAction, onClose, onConfirm]);

  const marketingActionType = React.useMemo(
    () => getMarketingActionType(marketingAction),
    [marketingAction],
  );

  return (
    <CadenceBubble
      minimalIcon
      color={SequentialMarketingColors.INNER_STEP_COLOR}
      icon={marketingActionIconDict[marketingActionType]}
      onCancelClick={onClose}
      onConfirmClick={handleSubmit}
      title={t(`cadence.form.marketing_action.${marketingActionType}`)}
    >
      <UniqueMarketingActionForm
        emailDetailList={emailDetailList}
        emailDetailListLoading={emailDetailListLoading}
        emailSummaryList={emailSummaryList}
        emailSummaryListLoading={emailSummaryListLoading}
        fetchEmailSummaryList={fetchEmailSummaryList}
        getEmailDetail={getEmailDetail}
        marketingAction={updatedMarketingAction}
        resolvedGenericTags={resolvedGenericTags}
        tagCategories={tagCategories}
        tagList={tagList}
        updateMarketingAction={updateMarketingAction}
      />
    </CadenceBubble>
  );
};

export default React.memo(UniqueMarketingActionBubble);
