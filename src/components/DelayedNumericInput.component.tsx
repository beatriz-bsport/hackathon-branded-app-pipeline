import React, { Component } from 'react';

import NumericInput from './input/NumericInput.component';
// eslint-disable-next-line no-duplicate-imports
import type { NumericInputProps } from './input/NumericInput.component';

const DELAY = 350;

type InputProps = Omit<NumericInputProps, 'value' | 'onChange'>;

export type Props = {
  value: string | null | number;
  onChange: (data: any) => void;
  InputProps?: InputProps;
  isPositive?: boolean;
  onBlur?: (e: React.SyntheticEvent<HTMLInputElement>) => void;
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

  handleBlur: () => void = () => {
    if (
      this.props.isPositive &&
      (this.state.value === null || this.state.value === '')
    ) {
      this.setState({
        value: 0,
      });
    }
    return undefined;
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
    const numericValue =
      typeof this.state.value === 'number'
        ? this.state.value
        : parseFloat(this.state.value);
    return (
      <NumericInput
        {...this.props}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        value={numericValue}
      />
    );
  }
}
