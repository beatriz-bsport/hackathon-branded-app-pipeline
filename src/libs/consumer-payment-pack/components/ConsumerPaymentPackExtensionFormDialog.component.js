// @flow
import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';

import moment from 'moment-timezone';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose, withState } from 'recompose';

import { formatAsDate } from '../../../utils/datetime';
import NumericInput from '../../../components/input/NumericInput.component';
import DateInput from '#components/input/DateInput.component';

import type { ConsumerPaymentPack } from '../types';

type Props = {
  open: boolean,
  consumerPaymentPack: ConsumerPaymentPack,
  onClose: () => void,
  onSubmit: ({ note: string, nb_days: number }) => void,

  note: string,
  setNote: (string) => void,
  nbDays: number,
  setNbDays: (number) => void,

  t: TFunction,
  classes: Object,
  processing: boolean,
  timezone: string,
};
export const ConsumerPaymentPackExtensionFormDialog = (props: Props) => {
  const {
    consumerPaymentPack,
    setNbDays,
    timezone,
    setNote,
    onSubmit,
    note,
    nbDays,
  } = props;

  // CLEAN ME : Declare an enum in a TS file and import it here
  const EXTENSION_OPTIONS = [
    {
      label: props.t('extension.options.addNumberOfDays'),
      value: 'numericInput',
    },
    {
      label: props.t('extension.options.selectNewEndDate'),
      value: 'datePicker',
    },
  ];

  const [selectedExtensionOption, setSelectedExtensionOption] = React.useState(
    EXTENSION_OPTIONS[0].value,
  );

  const handleSelectOption = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedExtensionOption(event.target.value);
    },
    [setSelectedExtensionOption],
  );

  const endingDate = React.useMemo(
    () => moment(consumerPaymentPack?.ending_date).tz(timezone),
    [consumerPaymentPack?.ending_date, timezone],
  );

  const newDate = React.useMemo(
    () =>
      moment(consumerPaymentPack?.ending_date).tz(timezone).add(nbDays, 'days'),
    [consumerPaymentPack?.ending_date, timezone, nbDays],
  );

  const handleSelectDate = React.useCallback(
    (selectedDate: moment.Moment) => {
      const numberOfDaysToAdd = selectedDate.diff(endingDate, 'days');
      setNbDays(numberOfDaysToAdd);
    },
    [endingDate, setNbDays],
  );

  const handleChangeNumericInput = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setNbDays(event.target.value),
    [setNbDays],
  );

  const handleChangeNote = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setNote(event.target.value),
    [setNote],
  );

  const handleSubmit = React.useCallback(
    () => onSubmit({ note, nb_days: nbDays }),
    [onSubmit, note, nbDays],
  );

  return (
    <Dialog open={props.open}>
      {props.processing && <LinearProgress />}
      <DialogTitle>{props.t('extension.create.title')}</DialogTitle>
      <DialogContent>
        <div className={props.classes.content}>
          <Grid item xs={12}>
            <RadioGroup
              value={selectedExtensionOption}
              onChange={handleSelectOption}
            >
              {EXTENSION_OPTIONS.map(({ value, label: l }) => (
                <div key={value}>
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio />}
                    label={l}
                    disabled={props.processing}
                  />
                </div>
              ))}
            </RadioGroup>
          </Grid>
          {selectedExtensionOption === 'numericInput' && (
            <NumericInput
              value={nbDays}
              fullWidth
              label={props.t('extension.create.nbDays.label')}
              onChange={handleChangeNumericInput}
              InputProps={{
                inputProps: { step: 1, min: 0 },
              }}
              disabled={props.processing}
            />
          )}
          {selectedExtensionOption === 'datePicker' && consumerPaymentPack && (
            <DateInput
              value={newDate}
              onChange={handleSelectDate}
              minDate={consumerPaymentPack?.ending_date}
              label={props.t('extension.create.datePicker.label')}
              disabled={props.processing}
            />
          )}
          <TextField
            variant="outlined"
            value={note}
            fullWidth
            inputProps={{ maxLength: 42 }}
            label={props.t('extension.create.note.label')}
            onChange={handleChangeNote}
            className={props.classes.field}
          />
          {props.consumerPaymentPack ? (
            <div className={props.classes.dateExplainer}>
              <Typography variant="subtitle2">
                {props.t('extension.create.explain.oldDate') +
                  formatAsDate(props.consumerPaymentPack.ending_date)}
              </Typography>
              <Typography variant="subtitle2">
                {props.t('extension.create.explain.newDate') +
                  formatAsDate(newDate)}
              </Typography>
            </div>
          ) : null}
          <Typography variant="subtitle2" />
          <div className={props.classes.warningContainer}>
            <WarningIcon className={props.classes.warningIcon} />
            <Typography>{props.t('extension.create.warning')}</Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {props.t('extension.create.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={props.processing}
        >
          {props.t('extension.create.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = (theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  field: {
    marginTop: theme.spacing(2),
  },
  warningContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: '#EFEFEF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  warningIcon: {
    marginRight: theme.spacing(2),
  },
  dateExplainer: {
    marginTop: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentPack']),
  withState('nbDays', 'setNbDays', 1),
  withState('note', 'setNote', ''),
)(ConsumerPaymentPackExtensionFormDialog);
