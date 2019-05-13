// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import RedButton from '../../components/button/RedButton.component';

type Props = {
  t: TFunction,
  onCancel: () => void,
  onSubmit: () => void,
};

export const StopDialog = (props: Props) => (
  <div>
    <DialogContent>{props.t('action.stopExplain')}</DialogContent>
    <DialogActions>
      <Button color="secondary" onClick={props.onCancel}>
        {props.t('form.cancel')}
      </Button>
      <RedButton onClick={props.onSubmit}>{props.t('action.stop')}</RedButton>
    </DialogActions>
  </div>
);

export default compose(withNamespaces(['subscription']))(StopDialog);
