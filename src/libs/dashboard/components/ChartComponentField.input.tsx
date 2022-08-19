import React from 'react';
import chroma from 'chroma-js';
import { Field, useField } from 'formik';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import classNames from 'classnames';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import TableChartIcon from '@material-ui/icons/TableChart';
import { getTextColorFromRGB } from '../../../utils/color';

const CHART_ICONS = {
  pie: DonutLargeIcon,
  bar: EqualizerIcon,
  timeslots: TableChartIcon,
  area: ShowChartIcon,
  qualitativeBar: EqualizerIcon,
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    gap: theme.spacing(4),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: chroma('black').alpha(0.08).hex(),
    textAlign: 'center',
    width: 120,
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
  },
  flex1: {
    flex: 1,
  },
}));

type BaseFieldProps = {
  name: string;
};

type ChartComponentFieldOwnProps = {
  options: Array<'bar' | 'area' | 'pie' | 'timeslots' | 'qualitativeBar'>;
  className?: string;
};

export const ChartComponentFieldInput = (
  props: ChartComponentFieldOwnProps & BaseFieldProps,
) => {
  const [field, , helpers] = useField<string>(props.name);

  const { t } = useTranslation('dashboard');
  const classes = useStyles();

  return (
    <Field {...props}>
      {() => (
        <div className={classes.container}>
          {props.options.map((option) => {
            const Icon = CHART_ICONS[option];

            return (
              <ButtonBase
                key={option}
                className={classNames(classes.buttonContainer, {
                  [classes.selected]: field.value === option,
                })}
                onClick={() => {
                  helpers.setValue(option);
                  helpers.setTouched(true);
                }}
              >
                <Icon className={classes.flex1} />
                <Typography variant="body2" className={classes.flex1}>
                  {t(`graphFormDrawer.chartComponents.${option}`)}
                </Typography>
              </ButtonBase>
            );
          })}
        </div>
      )}
    </Field>
  );
};
