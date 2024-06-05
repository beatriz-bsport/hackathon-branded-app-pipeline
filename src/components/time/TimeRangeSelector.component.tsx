import React, { useState, useRef, useCallback } from 'react';
import { DateTime, Settings } from 'luxon';
import { withFormik, Form, FormikProps, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { MuiPickersUtilsProvider, TimePicker } from 'material-ui-pickers';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
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
import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';
// @ts-expect-error
import { defaultHandleSubmit } from '#components/forms';

const ALL_DAY_SELECTION = {
  timePeriod: 'allDay',
  timeStart: '00:00:00',
  timeEnd: '23:59:59',
};

export type Props = {
  originalTimeStart: string;
  originalTimeEnd: string;
  originalTimeWindowPeriod: string;
  isDisabled?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (values: Values) => void;
};

type Values = {
  timeStart: string;
  timeEnd: string;
  timeWindowPeriod: string;
};

const timeValidationSchema = Yup.object().shape({
  timeStart: Yup.string().required('required'),
  timeEnd: Yup.string()
    .required('required')
    .test(
      'is-after-start',
      'End time should be later than start time',
      function checkIsAfterStart(timeEnd) {
        const { timeStart } = this.parent;
        return (
          DateTime.fromFormat(timeStart, 'HH:mm:ss') <=
          DateTime.fromFormat(timeEnd, 'HH:mm:ss')
        );
      },
    ),
});

const TimeRangeSelector: React.FC<Props & FormikProps<Values>> = ({
  values,
  isValid,
  isDisabled = false,
  setFieldValue,
  handleSubmit,
  setFieldTouched,
  originalTimeEnd,
  originalTimeStart,
  originalTimeWindowPeriod,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement | null>(null);

  const formatTime = useCallback((datetime: DateTime) => {
    return datetime.toFormat('HH:mm:ss');
  }, []);

  const handleClose = useCallback(() => {
    setFieldValue('timeStart', originalTimeStart, false);
    setFieldValue('timeEnd', originalTimeEnd, false);

    // Using setTimeout to delay the validation until after timeStart and timeEnd values are updated.
    // Without this delay, validation happens before these values update, leading to validation on old values.
    setTimeout(() =>
      setFieldValue('timeWindowPeriod', originalTimeWindowPeriod, true),
    );
    setIsOpen(false);
  }, [
    originalTimeEnd,
    originalTimeStart,
    originalTimeWindowPeriod,
    setFieldValue,
  ]);

  const handleOpen = useCallback(() => {
    if (isDisabled) {
      return;
    }
    setIsOpen(true);
  }, [isDisabled, setIsOpen]);

  const handleTimeStartChange = useCallback(
    (datetime: DateTime) => {
      setFieldTouched('timeStart');
      setFieldValue('timeStart', formatTime(datetime));
      setFieldValue('timeWindowPeriod', 'custom', false);
    },
    [setFieldTouched, setFieldValue, formatTime],
  );

  const handleTimeEndChange = useCallback(
    (datetime: DateTime) => {
      setFieldTouched('timeEnd');
      setFieldValue('timeEnd', formatTime(datetime));
      setFieldValue('timeWindowPeriod', 'custom', false);
    },
    [setFieldTouched, setFieldValue, formatTime],
  );

  const handleSelection = useCallback(() => {
    const { timeStart, timeEnd, timePeriod } = ALL_DAY_SELECTION;
    setFieldValue('timeWindowPeriod', timePeriod, false);
    setFieldValue('timeStart', timeStart, true);
    setFieldValue('timeEnd', timeEnd, true);
  }, [setFieldValue]);

  const getDisplayTime = () => {
    if (values.timeWindowPeriod === 'allDay')
      return (
        <Typography display="inline">
          {' '}
          {t(`header.helper.${ALL_DAY_SELECTION.timePeriod}`)}
        </Typography>
      );
    return (
      <>
        <Typography color="textSecondary" display="inline">
          {t('header.fromInTimeContext')}
        </Typography>
        <Typography display="inline">
          {values.timeStart.split(':').slice(0, 2).join(':')}
        </Typography>
        <Typography color="textSecondary" display="inline">
          {t('header.toInTimeContext')}
        </Typography>
        <Typography display="inline">
          {values.timeEnd.split(':').slice(0, 2).join(':')}
        </Typography>
      </>
    );
  };

  const onSubmit = useCallback(() => {
    handleSubmit();
    setIsOpen(false);
  }, [handleSubmit, setIsOpen]);

  return (
    <Form>
      <ButtonBase
        ref={menuRef}
        className={classes.container}
        onClick={handleOpen}
      >
        <AccessTimeIcon className={classes.icon} color="disabled" />
        {getDisplayTime()}
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
              {t('header.selectTimeRange')}
            </Typography>
            <div className={classes.row}>
              <MuiPickersUtilsProvider
                locale={Settings.defaultLocale}
                utils={LocalizedLuxonUtils}
              >
                <div>
                  <TimePicker
                    ampm={false}
                    label={t('header.start')}
                    onChange={handleTimeStartChange}
                    value={DateTime.fromFormat(values.timeStart, 'HH:mm:ss')}
                  />
                </div>
                <div>
                  <TimePicker
                    ampm={false}
                    label={t('header.end')}
                    onChange={handleTimeEndChange}
                    value={DateTime.fromFormat(values.timeEnd, 'HH:mm:ss')}
                  />
                  <ErrorMessage
                    name="timeEnd"
                    render={(message) => (
                      <Typography
                        className={classes.alertError}
                        variant="body2"
                      >
                        {message}
                      </Typography>
                    )}
                  />
                </div>
              </MuiPickersUtilsProvider>
            </div>
            <div className={classes.rapidSelection}>
              <Typography color="textSecondary">
                {t('header.rapidChoice')}
              </Typography>
              <ButtonBase
                key={ALL_DAY_SELECTION.timePeriod}
                className={classes.button}
                onClick={handleSelection}
              >
                <Typography>
                  {t(`header.helper.${ALL_DAY_SELECTION.timePeriod}`)}
                </Typography>
                <Typography color="textSecondary" variant="caption">
                  {t('header.fromToInTimeContext', {
                    to: ALL_DAY_SELECTION.timeEnd,
                    from: ALL_DAY_SELECTION.timeStart,
                  })}
                </Typography>
              </ButtonBase>
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
    height: 24,
    width: 24,
  },
  row: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  submit: {
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
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
}));

export default withFormik<
  Props,
  {
    timeStart: string;
    timeEnd: string;
    timeWindowPeriod: string;
  }
>({
  mapPropsToValues: ({
    originalTimeStart,
    originalTimeEnd,
    originalTimeWindowPeriod,
  }) => {
    return {
      timeStart: originalTimeStart,
      timeEnd: originalTimeEnd,
      timeWindowPeriod: originalTimeWindowPeriod,
    };
  },
  validationSchema: timeValidationSchema,
  handleSubmit: defaultHandleSubmit,
  validateOnBlur: true,
})(TimeRangeSelector);
