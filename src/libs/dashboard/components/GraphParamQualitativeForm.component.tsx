import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
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
      <Typography variant="body1" className={classes.selectLabel}>
        {t('graphFormDrawer.labels.groupByField')}
      </Typography>
      <div className={classes.row}>
        <div>
          <MaterialUiSingleSelectorField
            className={classNames(classes.selectInput)}
            options={groupByOptions}
            name="graph_params.group_by"
            placeholder={t(
              'graphFormDrawer.placeholders.dashboardGraphIdentifier',
            )}
            isDisabled={groupByOptions.length === 1}
            inScrollBar
          />
        </div>
      </div>

      <Typography
        variant="body1"
        className={classNames(
          classes.selectLabel,
          classes.selectLabelWithMargin,
        )}
      >
        {t('graphFormDrawer.labels.dataToDisplay')}
      </Typography>
      <div className={classes.row}>
        <div>
          <MaterialUiSingleSelectorField
            className={classes.selectInput}
            options={groupByValueOptions}
            name="graph_params.group_by_value"
            placeholder={t(
              'graphFormDrawer.placeholders.dashboardGraphIdentifier',
            )}
            isDisabled={groupByValueOptions.length === 1}
            inScrollBar
          />
        </div>
      </div>
      {helperText && (
        <Typography variant="body2" className={classes.helperText}>
          {helperText}
        </Typography>
      )}
    </>
  );
};

export default React.memo(GraphParamQualitativeForm);
