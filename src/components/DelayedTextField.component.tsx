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
  writingSince: number | null;
};

export default class DelayedTextField extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value || '',
      writingSince: null,
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
      writingSince: Date.now(),
      value: e.target.value,
    });
    setTimeout(this.sendChange(e), this.getDelay() + 10);
  };

  sendChange = (e: React.ChangeEvent<HTMLInputElement>) => () => {
    const { writingSince } = this.state;
    if (
      (!writingSince || Date.now() - writingSince > this.getDelay()) &&
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
