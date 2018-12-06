// @flow

import React from 'react';

import { withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import MarketPlaceActivity from './MarketplaceActivity.component';

type Props = {
  offerId: number,
  classes: { [string]: string },
};

export function MarketplaceActivityDialog(props: Props) {
  const { classes } = props;
  return (
    <Dialog open scroll="paper">
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
export default withStyles(styles)(MarketplaceActivityDialog);
