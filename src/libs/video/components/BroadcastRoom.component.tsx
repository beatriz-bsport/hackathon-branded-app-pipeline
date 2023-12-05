import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Typography from '@material-ui/core/Typography';

import { WithTranslation, withTranslation } from 'react-i18next';

import { Theme } from '@material-ui/core';
import { WithStyles, createStyles } from '@material-ui/styles';
// @ts-expect-error
import BroadcastRoomJitsi from './BroadcastJitsi.component';
// @ts-expect-error
import BroadcastRoomWhereby from './BroadcastRoomWhereby.component';
// @ts-expect-error
import BroadcastRoomCustom from './BroadcastRoomCustom.component';
import type { BroadcastInfo } from '../../booking/types';

type OwnProps = {
  broadcast_info: BroadcastInfo;
  date_start: string;
  duration_minute: number;
  userType: string;
};
type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

type State = {
  hasStarted: boolean;
  minutesLeft: number;
  checker: ReturnType<typeof setInterval>;
};

const getBroadcastProvider = (key: string) => {
  if (key === 'jitsi') return BroadcastRoomJitsi;
  if (key === 'whereby') return BroadcastRoomWhereby;
  if (key === 'custom') return BroadcastRoomCustom;
  return null;
};

const MINUTES_BEFORE_START_ACTIVATED = 15;
const MINUTES_AFTER_END_DEACTIVATED = 10;

export class BroadcastRoom extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasStarted: false, minutesLeft: 0, checker: null };
  }

  componentDidMount() {
    this.checkCountDown();
    this.setState({ checker: setInterval(this.checkCountDown, 1000) });
  }

  componentWillUnmount(): void {
    clearInterval(this.state.checker);
  }

  checkCountDown = () => {
    if (!this.props.date_start) {
      return;
    }
    this.setState({
      minutesLeft:
        1 +
        moment
          .duration(
            moment(this.props.date_start).diff(moment(), 'minutes'),
            'minutes',
          )
          .asMinutes(),
    });

    if (
      moment(this.props.date_start)
        .add(-MINUTES_BEFORE_START_ACTIVATED, 'minutes')
        .isBefore(moment()) &&
      moment(this.props.date_start)
        .add(
          this.props.duration_minute + MINUTES_AFTER_END_DEACTIVATED,
          'minutes',
        )
        .isAfter(moment())
    ) {
      this.setState({ hasStarted: true });
    }
  };

  render() {
    const { minutesLeft } = this.state;
    if (this.state.hasStarted) {
      const BroadcastProvider = getBroadcastProvider(
        this.props.broadcast_info.provider,
      );
      return (
        <div className={this.props.classes.container}>
          <BroadcastProvider {...this.props} />
        </div>
      );
    }

    return (
      <div>
        <div className={this.props.classes.container}>
          {this.state.hasStarted ? null : (
            <React.Fragment>
              <HourglassEmptyIcon style={{ height: '30vh', width: '30vh' }} />
              <div className={this.props.classes.captionsContainer}>
                <Typography>
                  {minutesLeft === 0 ? this.props.t('video.loadingSoon') : null}
                  {minutesLeft +
                    this.props.duration_minute +
                    MINUTES_AFTER_END_DEACTIVATED <=
                  0
                    ? this.props.t('video.hasEnded', {
                        minutesLeft,
                      })
                    : null}
                  {minutesLeft > 0
                    ? this.props.t('video.startingSoon', {
                        minutesLeft,
                      })
                    : null}
                </Typography>
                <Typography
                  className={this.props.classes.caption}
                  variant="caption"
                >
                  {this.props.t('video.isAutoRefresh')}
                </Typography>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      height: '80vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    caption: {
      marginTop: theme.spacing(1),
    },
    captionsContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
  });

export default compose<Props, OwnProps>(
  withTranslation(['offer']),
  withStyles(styles),
)(BroadcastRoom);
