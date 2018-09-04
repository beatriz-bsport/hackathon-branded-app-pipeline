import React from 'react';

import { Modal, Paper, withStyles } from '@material-ui/core';
import ConsumerMenu from '../ConsumerMenu.component';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
  modal: {
    top: '10%',
    left: '30%',
    position: 'absolute',
    minWidth: 350,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
});

type Props = {
  classes: Object,
  children: React.Node,
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
