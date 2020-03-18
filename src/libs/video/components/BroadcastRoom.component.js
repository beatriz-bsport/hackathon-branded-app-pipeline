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

type Props = {
  t: TFunction,
  broadcast_info: {
    room: string,
    domain: string,
    provider: string,
  },
  classes: Object,
  date_start: string,
};

const BRODCAST_PROVIDERS = {
  jitsi: BroadcastRoomJitsi,
  whereby: BroadcastRoomWhereby,
};

export class BroadcastRoom extends React.Component<Props> {
  state = { hasStarted: false };

  componentDidMount() {
    this.checkCountDown();
  }

  checkCountDown = () => {
    if (
      this.props.date_start &&
      (this.props.userType !== 'coach' &&
        moment(this.props.date_start).isAfter(moment()))
    ) {
      setTimeout(this.checkCountDown, 1000);
    } else {
      this.setState({ hasStarted: true });
    }
  };

  render() {
    const minutesLeft =
      1 +
      moment.duration(moment(this.props.date_start).diff(moment(), 'minutes'));
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
                  {minutesLeft < 0
                    ? this.props.t('video.loadingSoon')
                    : this.props.t('video.startingSoon', {
                        minutesLeft,
                      })}
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
    marginTop: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['offer']),
  withStyles(styles),
)(BroadcastRoom);
