import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import moment from 'moment-timezone';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';
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
} from '#components/forms';
import { getTextColorFromRGB } from '../../../utils/color';

type Props = {
  open: boolean;
  onCancel: () => void;
};

const EditClockinModalSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date()
    .required('required')
    .test(
      'is-after-start',
      'errors.end_before_start',
      function checkIsAfterStart(dateEnd) {
        const { dateStart } = this.parent;
        return moment(dateStart).isSameOrBefore(dateEnd);
      },
    ),
});

export const EditClockinModal: React.FC<Props> = ({ open, onCancel }) => {
  const { t } = useTranslation(['clockIn']);
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onCancel}>
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
            <DateField name="dateEnd" outsideErrorDisplay />
            <TimeField name="dateEnd" outsideErrorDisplay />
            <AlertError name="dateEnd" />

            <div className={classes.hr} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={onCancel}>
              {t('editModal.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.primaryButton}
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
  withFormik({
    mapPropsToValues: ({ config }) => {
      return {
        dateStart: moment(config.dateStart),
        dateEnd: moment(config.dateEnd),
      };
    },
    validationSchema: EditClockinModalSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(EditClockinModal);
