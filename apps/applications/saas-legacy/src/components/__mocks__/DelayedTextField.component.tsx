import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

const DELAY = 350;

type Props = {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  delay?: number;
};

type State = {
  value: string;
};

export default class DelayedTextField extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.value !== prevProps.value) {
      // eslint-disable-next-line
      this.setState({ value: this.props.value });
    }
  }

  getDelay = () => {
    return this.props.delay || DELAY;
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    this.setState({
      value: e.target.value,
    });
    this.props.onChange(e);
  };

  render() {
    return (
      <TextField
        {...this.props}
        onChange={this.handleChange}
        value={this.state.value}
      />
    );
  }
}
