import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles,
} from '@material-ui/core';
import { MaterialStyleType } from '../../utils/types';

interface ButtonI {
  label: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  variant?: 'text' | 'outlined' | 'contained';
  key?: string | number | boolean;
}

interface ParamsI {
  title: string;
  text: string;
  buttons: ButtonI[];
}

interface StateI extends ParamsI {
  open: boolean;
}

export const showGenericDialog = async (
  title: string,
  text: string,
  buttons: ButtonI[],
) => {
  if (_showGenericDialog) {
    return new Promise((resolve, reject) => {
      try {
        const callback = (res: any) => resolve(res);
        _showGenericDialog(
          {
            title,
            text,
            buttons,
          },
          callback,
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  return undefined;
};

let _showGenericDialog: (
  params: ParamsI,
  callback: (res: any) => void,
) => void | null = null;

type Props = MaterialStyleType<ReturnType<typeof styles>>;

class GenericDialog extends React.PureComponent<Props, StateI> {
  state: StateI = {
    open: false,
    title: '',
    text: '',
    buttons: [],
  };

  callback: (res: any) => void = null;

  constructor(props: any) {
    super(props);
    this.showDialog = this.showDialog.bind(this);
    _showGenericDialog = this.showDialog;
  }

  showDialog = (params: ParamsI, callback: (res: any) => void) => {
    this.callback = callback;
    this.setState({
      open: true,
      ...params,
    });
  };

  resetState = () => {
    this.setState({
      open: false,
      title: '',
      text: '',
      buttons: [],
    });
  };

  onClose = () => {
    this.resetState();
    this.callback(null);
  };

  onClickButton = (ev: any, button: ButtonI, i: number) => {
    ev.stopPropagation();
    this.resetState();
    const res = button.key !== undefined ? button.key : i;
    this.callback(res);
  };

  render() {
    return (
      <Dialog
        className={this.props.classes.container}
        open={this.state.open}
        onClose={this.onClose}
      >
        <DialogTitle>{this.state.title}</DialogTitle>
        <DialogContent className={this.props.classes.container}>
          <DialogContentText>{this.state.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {this.state.buttons.map((button, i) => {
            return (
              <Button
                key={i}
                onClick={(ev) => this.onClickButton(ev, button, i)}
                color={button.color}
                variant={button.variant}
              >
                {button.label}
              </Button>
            );
          })}
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = () => ({
  container: {
    minWidth: 300,
  },
});

export default withStyles(styles)(GenericDialog);
