import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { MarketingActions } from '#src/libs/sequential_marketing/constants';
import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';
import { getMarketingActionType } from '#src/libs/sequential_marketing/components/form/marketing_actions/utils';

import NotificationForm from '#src/libs/sequential_marketing/components/form/marketing_actions/communication_forms/NotificationForm';
import SmsForm from '#src/libs/sequential_marketing/components/form/marketing_actions/communication_forms/SMS/SmsForm';
import WrittenEmailForm from '#src/libs/sequential_marketing/components/form/marketing_actions/communication_forms/WrittenEmailForm';
import TemplateEmailForm from '#src/libs/sequential_marketing/components/form/marketing_actions/communication_forms/TemplateEmailForm';
import TagForm from '#src/libs/sequential_marketing/components/form/marketing_actions/communication_forms/TagForm';
import SmsCostWarningAlert from '#src/libs/sequential_marketing/components/form/marketing_actions/communication_forms/SMS/SmsCostWarningAlert';

type Props = {
  marketingAction: Partial<StepMarketingActions>;
  withoutValidation?: boolean;
  submit?: (data: Partial<StepMarketingActions>) => void;
} & MarketingActionEssentials;

const MarketingActionContent: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  tagCategories,
  marketingAction,
  resolvedGenericTags,
  tagList,
  withoutValidation,
  fetchEmailSummaryList,
  getEmailDetail,
  submit,
}) => {
  const classes = useStyles();

  switch (getMarketingActionType(marketingAction)) {
    case MarketingActions.WRITTEN_EMAIL:
      return (
        <WrittenEmailForm
          marketingAction={marketingAction}
          submit={submit}
          tagCategories={tagCategories}
          withoutValidation={withoutValidation}
        />
      );
    case MarketingActions.SMS:
      return (
        <div className={classes.smsContainer}>
          <SmsForm
            marketingAction={marketingAction}
            submit={submit}
            tagCategories={tagCategories}
            withoutValidation={withoutValidation}
          />
          <SmsCostWarningAlert />
        </div>
      );
    case MarketingActions.EMAIL_TEMPLATE:
      return (
        <TemplateEmailForm
          emailDetailList={emailDetailList}
          emailDetailListLoading={emailDetailListLoading}
          emailSummaryList={emailSummaryList}
          emailSummaryListLoading={emailSummaryListLoading}
          fetchEmailSummaryList={fetchEmailSummaryList}
          getEmailDetail={getEmailDetail}
          marketingAction={marketingAction}
          resolvedGenericTags={resolvedGenericTags}
          submit={submit}
          withoutValidation={withoutValidation}
        />
      );
    case MarketingActions.ADD_TAG:
      return (
        <div className={classes.tagSelector}>
          <TagForm
            marketingAction={marketingAction}
            submit={submit}
            tagList={tagList}
            withoutValidation={withoutValidation}
          />
        </div>
      );
    case MarketingActions.PUSH_NOTIFICATION:
      return (
        <NotificationForm
          marketingAction={marketingAction}
          submit={submit}
          tagCategories={tagCategories}
          withoutValidation={withoutValidation}
        />
      );
    default:
      return null;
  }
};

const useStyles = makeStyles(() => ({
  tagSelector: {
    width: '100%',
  },
  smsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
}));

export default React.memo(MarketingActionContent);
