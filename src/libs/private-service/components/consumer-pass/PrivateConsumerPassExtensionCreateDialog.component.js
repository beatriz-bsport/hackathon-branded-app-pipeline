// @flow
import React from 'react';

import moment from 'moment-timezone';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { compose, withState } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';
import { formatAsDate } from '../../../../utils/datetime';
import NumericInput from '../../../../components/input/NumericInput.component';
import DateInput from '#components/input/DateInput.component';

import type { PrivateConsumerPass } from '../../types';
import { getExpirationDate } from '../../utils';

type Props = {
  open: boolean,
  privateConsumerPass: PrivateConsumerPass,
  onClose: () => void,
  onSubmit: ({ note: string, nb_days: number }) => void,

  note: string,
  setNote: (string) => void,
  nbDays: number,
  setNbDays: (number) => void,

  t: TFunction,
  classes: Object,
  processing: Boolean,
  timezone: string,
};
export const PrivateConsumerPassExtensionCreateDialog = (props: Props) => {
  const {
    privateConsumerPass,
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
      label: props.t('consumerPass.extension.options.addNumberOfDays'),
      value: 'numericInput',
    },
    {
      label: props.t('consumerPass.extension.options.selectNewEndDate'),
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
    () =>
      privateConsumerPass &&
      moment(getExpirationDate(privateConsumerPass)).tz(timezone),
    [privateConsumerPass, timezone],
  );

  const newDate = React.useMemo(
    () =>
      privateConsumerPass &&
      moment(getExpirationDate(privateConsumerPass))
        .tz(timezone)
        .add(nbDays, 'days'),
    [privateConsumerPass, timezone, nbDays],
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

  if (!privateConsumerPass) {
    return null;
  }

  return (
    <Dialog open={props.open}>
      {props.processing && <LinearProgress />}
      <DialogTitle>
        {props.t('consumerPass.extension.create.title')}
      </DialogTitle>
      <DialogContent>
        <div className={props.classes.content}>
          <Grid item xs={12}>
            <RadioGroup
              onChange={handleSelectOption}
              value={selectedExtensionOption}
            >
              {EXTENSION_OPTIONS.map(({ value, label: l }) => (
                <div key={value}>
                  <FormControlLabel
                    key={value}
                    control={<Radio />}
                    disabled={props.processing}
                    label={l}
                    value={value}
                  />
                </div>
              ))}
            </RadioGroup>
          </Grid>
          {selectedExtensionOption === 'numericInput' && (
            <NumericInput
              fullWidth
              InputProps={{
                inputProps: { step: 1, min: 0 },
              }}
              label={props.t('consumerPass.extension.create.nbDays.label')}
              onChange={handleChangeNumericInput}
              value={nbDays}
            />
          )}
          {selectedExtensionOption === 'datePicker' &&
            !!privateConsumerPass && (
              <DateInput
                disabled={props.processing}
                label={props.t(
                  'consumerPass.extension.create.datePicker.label',
                )}
                minDate={endingDate}
                onChange={handleSelectDate}
                value={newDate}
              />
            )}
          <TextField
            fullWidth
            className={props.classes.field}
            inputProps={{ maxLength: 42 }}
            label={props.t('consumerPass.extension.create.note.label')}
            onChange={handleChangeNote}
            value={props.note}
            variant="outlined"
          />
          {privateConsumerPass ? (
            <div className={props.classes.dateExplainer}>
              <Typography variant="subtitle2">
                {props.t('consumerPass.extension.create.explain.oldDate') +
                  formatAsDate(getExpirationDate(privateConsumerPass))}
              </Typography>
              <Typography variant="subtitle2">
                {props.t('consumerPass.extension.create.explain.newDate') +
                  formatAsDate(newDate)}
              </Typography>
            </div>
          ) : null}
          <Typography variant="subtitle2" />
          <div className={props.classes.warningContainer}>
            <WarningIcon className={props.classes.warningIcon} />
            <Typography>
              {props.t('consumerPass.extension.create.warning')}
            </Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {props.t('consumerPass.extension.create.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={props.processing}
          onClick={handleSubmit}
        >
          {props.t('consumerPass.extension.create.submit')}
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
  withTranslation(['privateService']),
  withState('nbDays', 'setNbDays', 1),
  withState('note', 'setNote', ''),
)(PrivateConsumerPassExtensionCreateDialog);
