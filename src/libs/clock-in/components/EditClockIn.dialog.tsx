import React from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';

import * as Yup from 'yup';
import { withFormik, Form, FormikProps } from 'formik';
import chroma from 'chroma-js';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import StopIcon from '@material-ui/icons/Stop';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import {
  AlertError,
  DateField,
  TimeField,
  defaultHandleSubmit,
  // @ts-expect-error
} from '#components/forms';
import { getTextColorFromRGB } from '../../../utils/color';

export type Props = {
  clockInId: number | undefined;
  open: boolean;
  onCancel: () => void;
  onSubmit: (clockInId: number, values: Values) => void;
} & Values;

export type Values = {
  // eslint-disable-next-line react/no-unused-prop-types
  dateStart: DateTime;
  // eslint-disable-next-line react/no-unused-prop-types
  dateEnd: DateTime;
};

type HOCProps = Props & FormikProps<Values>;

const EditClockinModalSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date()
    .required('required')
    .test(
      'is-after-start',
      'errors.end_before_start',
      function checkIsAfterStart(dateEnd) {
        const { dateStart } = this.parent;
        return dateStart <= dateEnd;
      },
    ),
});

export const EditClockinModal: React.FC<HOCProps> = ({
  clockInId,
  open,
  values,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation(['clockIn']);
  const classes = useStyles();

  const handleSubmit = React.useCallback(
    () => onSubmit(clockInId, values),
    [clockInId, onSubmit, values],
  );

  return (
    <Dialog
      key={`EditClockInDialog-${clockInId}`}
      onClose={onCancel}
      open={open}
    >
      <div className={classes.dialog}>
        <Form>
          <DialogTitle>{t('editModal.title')}</DialogTitle>
          <DialogContent>
            <div className={classes.subtitle}>
              <PowerSettingsNewIcon className={classes.icon} />
              <div>{t('editModal.startingTime')}</div>
            </div>
            <DateField name="dateStart" />
            <TimeField name="dateStart" />
            <AlertError name="dateStart" />

            <div className={classes.hr} />
            <div className={classes.subtitle}>
              <StopIcon className={classes.icon} />
              <div>{t('editModal.endingTime')}</div>
            </div>
            <DateField outsideErrorDisplay name="dateEnd" />
            <TimeField outsideErrorDisplay name="dateEnd" />
            <AlertError name="dateEnd" />

            <div className={classes.hr} />
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel} variant="contained">
              {t('editModal.cancel')}
            </Button>
            <Button
              className={classes.primaryButton}
              color="primary"
              onClick={handleSubmit}
              type="submit"
              variant="contained"
            >
              {t('editModal.confirm')}
            </Button>
          </DialogActions>
        </Form>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    minWidth: 600,
  },
  primaryButton: {
    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: theme.palette.grey[500],
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

export default compose<any, Props>(
  withFormik<HOCProps, Values>({
    mapPropsToValues: ({ dateStart, dateEnd }) => {
      return {
        dateStart,
        dateEnd,
      };
    },
    validationSchema: EditClockinModalSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(EditClockinModal);
