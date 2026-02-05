import React from 'react';

import { useFormikContext, withFormik } from 'formik';

import { makeStyles } from '@material-ui/core/styles';

import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';
import type { OptionCallback } from '../../../../../state/types';

import MarketingActionContent from './MarketingActionContent.component';
import { uniqueMarketingActionValidationSchema } from './validationSchemas';

export type Props = {
  marketingActionList?: StepMarketingActions[];
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit?: (
    value: Partial<StepMarketingActions>,
    options?: OptionCallback,
  ) => void;
  updateFormValidation: (isValid: boolean) => void;
  updateMarketingAction: (value: Partial<StepMarketingActions>) => void;
} & MarketingActionEssentials;

type FormValues = {
  marketingAction: Partial<StepMarketingActions>;
};

type HOCProps = Props & FormValues;

const UniqueMarketingActionForm: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  marketingActionList,
  tagCategories,
  resolvedGenericTags,
  tagList,
  fetchEmailSummaryList,
  getEmailDetail,
  updateFormValidation,
  updateMarketingAction,
}) => {
  const classes = useStyles();

  const { values, isValid } = useFormikContext<FormValues>();

  React.useEffect(() => {
    updateMarketingAction(values.marketingAction);
  }, [updateMarketingAction, values.marketingAction]);

  React.useEffect(() => {
    updateFormValidation(isValid);
  }, [isValid, updateFormValidation]);

  return (
    <div className={classes.content}>
      {!!values.marketingAction && (
        <MarketingActionContent
          withoutValidation
          emailDetailList={emailDetailList}
          emailDetailListLoading={emailDetailListLoading}
          emailSummaryList={emailSummaryList}
          emailSummaryListLoading={emailSummaryListLoading}
          fetchEmailSummaryList={fetchEmailSummaryList}
          getEmailDetail={getEmailDetail}
          marketingAction={values.marketingAction}
          marketingActionList={marketingActionList}
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
  validateOnMount: true,
  mapPropsToValues: ({ marketingAction }) => ({ marketingAction }),
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values.marketingAction, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
  validationSchema: uniqueMarketingActionValidationSchema,
});

export default React.memo(withFormikWrapper(UniqueMarketingActionForm));
