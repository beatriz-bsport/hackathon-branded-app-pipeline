import React, { useState, useRef } from 'react';
import { compose } from 'recompose';
import { DateTime } from 'luxon';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps } from 'formik';

import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {
  Button,
  ButtonBase,
  makeStyles,
  Paper,
  Popover,
  Theme,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  AlertError,
  DateField,
  defaultHandleSubmit,
  // @ts-expect-error
} from '#src/components/forms';
import { DateFilterEnum } from '#src/libs/datatype-filtering/types';
import { SINGLE_RAPID_SELECTIONS } from '#src/components/date/constants';

export type OwnProps = {
  isDisabled?: boolean;
  keepHours?: boolean;
  singleDate?: boolean;
  isRapidSelectionDisplayed?: boolean;
} & Values &
  StylesProps;

export type Values = {
  date: DateTime | number;
  timePeriod: DateFilterEnum;
};

type FormikHOCProps = { onSubmit: (values: Values) => void };

export type Props = OwnProps & FormikProps<Values>;

const DatePickerSelectorSchema = Yup.object().shape({
  date: Yup.date().required('required'),
  timePeriod: Yup.string(),
});

export const TIME_PERIODS_SINGLE = ['today'];

const DatePickerSelector: React.FC<Props> = ({
  date,
  isFullWidth,
  isValid,
  timePeriod,
  values,
  isDisabled = false,
  keepHours = false,
  singleDate = false,
  setFieldValue,
  handleSubmit,
  isRapidSelectionDisplayed = true,
}) => {
  const classes = useStyles({ isFullWidth });
  const { t } = useTranslation('reporting');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    setFieldValue('timePeriod', timePeriod);
    setFieldValue(
      'date',
      typeof date === 'number' ? DateTime.fromSeconds(date) : date,
    );
  };

  const handleOpen = () => {
    if (isDisabled) return;
    setIsOpen(true);
  };

  const handleSelection =
    (selection: { timePeriod: DateFilterEnum; getTimeStamp: () => number }) =>
    () => {
      setFieldValue('timePeriod', selection.timePeriod);
      keepHours && typeof values.date !== 'number'
        ? setFieldValue(
            'date',
            DateTime.fromSeconds(selection.getTimeStamp())
              .startOf('day')
              .plus({ hours: values.date.hour, minutes: values.date.minute }),
          )
        : setFieldValue(
            'date',
            DateTime.fromSeconds(selection.getTimeStamp()).startOf('day'),
          );
    };

  const getDisplayDate = () => {
    const selection = SINGLE_RAPID_SELECTIONS.find(
      (s) => s.timePeriod === values.timePeriod,
    );

    if (selection && isRapidSelectionDisplayed)
      return (
        <Typography display="inline">
          {t(`header.helper.${selection.timePeriod}`)}
        </Typography>
      );

    if (values.date)
      return (
        <div>
          {!singleDate && (
            <Typography color="textSecondary" display="inline">
              {t('header.fromInDateContext')}
            </Typography>
          )}
          <Typography display="inline">
            {(typeof date === 'number'
              ? DateTime.fromSeconds(date)
              : date
            ).toLocaleString(DateTime.DATE_SHORT)}
          </Typography>
        </div>
      );

    return <Typography display="inline">{t('header.selectDate')}</Typography>;
  };

  const handleResetTimePeriod = () => {
    setFieldValue('timePeriod', 'custom');
  };

  const onSubmit = () => {
    // @ts-expect-error: to fix later and test it well to make sure nothing is broken
    handleSubmit(values);
    setIsOpen(false);
  };

  return (
    <Form
      className={classNames({
        [classes.formContainer]: isFullWidth,
      })}
    >
      <div ref={menuRef} className={classes.container}>
        <ButtonBase onClick={handleOpen}>
          <CalendarTodayIcon className={classes.icon} color="disabled" />
          {getDisplayDate()}
        </ButtonBase>
      </div>
      <Popover
        anchorEl={menuRef?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handleClose}
        open={isOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper>
          <div className={classes.menu}>
            <Typography className={classes.row} color="textSecondary">
              {t('header.selectDate')}
            </Typography>
            <div className={classes.row}>
              <DateField
                label={t('header.start')}
                name="date"
                onChange={handleResetTimePeriod}
              />
              <AlertError name="date" />
            </div>
            {isRapidSelectionDisplayed && (
              <div className={classes.rapidSelection}>
                <Typography color="textSecondary">
                  {t('header.rapidChoice')}
                </Typography>
                {SINGLE_RAPID_SELECTIONS.map((selection) => (
                  <ButtonBase
                    key={selection.timePeriod}
                    className={classes.button}
                    onClick={handleSelection(selection)}
                  >
                    <Typography>
                      {t(`header.helper.${selection.timePeriod}`)}
                    </Typography>
                  </ButtonBase>
                ))}
              </div>
            )}
            <Button
              className={classes.submit}
              color="primary"
              disabled={!isValid}
              onClick={onSubmit}
              variant="contained"
            >
              {t('header.save')}
            </Button>
          </div>
        </Paper>
      </Popover>
    </Form>
  );
};

type StylesProps = { isFullWidth?: boolean };

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  formContainer: {
    display: 'flex',
    width: '45%',
  },
  menu: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1) / 2,
    padding: theme.spacing(1),
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
    backgroundColor: 'white',
    width: ({ isFullWidth }) => isFullWidth && '100%',
    justifyContent: ({ isFullWidth }) => isFullWidth && 'flex-start',
  },
  icon: {
    marginRight: theme.spacing(1),
    height: 20,
    width: 20,
  },
  row: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  submit: {
    marginTop: theme.spacing(2),
    alignSelf: 'flex-end',
  },
  rapidSelection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'flex-start',
    width: '100%',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export default compose<Props, OwnProps & FormikHOCProps>(
  withFormik<Props & FormikHOCProps, Values>({
    enableReinitialize: true,
    mapPropsToValues: ({ date, timePeriod }) => {
      return {
        date: typeof date === 'number' ? DateTime.fromSeconds(date) : date,
        timePeriod,
      };
    },
    validationSchema: DatePickerSelectorSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(DatePickerSelector);
