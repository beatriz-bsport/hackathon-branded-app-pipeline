// @flow

import React from 'react';
import type { Node } from 'react';

import { Modal, Paper, withStyles } from '@material-ui/core';
import ConsumerMenu from '../ConsumerMenu.component';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 1,
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
      <Modal open>
        <div className={props.classes.modal}>
          <Paper className={props.classes.paperContainer}>
            {props.children}
          </Paper>
        </div>
      </Modal>
    </div>
  );
}

export default withStyles(styles)(ConsumerModalContainer);
