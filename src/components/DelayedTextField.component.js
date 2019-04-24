// @flow
import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

const DELAY = 350;

type Props = {
  value: ?string,
  onChange: (*) => void,
};

type State = {
  value: string,
  writingSince: ?number,
};

export default class DelayedTextField extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value || '',
      writingSince: null,
    };
  }

  handleChange = (e: *) => {
    e.persist();
    this.setState({
      writingSince: Date.now(),
      value: e.target.value,
    });
    setTimeout(this.sendChange(e), DELAY + 10);
  };

  sendChange = (e: *) => () => {
    const { writingSince } = this.state;
    if (
      (!writingSince || Date.now() - writingSince > DELAY) &&
      e.target.value !== this.props.value
    ) {
      this.props.onChange(e);
    }
  };

  render() {
    return (
      <TextField
        {...this.props}
        onChange={(event) => this.handleChange(event)}
        value={this.state.value}
      />
    );
  }
}
