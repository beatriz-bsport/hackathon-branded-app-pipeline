// @flow
import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation, TFunction } from 'react-i18next';

import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import type { ShopItem } from '../types';
import RedButton from '../../../components/button/RedButton.component';
import { VALIDATION_DELAY } from '#src/libs/constants';

type Props = {
  onSubmit: () => void,
  shopitem: ShopItem,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
  isUsedInCombo: boolean,
};

export function ShopItemDeleteDialog(props: Props) {
  const { onSubmit, onCancel, t, shopitem, classes } = props;
  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">
        {t('dialog.delete.title', { shopitem })}
      </DialogTitle>
      <DialogContent>
        {props.isUsedInCombo && (
          <DialogContentText className={classes.warningDelete}>
            <WarningIcon
              className={classes.warningIcon}
              color="error"
              fontSize="large"
            />
            <Typography>{t('dialog.delete.warning')}</Typography>
          </DialogContentText>
        )}
        <DialogContentText id="alert-dialog-description">
          {t('dialog.delete.explain')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onCancel}>
          {t('dialog.delete.cancel')}
        </Button>
        <RedButton
          autoFocus
          color="primary"
          delayBeforeActivation={VALIDATION_DELAY}
          onClick={onSubmit}
        >
          {t('dialog.delete.confirm')}
        </RedButton>
      </DialogActions>
    </React.Fragment>
  );
}

const styles = (theme: Theme): any => ({
  warningDelete: {
    display: 'flex',
  },
  warningIcon: {
    marginRight: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['shop']),
  withStyles(styles),
)(ShopItemDeleteDialog);
