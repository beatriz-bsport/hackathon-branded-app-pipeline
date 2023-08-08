import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { MarketingActions } from '#libs/sequential_marketing/constants';
import { getMarketingActionType } from './utils';

import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import type { Tag, TagGroupAPI } from '#libs/tag/types';

import NotificationForm from './communication_forms/NotificationForm';
import SmsForm from './communication_forms/SmsForm';
import WrittenEmailForm from './communication_forms/WrittenEmailForm';
import TemplateEmailForm from './communication_forms/TemplateEmailForm';
import TagForm from './communication_forms/TagForm';

type Props = {
  marketingAction: StepMarketingActions;
  emailDetailList: Record<number, EmailTemplateDetail>;
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  tagCategories: { [tag_name: string]: string[] };
  resolvedGenericTags: ResolvedGenericTags;
  tagList: Tag<TagGroupAPI>[];
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  submit?: (data: StepMarketingActions) => void;
};

const MarketingActionContent: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  tagCategories,
  marketingAction,
  resolvedGenericTags,
  tagList,
  fetchEmailSummaryList,
  getEmailDetail,
  submit,
}) => {
  const classes = useStyles();

  switch (getMarketingActionType(marketingAction)) {
    case MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL:
      return (
        <WrittenEmailForm
          marketingAction={marketingAction}
          submit={submit}
          tagCategories={tagCategories}
        />
      );
    case MarketingActions.CADENCE_MARKETING_ACTION_SMS:
      return (
        <SmsForm
          marketingAction={marketingAction}
          submit={submit}
          tagCategories={tagCategories}
        />
      );
    case MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE:
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
        />
      );
    case MarketingActions.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT:
      return (
        <div className={classes.tagSelector}>
          <TagForm
            marketingAction={marketingAction}
            submit={submit}
            tagList={tagList}
          />
        </div>
      );
    case MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION:
      return (
        <NotificationForm
          marketingAction={marketingAction}
          submit={submit}
          tagCategories={tagCategories}
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
}));

export default React.memo(MarketingActionContent);
