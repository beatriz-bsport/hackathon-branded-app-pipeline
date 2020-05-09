// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import moment from 'moment';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Typography from '@material-ui/core/Typography';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import BroadcastRoomJitsi from './BroadcastJitsi.component';
import BroadcastRoomWhereby from './BroadcastRoomWhereby.component';
import BroadcastRoomCustom from './BroadcastRoomCustom.component';

type Props = {
  t: TFunction,
  broadcast_info: {
    room: string,
    domain: string,
    provider: string,
  },
  classes: Object,
  date_start: string,
  duration_minute: number,
};

const BRODCAST_PROVIDERS = {
  jitsi: BroadcastRoomJitsi,
  whereby: BroadcastRoomWhereby,
  custom: BroadcastRoomCustom,
};

const MINUTES_BEFORE_START_ACTIVATED = 15;
const MINUTES_AFTER_END_DEACTIVATED = 10;

export class BroadcastRoom extends React.Component<Props> {
  state = { hasStarted: false, minutesLeft: 0 };

  componentDidMount() {
    this.checkCountDown();
    this.checker = setInterval(this.checkCountDown, 1000);
  }

  checkCountDown = () => {
    if (!this.props.date_start) {
      return;
    }
    this.setState({
      minutesLeft:
        1 +
        moment.duration(
          moment(this.props.date_start).diff(moment(), 'minutes'),
        ),
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
      const BroadcastProvider =
        BRODCAST_PROVIDERS[this.props.broadcast_info.provider];
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
              <div>
                <Typography variant="subtitle">
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

const styles = (theme) => ({
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
});

export default compose(
  withNamespaces(['offer']),
  withStyles(styles),
)(BroadcastRoom);
