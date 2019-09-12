// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import MarketPlaceActivity from './MarketplaceActivity.component';

type Props = {
  open: ?boolean,
  offer: ?Offer,
  classes: { [string]: string },
  onClose: () => void,
  fullScreen: boolean,
  offerId: number,
};

export function MarketplaceActivityDialog(props: Props) {
  const { classes, onClose, fullScreen, offerId } = props;
  return (
    <Dialog
      key={offerId}
      open={props.open}
      scroll="paper"
      onClose={onClose}
      classes={{ paper: classes.dialog }}
      fullScreen={fullScreen}
    >
      <DialogContent className={classes.dialogContent}>
        {props.open ? <MarketPlaceActivity {...props} /> : null}
      </DialogContent>
    </Dialog>
  );
}

const styles = () => ({
  dialog: {
    minWidth: '60vw',
  },
  dialogContent: {
    padding: 0,
    paddingTop: '0 !important',
  },
});
export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles)(MarketplaceActivityDialog),
);
