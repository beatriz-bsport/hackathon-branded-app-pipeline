import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { DataSourceDashboardGraphMetadata } from '#src/libs/dashboard/types';
import { MaterialUiSingleSelectorField } from '#src/libs/custom-form/components/GenericFormik.input';

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  selectInput: {
    minWidth: 290,
  },
  selectInputWithMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  selectLabel: {
    color: theme.palette.grey[600],
    marginBottom: theme.spacing(1),
  },
  selectLabelWithMargin: {
    marginTop: theme.spacing(2),
  },
  helperText: {
    color: theme.palette.grey[600],
  },
}));

type Props = {
  currentGraphMetadata: DataSourceDashboardGraphMetadata;
  helperText: string | null;
};

const GraphParamQualitativeForm: React.FC<Props> = ({
  currentGraphMetadata,
  helperText,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('dashboard');

  // Available options for dashboard_graph.group_by selector
  const groupByOptions = useMemo(
    () => [
      ...(currentGraphMetadata.choices.graph_families.qualitative?.group_by.map(
        (fieldIdentifier) => ({
          value: fieldIdentifier,
          label: t(`dataSourceIdentifiers.${fieldIdentifier}`),
        }),
      ) ?? []),
    ],
    [currentGraphMetadata, t],
  );

  // Available options for dashboard_graph.group_by_value selector
  const groupByValueOptions = useMemo(
    () => [
      ...(currentGraphMetadata.choices.graph_families.qualitative?.group_by_value.map(
        (fieldIdentifier) => ({
          value: fieldIdentifier,
          label: t(`dataSourceIdentifiers.${fieldIdentifier}`),
        }),
      ) ?? []),
    ],
    [currentGraphMetadata, t],
  );

  return (
    <>
      <Typography className={classes.selectLabel} variant="body1">
        {t('graphFormDrawer.labels.groupByField')}
      </Typography>
      <div className={classes.row}>
        <div>
          <MaterialUiSingleSelectorField
            inScrollBar
            className={classNames(classes.selectInput)}
            isDisabled={groupByOptions.length === 1}
            name="graph_params.group_by"
            // @ts-expect-error
            options={groupByOptions}
            placeholder={t(
              'graphFormDrawer.placeholders.dashboardGraphIdentifier',
            )}
          />
        </div>
      </div>

      <Typography
        className={classNames(
          classes.selectLabel,
          classes.selectLabelWithMargin,
        )}
        variant="body1"
      >
        {t('graphFormDrawer.labels.dataToDisplay')}
      </Typography>
      <div className={classes.row}>
        <div>
          <MaterialUiSingleSelectorField
            inScrollBar
            className={classes.selectInput}
            isDisabled={groupByValueOptions.length === 1}
            name="graph_params.group_by_value"
            // @ts-expect-error
            options={groupByValueOptions}
            placeholder={t(
              'graphFormDrawer.placeholders.dashboardGraphIdentifier',
            )}
          />
        </div>
      </div>
      {helperText && (
        <Typography className={classes.helperText} variant="body2">
          {helperText}
        </Typography>
      )}
    </>
  );
};

export default React.memo(GraphParamQualitativeForm);
