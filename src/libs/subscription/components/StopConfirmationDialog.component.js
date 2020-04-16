// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import RedButton from '../../../components/button/RedButton.component';

type Props = {
  t: TFunction,
  open: boolean,
  onCancel: () => void,
  onSubmit: (params: any) => void,
  classes: Object,
  also_revert_current: boolean,
  set_also_revert_current: (boolean) => void,
  submitting?: boolean,
  setSubmittin: (?boolean) => void,
};

export const StopDialog = (props: Props) => (
  <Dialog open={props.open}>
    <DialogContent>
      {props.t('action.stopExplain')}
      <div className={props.classes.row}>
        <Checkbox
          value={props.also_revert_current}
          onChange={(ev) => props.set_also_revert_current(ev.target.checked)}
        />
        <div>
          <Typography>{props.t('action.revertCurrentExplain')}</Typography>
          <Typography variant="caption" color="textSecondary">
            {props.t('action.revertCurrentExplainHelper')}
          </Typography>
        </div>
      </div>
    </DialogContent>
    <DialogActions>
      <Button
        color="secondary"
        onClick={props.onCancel}
        disabled={props.submitting}
      >
        {props.t('form.cancel')}
      </Button>
      {props.submitting ? (
        <CircularProgress />
      ) : (
        <RedButton
          onClick={() => {
            props.setSubmittin(true);
            props.onSubmit(
              { also_revert_current: props.also_revert_current },
              {
                onSuccess: () => props.setSubmittin(false),
                onError: () => props.setSubmittin(false),
              },
            );
          }}
        >
          {props.t('action.stop')}
        </RedButton>
      )}
    </DialogActions>
  </Dialog>
);

const styles = (theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['subscription']),
  withState('also_revert_current', 'set_also_revert_current', false),
  withState('submitting', 'setSubmittin', false),
)(StopDialog);
