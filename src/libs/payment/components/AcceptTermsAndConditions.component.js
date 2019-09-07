// @flow
//
import React from 'react';
import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import TypographyMultiline from '../../../components/TypographyMultiline.component';

type Props = {
  t: TFunction,
  showTermsAndConditions: boolean,
  setShowTermsAndConditions: (boolean) => void,
  accepted: boolean,
  onChecked: (accepted: boolean) => void,
  termsAndConditions: string,
  classes: Object,
};

export const AcceptTermsAndConditions = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <Checkbox
        checked={props.accepted}
        onChange={(ev) => props.onChecked(ev.target.checked)}
      />
      <Typography inline component="div" variant="caption" color="default">
        <span>{props.t('generalTermsAndConditions.iAccept')}</span>
        <ButtonBase onClick={() => props.setShowTermsAndConditions(true)}>
          <Typography inline variant="caption" color="secondary">
            {props.t('generalTermsAndConditions.theTermsAndConditions')}
          </Typography>
        </ButtonBase>
      </Typography>
      <Dialog
        open={props.showTermsAndConditions}
        onClose={() => props.setShowTermsAndConditions(false)}
      >
        <DialogContent>
          <TypographyMultiline>{props.termsAndConditions}</TypographyMultiline>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setShowTermsAndConditions(false)}>
            {props.t('generalTermsAndConditions.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default compose(
  withNamespaces(['payment']),
  withStyles(styles),
  withState('showTermsAndConditions', 'setShowTermsAndConditions', false),
)(AcceptTermsAndConditions);
