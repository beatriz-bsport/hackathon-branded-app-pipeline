import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
  useFormikContext,
  withFormik,
  FieldArray,
  FieldArrayRenderProps,
} from 'formik';

import { makeStyles } from '@material-ui/core/styles';

import { OptionCallback } from '../../../../../state/types';
import SelectMenuButton from '#components/button/SelectMenuButton.component';
import {
  MarketingActionKind,
  MarketingActions,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';

import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import type { Tag, TagGroupAPI } from '#libs/tag/types';

import MarketingActionHeader from './MarketingFormHeader.component';
import MarketingActionContent from './MarketingActionContent.component';
import {
  getDefaultValues,
  getMarketingActionOptions,
  getMarketingActionType,
} from './utils';
import {
  notificationValidationSchema,
  smsValidationSchema,
  tagValidationSchema,
  templateEmailValidationSchema,
  writtenEmailValidationSchema,
} from './validationSchemas';

export type Props = {
  emailDetailList: Record<number, EmailTemplateDetail>;
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  tagCategories: { [tag_name: string]: string[] };
  isAddActionEnabled?: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  tagList: Tag<TagGroupAPI>[];
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  onSubmit?: (
    values: StepMarketingActions[],
    options?: OptionCallback,
  ) => Promise<void>;
  updateMarketingActions: (values: StepMarketingActions[]) => void;
};

type FormValues = {
  marketingActions: StepMarketingActions[];
};

type HOCProps = Props & FormValues;

const MarketingActionForm: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  tagCategories,
  isAddActionEnabled,
  resolvedGenericTags,
  tagList,
  fetchEmailSummaryList,
  getEmailDetail,
  updateMarketingActions,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const { values } = useFormikContext<FormValues>();

  React.useEffect(() => {
    updateMarketingActions(values.marketingActions);
  }, [updateMarketingActions, values.marketingActions]);

  const renderMarketingActions = React.useCallback(
    (arrayHelpers: FieldArrayRenderProps) => {
      const handleDeleteAction = (index: number) => () =>
        arrayHelpers.remove(index);

      const handleSubmitAction =
        (index: number) => (data: StepMarketingActions) =>
          arrayHelpers.replace(index, data);

      const isMarketingActionsNotEmpty =
        values.marketingActions && values.marketingActions.length > 0;

      return (
        <div>
          {isMarketingActionsNotEmpty &&
            values.marketingActions.map((marketingAction, index) => (
              <div key={`marketingAction_${marketingAction.id}`}>
                <MarketingActionHeader
                  deleteAction={handleDeleteAction(index)}
                  type={getMarketingActionType(marketingAction)}
                />
                <div className={classes.marketingAction}>
                  <MarketingActionContent
                    emailDetailList={emailDetailList}
                    emailDetailListLoading={emailDetailListLoading}
                    emailSummaryList={emailSummaryList}
                    emailSummaryListLoading={emailSummaryListLoading}
                    fetchEmailSummaryList={fetchEmailSummaryList}
                    getEmailDetail={getEmailDetail}
                    marketingAction={marketingAction}
                    resolvedGenericTags={resolvedGenericTags}
                    submit={handleSubmitAction(index)}
                    tagCategories={tagCategories}
                    tagList={tagList}
                  />
                </div>
              </div>
            ))}
          {isAddActionEnabled && (
            <SelectMenuButton
              actionList={getMarketingActionOptions(
                t,
                (type: MarketingActions) =>
                  arrayHelpers.push(getDefaultValues(type)),
              )}
              customColor={SequentialMarketingColors.INNER_STEP_COLOR}
              label={`+ ${t('cadence.marketingAction.addAction')}`}
            />
          )}
        </div>
      );
    },
    [
      classes.marketingAction,
      values.marketingActions,
      emailDetailList,
      emailDetailListLoading,
      emailSummaryList,
      emailSummaryListLoading,
      isAddActionEnabled,
      resolvedGenericTags,
      tagCategories,
      tagList,
      t,
      fetchEmailSummaryList,
      getEmailDetail,
    ],
  );

  return (
    <div className={classes.content}>
      <FieldArray name="marketingActions" render={renderMarketingActions} />
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
  marketingAction: {
    marginBottom: theme.spacing(4),
  },
}));

const withFormikWrapper = withFormik<HOCProps, FormValues>({
  mapPropsToValues: ({ marketingActions }) => {
    return {
      marketingActions: (marketingActions || []) as StepMarketingActions[],
    };
  },
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values.marketingActions, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
  validationSchema: Yup.array().of(
    Yup.object()
      .when('kind', {
        is: MarketingActionKind.TAG,
        then: tagValidationSchema,
      })
      .when('kind', {
        is: MarketingActionKind.COMMUNICATION,
        then: Yup.object()
          .when('action_spec.communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
            then: notificationValidationSchema,
          })
          .when('action_spec.communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
            then: templateEmailValidationSchema,
          })
          .when('action_spec.communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_SMS,
            then: smsValidationSchema,
          })
          .when('action_spec.communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
            then: writtenEmailValidationSchema,
          }),
      }),
  ),
});

export default React.memo(withFormikWrapper(MarketingActionForm));
