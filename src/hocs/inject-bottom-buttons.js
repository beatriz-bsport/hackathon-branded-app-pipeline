// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import { Link } from 'react-router-dom';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

type addButtonProps = {
  path: string,
  text: ?string,
  classes: Object,
};

type injectButtonProps = {
  addButton: addButtonProps,
  switchButton: ?Object,
};

export default function withButton(params: injectButtonProps) {
  const styles = (theme) => ({
    oneButtonMargin: {
      marginBottom: theme.spacing.unit * 6,
    },
    twoButtonMargin: {
      marginBottom: theme.spacing.unit * 12,
    },
    fabAddButton: {
      marginTop: theme.spacing.unit * 2,
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    },
    buttonContainer: {
      position: 'fixed',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
    },
  });

  return (WrappedComponent: Node) =>
    withStyles(styles)(
      class Wrapper extends Component<Object> {
        renderAddButton = () => (
          <Link
            to={params.addButton.path}
            style={{ textDecoration: 'none' }}
            className={this.props.classes.fabAddButton}
          >
            <Fab variant="extended" aria-label="Add" color="primary">
              <AddIcon className={this.props.classes.extendedIcon} />
              {params.addButton.text}
            </Fab>
          </Link>
        );

        renderSwitchButton = () => (
          <Fab variant="extended" aria-label="Add" color="primary">
            <AddIcon />
          </Fab>
        );

        render() {
          const { classes } = this.props;
          const { addButton, switchButton } = params;
          return (
            <div
              className={
                addButton && switchButton
                  ? classes.wrappedWithMargin
                  : classes.oneButtonMargin
              }
            >
              <WrappedComponent {...this.props} />
              <div className={classes.buttonContainer}>
                {switchButton ? this.renderSwitchButton() : null}
                {addButton ? this.renderAddButton() : null}
              </div>
            </div>
          );
        }
      },
    );
}
