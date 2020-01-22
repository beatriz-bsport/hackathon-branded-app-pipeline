// @flow
import React, { Component } from 'react';

import NumericInput from './input/NumericInput.component';

const DELAY = 350;

type Props = {
  value: ?string,
  onChange: (*) => void,
};

type State = {
  value: string,
  writingSince: ?number,
};

export default class DelayedNumericInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value || '',
      writingSince: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value });
    }
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
      <NumericInput
        {...this.props}
        onChange={(event) => this.handleChange(event)}
        value={this.state.value}
      />
    );
  }
}
