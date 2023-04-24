// @ts-nocheck
import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { DataSourceDashboardGraphMetadata } from '#libs/dashboard/types';
import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  selectInput: {
    minWidth: 290,
  },
  selectLabel: {
    color: theme.palette.grey[600],
    marginBottom: theme.spacing(1),
  },
  helperText: {
    color: theme.palette.grey[600],
  },
  selectLabelWithMargin: {
    marginTop: theme.spacing(2),
  },
}));

type Props = {
  currentGraphMetadata: DataSourceDashboardGraphMetadata;
  helperText: string | null;
  date_value: string;
  setFieldValue: (fieldName: string, value: string) => void;
};

const GraphParamTemporalForm: React.FC<Props> = ({
  currentGraphMetadata,
  helperText,
  date_value,
  setFieldValue,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('dashboard');

  // Available options for dashboard_graph.date_value selector
  const dateValueOptions = useMemo(
    () => [
      ...(currentGraphMetadata.choices.graph_families.temporal?.date_value.map(
        (fieldIdentifier) => ({
          value: fieldIdentifier,
          label: t(`dataSourceIdentifiers.${fieldIdentifier}`),
        }),
      ) ?? []),
    ],
    [currentGraphMetadata, t],
  );

  const aggregationFunctionNameChoices = useMemo(() => {
    const aggregationOptions = [];
    const matchingMetadata = currentGraphMetadata.metadata.find(
      (metadata) => metadata.identifier === date_value,
    );

    if (!matchingMetadata.summable && !matchingMetadata.averageable)
      return [
        { label: t('graphFormDrawer.aggregation.count'), value: 'count' },
      ];
    if (matchingMetadata.summable) {
      aggregationOptions.push(
        {
          label: t('graphFormDrawer.aggregation.sum'),
          value: 'sum',
        },
        {
          label: t('graphFormDrawer.aggregation.min'),
          value: 'min',
        },
        {
          label: t('graphFormDrawer.aggregation.max'),
          value: 'max',
        },
      );
    }
    if (matchingMetadata.averageable) {
      aggregationOptions.push({
        label: t('graphFormDrawer.aggregation.avg'),
        value: 'avg',
      });
    }

    return aggregationOptions;
  }, [currentGraphMetadata, date_value, t]);

  const handleDateValueChange = useCallback(
    ({ value }) => {
      setFieldValue('graph_params.date_value', value);
      setFieldValue('graph_params.aggregation_function_name', 'sum');
    },
    [setFieldValue],
  );

  return (
    <>
      <Typography variant="body1" className={classes.selectLabel}>
        {t('graphFormDrawer.labels.dataToDisplay')}
      </Typography>
      <div className={classes.row}>
        <div>
          <MaterialUiSingleSelectorField
            className={classes.selectInput}
            options={dateValueOptions}
            name="graph_params.date_value"
            placeholder={t(
              'graphFormDrawer.placeholders.dashboardGraphIdentifier',
            )}
            onChange={handleDateValueChange}
            isDisabled={dateValueOptions.length === 1}
            inScrollBar
          />
        </div>
      </div>
      {helperText && (
        <Typography variant="body2" className={classes.helperText}>
          {helperText}
        </Typography>
      )}
      {aggregationFunctionNameChoices.length &&
        aggregationFunctionNameChoices[0].value !== 'count' && (
          <>
            <Typography
              variant="body1"
              className={classNames(
                classes.selectLabel,
                classes.selectLabelWithMargin,
              )}
            >
              {t('graphFormDrawer.labels.aggregationName')}
            </Typography>
            <div className={classes.row}>
              <div>
                <MaterialUiSingleSelectorField
                  className={classes.selectInput}
                  options={aggregationFunctionNameChoices}
                  name="graph_params.aggregation_function_name"
                  placeholder={t(
                    'graphFormDrawer.placeholders.aggregationSelector',
                  )}
                  isDisabled={aggregationFunctionNameChoices.length === 1}
                  inScrollBar
                />
              </div>
            </div>
          </>
        )}
    </>
  );
};

export default React.memo(GraphParamTemporalForm);
