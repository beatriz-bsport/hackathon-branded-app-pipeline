// @flow

import React, { createContext, Component } from 'react';
import type { AbstractComponent } from 'react';
import { Link } from 'react-router-dom';

import { withStyles, Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

type addButtonProps = {
  path: string,
  text: ?string,
  classes: Object,
};

type injectButtonProps = {
  addButton: addButtonProps,
  switchButton: ?boolean,
};
export const ListViewContext = createContext({
  isCardView: false,
});
export class ListViewContextProvider extends Component<
  { children: * },
  { isCardView: boolean, switchViewType: () => void },
> {
  state = {
    isCardView: false,
    switchViewType: () =>
      this.setState((prevState) => ({
        isCardView: !prevState.isCardView,
      })),
  };

  render() {
    return (
      <ListViewContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </ListViewContext.Provider>
    );
  }
}

export default function withButton(params: injectButtonProps) {
  const styles = (theme) => ({
    oneButtonMargin: {
      marginBottom: theme.spacing.unit * 6,
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    },
    buttonContainer: {
      position: 'fixed',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
    },
    toggleContainer: {
      height: 48,
      padding: 0,
      display: 'flex',
      alignItems: 'right',
      justifyContent: 'center',
      margin: `${theme.spacing.unit}px 0`,
      borderRadius: '36px',
    },
    listButton: {
      borderRadius: '0px 36px 36px 0px',
    },
    cardButton: {
      borderRadius: '36px 0px 0px 36px',
    },
  });

  return (WrappedComponent: AbstractComponent<any>) =>
    withStyles(styles)(
      class Wrapper extends Component<Object> {
        static contextType = ListViewContext;

        switchViewType = () => {
          this.context.switchViewType();
        };

        renderAddButton = () => (
          <Link to={params.addButton.path}>
            <Button variant="extendedFab" aria-label="Add" color="primary">
              <AddIcon className={this.props.classes.extendedIcon} />
              {params.addButton.text}
            </Button>
          </Link>
        );

        renderSwitchButton = () => {
          const { classes } = this.props;
          const { isCardView } = this.context;
          const cardButtonColor = isCardView ? 'primary' : '#eee';
          const listButtonColor = isCardView ? '#eee' : 'primary';
          return (
            <div className={classes.toggleContainer}>
              <Grid container spacing={0} align="right">
                <Grid item xs={12}>
                  <Button
                    className={classes.cardButton}
                    variant="extendedFab"
                    aria-label="Add"
                    onClick={isCardView ? () => {} : this.switchViewType}
                    color={cardButtonColor}
                  >
                    <ViewModuleIcon />
                  </Button>
                  <Button
                    className={classes.listButton}
                    variant="extendedFab"
                    aria-label="Add"
                    color={listButtonColor}
                    onClick={isCardView ? this.switchViewType : () => {}}
                  >
                    <ListIcon />
                  </Button>
                </Grid>
              </Grid>
            </div>
          );
        };

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
              <WrappedComponent
                {...this.props}
                isCardView={this.context.isCardView}
              />
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
