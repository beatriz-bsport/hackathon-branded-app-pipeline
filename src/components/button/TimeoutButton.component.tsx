import React from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';

type Props = { delayBeforeActivation: number } & ButtonProps;
type State = {
  currentCount: number;
  timeout: ReturnType<typeof setTimeout> | null;
};

class TimeoutButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.delayBeforeActivation) {
      this.state = {
        currentCount: props.delayBeforeActivation,
        timeout: setTimeout(this.updateCounter, 1000),
      };
    } else {
      this.state = { timeout: null, currentCount: 0 };
    }
  }

  updateCounter = () => {
    this.setState((prevState: State) => {
      if (prevState.currentCount > 1) {
        const timeout = setTimeout(this.updateCounter, 1000);
        return { currentCount: prevState.currentCount - 1, timeout };
      }
      return { currentCount: 0, timeout: null };
    });
  };

  componentWillUnmount() {
    if (this.state.timeout) {
      try {
        clearTimeout(this.state.timeout);
        // eslint-disable-next-line
      } catch (err) {}
    }
  }

  render() {
    return (
      <Button
        {...this.props}
        disabled={this.props.disabled || !!this.state.currentCount}
      >
        {this.props.children}
        {this.state.currentCount > 0 && ` (${this.state.currentCount})`}
      </Button>
    );
  }
}
export default TimeoutButton;
