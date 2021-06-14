import React from 'react';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';

interface Props {
  typographyProps: any;
  timestamp: number;
  onFinish?: () => void;
}

export default class CountDown extends React.PureComponent<Props> {
  state = {
    countdown: '',
  };

  interval: any = null;

  finish = false;

  constructor(props: Props) {
    super(props);

    const countdown = this.getDuration();
    this.state = {
      countdown,
    };
  }

  componentDidMount = () => {
    this.interval = setInterval(this.setCountDown, 1000);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  setCountDown = () => {
    if (!this.finish) {
      const duration = this.getDuration();

      if (!duration) {
        this.finish = true;
        this.props.onFinish && this.props.onFinish();
      }

      this.setState({ countdown: duration });
    }
  };

  getDuration = () => {
    const now = moment();
    const end = moment(this.props.timestamp, 'X');
    const duration = moment.duration(end.diff(now));

    const str = moment.utc(duration.as('millisecond')).format('mm:ss');

    if (duration.minutes() < 0 || duration.seconds() < 0) {
      return '';
    }

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
