// @flow

import React from 'react';
import type { Node } from 'react';

import { Dialog, DialogContent, withStyles } from '@material-ui/core';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import ConsumerMenu from '../navigation/ConsumerMenu.component';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 1,
    overflowY: 'auto',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
  },
  modal: {
    [theme.breakpoints.up('sm')]: {
      top: '10%',
      left: '50%',
      right: 0,
      transform: 'translateX(-50%)',
    },
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    maxWidth: 550,
    maxHeight: '80%',
    overflowY: 'auto',
  },
});

type Props = {
  classes: Object,
  children: Node,
};

export function ConsumerModalContainer(props: Props) {
  return (
    <div>
      <ConsumerMenu />
      <Dialog
        fullScreen={props.fullScreen}
        open
        aria-labelledby="responsive-consumer-dialog"
      >
        <DialogContent>{props.children}</DialogContent>
      </Dialog>
    </div>
  );
}

export default withMobileDialog()(withStyles(styles)(ConsumerModalContainer));
