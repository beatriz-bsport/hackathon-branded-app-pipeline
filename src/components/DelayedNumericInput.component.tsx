// @flow
import React, { Component } from 'react';

import NumericInput from './input/NumericInput.component';

const DELAY = 350;

type Props = {
  value: string | null | number;
  onChange: (data: any) => void;
  InputProps: any;
};

type State = {
  value: string | null | number;
  writingSince: number | null;
};

export default class DelayedNumericInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value || props.value === 0 ? props.value : '',
      writingSince: null,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.value !== prevProps.value) {
      // eslint-disable-next-line
      this.setState({ value: this.props.value });
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    this.setState({
      writingSince: Date.now(),
      value: e.target.value,
    });
    setTimeout(this.sendChange(e), DELAY + 10);
  };

  sendChange = (e: React.ChangeEvent<HTMLInputElement>) => () => {
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
