import React from 'react';

import { useFormikContext, withFormik } from 'formik';

import { makeStyles } from '@material-ui/core/styles';

import type { OptionCallback } from '../../../../../state/types';
import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import type { Tag, TagGroupAPI } from '#libs/tag/types';

import MarketingActionContent from './MarketingActionContent.component';
import { marketingActionValidationSchema } from './validationSchemas';

export type Props = {
  emailDetailList: { [templateId: number]: EmailTemplateDetail };
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  tagCategories: { [tagName: string]: string[] };
  resolvedGenericTags: ResolvedGenericTags;
  tagList: Tag<TagGroupAPI>[];
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  onSubmit?: (
    value: Partial<StepMarketingActions>,
    options?: OptionCallback,
  ) => void;
  updateMarketingAction: (value: Partial<StepMarketingActions>) => void;
};

type FormValues = {
  marketingAction: Partial<StepMarketingActions>;
};

type HOCProps = Props & FormValues;

const UniqueMarketingActionForm: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  tagCategories,
  resolvedGenericTags,
  tagList,
  fetchEmailSummaryList,
  getEmailDetail,
  updateMarketingAction,
}) => {
  const classes = useStyles();

  const { values } = useFormikContext<FormValues>();

  React.useEffect(() => {
    updateMarketingAction(values.marketingAction);
  }, [updateMarketingAction, values.marketingAction]);

  return (
    <div className={classes.content}>
      {!!values.marketingAction && (
        <MarketingActionContent
          emailDetailList={emailDetailList}
          emailDetailListLoading={emailDetailListLoading}
          emailSummaryList={emailSummaryList}
          emailSummaryListLoading={emailSummaryListLoading}
          fetchEmailSummaryList={fetchEmailSummaryList}
          getEmailDetail={getEmailDetail}
          marketingAction={values.marketingAction}
          resolvedGenericTags={resolvedGenericTags}
          submit={updateMarketingAction}
          tagCategories={tagCategories}
          tagList={tagList}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    maxHeight: '400px',
    width: '100%',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '3px',
    },
    '&::-webkit-scrollbar-track': {
      borderRadius: theme.spacing(1),
    },
    '&:focus, &:hover': {
      '&::-webkit-scrollbar-thumb': {
        borderRadius: theme.spacing(1),
        backgroundColor: 'rgba(0,0,0,.3)',
      },
    },
  },
}));

const withFormikWrapper = withFormik<HOCProps, FormValues>({
  enableReinitialize: true,
  mapPropsToValues: ({ marketingAction }) => ({ marketingAction }),
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values.marketingAction, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
  validationSchema: marketingActionValidationSchema,
});

export default React.memo(withFormikWrapper(UniqueMarketingActionForm));
