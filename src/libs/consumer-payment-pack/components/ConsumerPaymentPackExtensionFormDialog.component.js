// @flow
import React from 'react';

import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose, withState } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { formatAsDate } from '../../../datetime';
import NumericInput from '../../../components/input/NumericInput.component';
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
};
export const ConsumerPaymentPackExtensionFormDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.t('extension.create.title')}</DialogTitle>
      <DialogContent>
        <div className={props.classes.content}>
          <NumericInput
            value={props.nbDays}
            fullWidth
            label={props.t('extension.create.nbDays.label')}
            onChange={(ev) => props.setNbDays(ev.target.value)}
            InputProps={{
              inputProps: { step: 1, min: 0 },
            }}
          />
          <TextField
            variant="outlined"
            value={props.note}
            fullWidth
            inputProps={{ maxLength: 42 }}
            label={props.t('extension.create.note.label')}
            onChange={(ev) => props.setNote(ev.target.value)}
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
                  formatAsDate(
                    moment(props.consumerPaymentPack.ending_date).add(
                      'days',
                      props.nbDays,
                    ),
                  )}
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
          onClick={() =>
            props.onSubmit({ note: props.note, nb_days: props.nbDays })
          }
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
    marginTop: theme.spacing.unit * 2,
  },
  warningContainer: {
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    borderRadius: theme.spacing.unit,
    backgroundColor: '#EFEFEF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  warningIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  dateExplainer: {
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['paymentPack']),
  withState('nbDays', 'setNbDays', 1),
  withState('note', 'setNote', ''),
)(ConsumerPaymentPackExtensionFormDialog);
