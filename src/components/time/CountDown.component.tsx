import React from 'react';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';

interface Props {
  typographyProps?: any;
  timestamp: number;
  onFinish?: () => void;
}

type State = {
  countdown: string;
  isAlreadyExpiredAtInitialization: boolean;
  finish: boolean;
  interval: ReturnType<typeof setInterval> | null;
};

export default class CountDown extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const countdown = this.getDuration();
    this.state = {
      countdown,
      isAlreadyExpiredAtInitialization: false,
      finish: false,
      interval: null,
    };
  }

  componentDidMount = () => {
    const interval = setInterval(this.setCountDown, 1000);
    this.setState({
      interval,
      isAlreadyExpiredAtInitialization: moment
        .unix(this.props.timestamp)
        .isBefore(moment()),
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.state.interval);
  };

  setCountDown = () => {
    if (!this.state.finish) {
      const duration = this.getDuration();

      if (!duration) {
        this.setState({ finish: true });
        !this.state.isAlreadyExpiredAtInitialization &&
          this.props.onFinish &&
          this.props.onFinish();
      }

      this.setState({ countdown: duration });
    }
  };

  getDuration = () => {
    if (this.state?.isAlreadyExpiredAtInitialization) return '';

    const now = moment();
    const end = moment(this.props.timestamp, 'X');
    const duration = moment.duration(end.diff(now));

    if (duration.minutes() <= 0 && duration.seconds() <= 0) {
      return '';
    }

    const str = moment.utc(duration.as('millisecond')).format('mm:ss');
    return str;
  };

  render() {
    if (typeof this.props.children === 'function') {
      return this.props.children(this.state.countdown);
    }

    return (
      <Typography {...this.props.typographyProps}>
        {this.state.countdown}
      </Typography>
    );
  }
}
