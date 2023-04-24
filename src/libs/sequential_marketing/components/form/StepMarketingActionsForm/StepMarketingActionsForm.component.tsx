// @ts-nocheck
import React from 'react';

import { useTranslation } from 'react-i18next';

import MarketingActionsForm from '#libs/communication-v2/components/SequentialMarketing/MarketingActionsForm.component';
import type { OptionCallback } from '../../../../../state/types';
import type { SmartList } from '#libs/smart-list/types';
import type {
  EmailTemplate,
  EmailTemplateDetail,
} from '#libs/email-editor/types';
import {
  CadenceStep,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type { MarketingActionData } from './useMarketingActions.hook';

export type BaseFormComponentProps = {
  step: CadenceStep;
  smartlists: SmartList[];
  tagList: any;
  emailListLoading: boolean;
  emails: Array<EmailTemplate>;
  emailDetailLoading: boolean;
  emailDetails: Array<EmailTemplateDetail>;
  getEmails: () => void;
  getEmailDetail: (id: number) => void;
  marketingActions: StepMarketingActions[];
  upsertStepMarketingAtions: (
    data: MarketingActionData & { cadence_step: number },
    options?: OptionCallback,
  ) => void;
  deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
};

type MarketingActionsProps = BaseFormComponentProps;

export const StepMarketingActionsForm: React.FC<MarketingActionsProps> = ({
  step,
  tagList,
  emailListLoading,
  emails,
  emailDetailLoading,
  emailDetails,
  getEmailDetail,
  upsertStepMarketingAtions,
  deleteStepMarketingAction,
  marketingActions,
}) => {
  const { t } = useTranslation('marketing');

  const submitActionConfiguration = (
    data: MarketingActionData,
    options: OptionCallback,
  ) => {
    upsertStepMarketingAtions(
      {
        ...data,
        cadence_step: step.id,
        name: t('cadence.form.marketing_action.defaultName'),
      },
      options,
    );
  };
  return (
    <div>
      <MarketingActionsForm
        marketingActions={marketingActions}
        emails={emails}
        tagList={tagList}
        emailDetailLoading={emailDetailLoading}
        emailDetails={emailDetails}
        emailListLoading={emailListLoading}
        getEmailDetail={getEmailDetail}
        submitActionConfiguration={submitActionConfiguration}
        deleteStepMarketingAction={deleteStepMarketingAction}
      />
    </div>
  );
};

export default StepMarketingActionsForm;
