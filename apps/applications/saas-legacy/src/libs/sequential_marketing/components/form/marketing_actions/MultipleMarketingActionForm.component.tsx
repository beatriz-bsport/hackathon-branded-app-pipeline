import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import { useFormikContext, withFormik } from 'formik';

import MenuSelectorTextButton from '#src/components/menu/text';
import {
  MarketingActions,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';

import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';
import type { OptionCallback } from '../../../../../state/types';

import {
  getMarketingActionPartialValues,
  getMarketingActionType,
} from './utils';
import { multipleMarketingActionsValidationSchema } from './validationSchemas';
import CollapsibleMarketingActionContent from './CollapsibleMarketingActionContent.component';
import useMarketingActionOptions from './hooks/useMarketingActionOptions.hook';

type Props = {
  addActionLabel?: string;
  updateMarketingActions: (values: Partial<StepMarketingActions>[]) => void;
  updateFormValidation: (isValid: boolean) => void;
} & MarketingActionEssentials;

type FormValues = {
  marketingActions: StepMarketingActions[];
  onSubmit?: (values: StepMarketingActions[], options?: OptionCallback) => void;
};

type HOCProps = Props & FormValues;

const MultipleMarketingActionForm: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  tagCategories,
  resolvedGenericTags,
  tagList,
  addActionLabel,
  fetchEmailSummaryList,
  getEmailDetail,
  updateMarketingActions,
  updateFormValidation,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const { values, isValid } = useFormikContext<FormValues>();

  const [openItem, setOpenItem] = React.useState<number | null>(null);

  const [temporaryId, setTemporaryId] = React.useState(1);

  const [withoutCollapseAnimation, setWithoutCollapseAnimation] =
    React.useState(false);

  const handleAddAction = React.useCallback(
    (marketingActionKind: MarketingActions) => {
      updateMarketingActions([
        ...values.marketingActions,
        getMarketingActionPartialValues(marketingActionKind, temporaryId),
      ]);
      setTemporaryId((prev) => prev + 1);
      setOpenItem(values.marketingActions.length);
    },
    [temporaryId, updateMarketingActions, values.marketingActions],
  );

  const handleDeleteAction = React.useCallback(
    (idx: number) => () => {
      setWithoutCollapseAnimation(true);
      updateMarketingActions(
        values.marketingActions.filter((_, index) => index !== idx),
      );
      openItem === idx && setOpenItem(null);
      openItem > idx && setOpenItem((prev) => prev - 1);
    },
    [openItem, updateMarketingActions, values.marketingActions],
  );

  const handleEditAction = React.useCallback(
    (idx: number) => () =>
      openItem === idx ? setOpenItem(null) : setOpenItem(idx),
    [openItem],
  );

  const handleUpdateAction = React.useCallback(
    (idx: number) => (marketingAction: Partial<StepMarketingActions>) => {
      updateMarketingActions(
        values.marketingActions.map((action, index) =>
          index === idx ? marketingAction : action,
        ),
      );
    },
    [updateMarketingActions, values.marketingActions],
  );

  const marketingActionOptions = useMarketingActionOptions({
    addMarketingAction: handleAddAction,
    marketingActionToExclude: values.marketingActions?.map((marketingAction) =>
      getMarketingActionType(marketingAction),
    ),
  });

  React.useEffect(() => {
    updateMarketingActions(values.marketingActions);
    setWithoutCollapseAnimation(false);
  }, [updateMarketingActions, values.marketingActions]);

  React.useEffect(() => {
    updateFormValidation(isValid);
  }, [isValid, updateFormValidation]);

  return (
    <div className={classes.container}>
      {!!values?.marketingActions?.length && (
        <div className={classes.content}>
          {values.marketingActions.map((marketingAction, index) => (
            <CollapsibleMarketingActionContent
              key={`MarketingAction:${marketingAction.id}`}
              color={SequentialMarketingColors.MARKETING_ACTION_COLOR}
              deleteAction={handleDeleteAction(index)}
              emailDetailList={emailDetailList}
              emailDetailListLoading={emailDetailListLoading}
              emailSummaryList={emailSummaryList}
              emailSummaryListLoading={emailSummaryListLoading}
              fetchEmailSummaryList={fetchEmailSummaryList}
              getEmailDetail={getEmailDetail}
              isLast={index === values.marketingActions.length - 1}
              isOpen={index === openItem}
              marketingAction={marketingAction}
              marketingActionList={values.marketingActions}
              openOrCloseAction={handleEditAction(index)}
              resolvedGenericTags={resolvedGenericTags}
              tagCategories={tagCategories}
              tagList={tagList}
              updateAction={handleUpdateAction(index)}
              withoutCollapseAnimation={withoutCollapseAnimation}
            />
          ))}
        </div>
      )}
      <div className={classes.addButton}>
        <MenuSelectorTextButton
          actionList={marketingActionOptions}
          customColor={SequentialMarketingColors.MARKETING_ACTION_COLOR}
          isDisabled={values?.marketingActions?.length >= 5}
          label={
            addActionLabel || `+ ${t('cadence.marketingAction.addAction')}`
          }
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  marketingAction: {
    marginBottom: theme.spacing(4),
  },
  container: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  content: {
    marginBottom: theme.spacing(4),
  },
  addButton: {
    display: 'flex',
  },
}));

const withFormikWrapper = withFormik<HOCProps, FormValues>({
  enableReinitialize: true,
  validateOnMount: true,
  mapPropsToValues: ({ marketingActions }) => {
    return {
      marketingActions: (marketingActions ?? []) as StepMarketingActions[],
    };
  },
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values.marketingActions, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
  validationSchema: multipleMarketingActionsValidationSchema,
});

export default React.memo(withFormikWrapper(MultipleMarketingActionForm));
