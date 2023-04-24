// @ts-nocheck
import React, { useMemo, useEffect } from 'react';
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
  setFieldValue: (fieldName: string, fieldValue: any) => void;
};

const GraphParamTimeslotsForm: React.FC<Props> = ({
  currentGraphMetadata,
  setFieldValue,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('dashboard');

  const dateForSlots = useMemo(
    () =>
      currentGraphMetadata.choices.graph_families.week_timeslots
        .date_for_slots[0],
    [currentGraphMetadata],
  );

  const refForFrequency = useMemo(
    () =>
      currentGraphMetadata.choices.graph_families.week_timeslots
        .ref_for_frequency[0],
    [currentGraphMetadata],
  );

  // Harcoded values, useEffect sets the value when the form mounts
  // the selector is disabled and can't change the value, his purpose is
  // to show the displayed data
  useEffect(() => {
    setFieldValue('graph_params.date_for_slots', dateForSlots);
    setFieldValue(
      'date_filter_config.groups[0].filters_data[0].identifier',
      dateForSlots,
    );
    setFieldValue('graph_params.ref_for_frequency', refForFrequency);
  }, [setFieldValue, dateForSlots, refForFrequency]);

  return (
    <>
      <Typography variant="body1" className={classes.selectLabel}>
        {t('graphFormDrawer.labels.dataToDisplay')}
      </Typography>
      <div className={classes.row}>
        <div>
          <MaterialUiSingleSelectorField
            className={classNames(classes.selectInput)}
            name="graph_params.date_for_slots"
            options={[
              {
                // This value matches the one from Formik's values so that this entry
                // shows as selected
                value: dateForSlots,
                label: t('dataSourceIdentifiers.booking_effectif_timeslots'),
              },
            ]}
            placeholder={t(
              'graphFormDrawer.placeholders.dashboardGraphIdentifier',
            )}
            isDisabled
            inScrollBar
          />
        </div>
      </div>

      <Typography variant="body2" className={classes.helperText}>
        {t('dashboard:graphFormDrawer.helperText.booking_effectif_timeslots')}
      </Typography>
    </>
  );
};

export default React.memo(GraphParamTimeslotsForm);
