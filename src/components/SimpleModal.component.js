// @flow

import React from 'react';
import type { Node } from 'react';

import { Modal, Paper, withStyles } from '@material-ui/core';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
    height: '100%',
    position: 'absolute',
    backgroundColor: theme.palette.paper,
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    maxHeight: '100vh',
    overflowY: 'scroll',
    [theme.breakpoints.up('md')]: {
      maxHeight: '90vh',
    },
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    [theme.breakpoints.up('md')]: {
      top: '10%',
      left: '50%',
      bottom: '10%',
      transform: 'translateX(-50%)',
    },
  },
});

type Props = {
  open: boolean,
  classes: Object,
  children: Node,
};

export function SimpleModal(props: Props) {
  return (
    <div>
      <Modal open={props.open}>
        <div className={props.classes.modal}>
          <div className={props.classes.paperContainer}>{props.children}</div>
        </div>
      </Modal>
    </div>
  );
}

export default withStyles(styles)(SimpleModal);
