// @ts-nocheck
import React, { useState, useRef } from 'react';
import { compose } from 'recompose';
import moment, { Moment } from 'moment-timezone';
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
import { AlertError, DateField, defaultHandleSubmit } from '#components/forms';
import { DateFilterEnum } from '#libs/reporting/types';

export type Props = {
  date: number;
  timePeriod: DateFilterEnum;
  isDisabled?: boolean;
  onSubmit: (values: Values) => void;
};

type Values = {
  date: Moment;
  timePeriod: DateFilterEnum;
};

const DatePickerSelectorSchema = Yup.object().shape({
  date: Yup.date().required('required'),
  timePeriod: Yup.string(),
});

export const TIME_PERIODS_SINGLE = ['today'];

const DatePickerSelector: React.FC<Props & FormikProps<Values>> = ({
  values,
  isValid,
  date,
  timePeriod,
  isDisabled = false,
  setFieldValue,
  handleSubmit,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['reporting']);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    setFieldValue('timePeriod', timePeriod);
    setFieldValue('date', moment.unix(date));
  };

  const handleOpen = () => {
    if (isDisabled) return;
    setIsOpen(true);
  };

  const handleSelection =
    (selection: { timePeriod: DateFilterEnum; getTimeStamp: () => number }) =>
    () => {
      setFieldValue('timePeriod', selection.timePeriod);
      setFieldValue(
        'date',
        moment.unix(selection.getTimeStamp()).startOf('day'),
      );
    };

  const getDisplayDate = () => {
    const selection = RAPID_SELECTIONS.find(
      (s) => s.timePeriod === values.timePeriod,
    );

    if (selection)
      return (
        <Typography display="inline">
          {' '}
          {t(`header.helper.${selection.timePeriod}`)}
        </Typography>
      );

    return (
      <>
        <Typography color="textSecondary" display="inline">
          {t('header.fromInDateContext')}
        </Typography>
        <Typography display="inline">{values.date.format('L')}</Typography>
      </>
    );
  };

  const handleResetTimePeriod = () => {
    setFieldValue('timePeriod', 'custom');
  };

  const onSubmit = () => {
    handleSubmit(values);
    setIsOpen(false);
  };

  return (
    <Form>
      <ButtonBase
        ref={menuRef}
        className={classes.container}
        onClick={handleOpen}
      >
        <CalendarTodayIcon className={classes.icon} color="disabled" />
        {getDisplayDate()}
      </ButtonBase>

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
            <div className={classes.rapidSelection}>
              <Typography color="textSecondary">
                {t('header.rapidChoice')}
              </Typography>
              {RAPID_SELECTIONS.map((selection) => (
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

const RAPID_SELECTIONS = [
  {
    timePeriod: 'today',
    getTimeStamp: () => moment().unix(),
  },
];

const useStyles = makeStyles((theme: Theme) => ({
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

export default compose<any, Props>(
  withFormik({
    mapPropsToValues: ({ date, timePeriod }) => {
      return {
        date: moment.unix(date),
        timePeriod,
      };
    },
    validationSchema: DatePickerSelectorSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(DatePickerSelector);
