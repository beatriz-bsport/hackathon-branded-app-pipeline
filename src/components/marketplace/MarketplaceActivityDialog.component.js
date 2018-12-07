// @flow

import React from 'react';

import { withStyles, withMobileDialog } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import MarketPlaceActivity from './MarketplaceActivity.component';

type Props = {
  offerId: number,
  classes: { [string]: string },
};

export function MarketplaceActivityDialog(props: Props) {
  const { classes, onClose, fullScreen } = props;
  return (
    <Dialog open scroll="paper" onClose={onClose} fullScreen={fullScreen}>
      <DialogContent className={classes.dialogContent}>
        <MarketPlaceActivity {...props} />
      </DialogContent>
    </Dialog>
  );
}

const styles = () => ({
  dialogContent: {
    padding: 0,
    paddingTop: '0 !important',
  },
});
export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles)(MarketplaceActivityDialog),
);
