// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import MarketplaceActivity from './MarketplaceActivity.component';

type Props = {
  open: ?boolean,
  offer: ?Offer,
  classes: { [string]: string },
  onClose: () => void,
  fullScreen: boolean,
  offerId: number,
  mapContainerClassName?: string,
};

export function MarketplaceActivityDialog(props: Props) {
  const { classes, onClose, offerId } = props;
  return (
    <Dialog
      key={offerId}
      classes={{ paper: classes.dialog }}
      onClose={onClose}
      open={props.open}
      scroll="paper"
    >
      <DialogContent className={classes.dialogContent}>
        {props.open ? <MarketplaceActivity {...props} /> : null}
      </DialogContent>
    </Dialog>
  );
}

const styles = () => ({
  dialog: {
    width: '60vw',
    maxWidth: 800,
  },
  dialogContent: {
    padding: 0,
    paddingTop: '0 !important',
  },
});
export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles)(MarketplaceActivityDialog),
);
