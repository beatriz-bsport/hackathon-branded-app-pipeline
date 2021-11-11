import React, { useCallback, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import { MaterialStyleType } from '../../../utils/types';
import DateInput from '../../../components/input/DateInput.component';
import NumericInput from '../../../components/input/NumericInput.component';

interface OwnProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    minDate: string;
    maxDate: string;
    nbDays: number;
    note: string;
  }) => void;
}

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

const PaymentPackMassExtensionDialog: React.FC<Props> = (props) => {
  const { open, onClose, onSubmit } = props;
  const [minDate, setMinDate] = useState(
    moment().startOf('month').format('YYYY-MM-DD'),
  );
  const [maxDate, setMaxDate] = useState(
    moment().endOf('month').format('YYYY-MM-DD'),
  );
  const [nbDays, setNbDays] = useState(1);
  const [note, setNote] = useState('');

  const { classes, t } = props;

  const handleSubmit = useCallback(() => {
    onSubmit({
      minDate,
      maxDate,
      nbDays,
      note,
    });
  }, [minDate, maxDate, nbDays, note, onSubmit]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{`${t('massExtension.title')}`}</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.helpTextContainer}>
          <HelpOutlineIcon fontSize="large" />
          <Typography className={classes.helpText}>
            {t('massExtension.helpText')}
          </Typography>
        </DialogContentText>

        <Typography className={classes.marginTop}>
          {t('massExtension.dateHelpText')}
        </Typography>

        <div className={classes.dateContainer}>
          <DateInput
            className={classes.dateInput}
            label={t('massExtension.minDate')}
            type="date"
            value={minDate}
            onChange={(value: string) => setMinDate(value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <DateInput
            className={classes.dateInput}
            label={t('massExtension.maxDate')}
            type="date"
            value={maxDate}
            onChange={(value: string) => setMaxDate(value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        <NumericInput
          classes={{ textInput: classes.marginTop }}
          value={nbDays}
          fullWidth
          label={t('extension.create.nbDays.label')}
          onChange={(ev: any) => setNbDays(ev.target.value)}
          InputProps={{
            inputProps: { step: 1, min: 0 },
          }}
        />
        <TextField
          className={classes.marginTop}
          variant="outlined"
          value={note}
          fullWidth
          inputProps={{ maxLength: 42 }}
          label={t('extension.create.note.label')}
          onChange={(ev) => setNote(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          {t('massExtension.cancel')}
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {t('massExtension.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = (theme: Theme) => ({
  helpTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpText: {
    marginLeft: theme.spacing(2),
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  dateInput: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(4),
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['paymentPack']),
)(PaymentPackMassExtensionDialog);
