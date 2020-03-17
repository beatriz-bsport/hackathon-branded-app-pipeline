// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import WarningIcon from '@material-ui/icons/Warning';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import moment from 'moment';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Typography from '@material-ui/core/Typography';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

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

export class BroadcastRoom extends React.Component<Props> {
  state = { hasStarted: false };

  componentDidMount() {
    this.initializeJitsi();
  }

  initializeJitsi = () => {
    if (
      !window.JitsiMeetExternalAPI ||
      (this.props.date_start &&
        (this.props.userType !== 'coach' &&
          moment(this.props.date_start).isAfter(moment())))
    ) {
      setTimeout(this.initializeJitsi, 1000);
    } else {
      const { domain } = this.props.broadcast_info;
      const { room } = this.props.broadcast_info;

      const isCoach = this.props.userType !== 'consumer';

      const options = {
        roomName: room,
        parentNode: document.querySelector('#broadcast'),
        configOverwrite: {
          useNicks: true,
          startWithAudioMuted: false, // this.props.userType === 'consumer',
          // startVideoMuted: 10,
        },
        interfaceConfigOverwrite: {
          DEFAULT_REMOTE_DISPLAY_NAME: !isCoach ? 'Student' : 'User',

          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          APP_NAME: 'bsport',
          PROVIDER_NAME: 'bsport',
          MOBILE_APP_PROMO: false,
          RECENT_LIST_ENABLED: false,

          SETTINGS_SECTIONS: [
            'devices',
            'language',
            'profile',
            ...(isCoach ? ['moderator'] : []),
          ],
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'closedcaptions',
            'fullscreen',
            'chat',
            'settings',
          ],
        },
      };
      this.setState({ hasStarted: true });
      this.jitsiAPI = new window.JitsiMeetExternalAPI(domain, options);
      window.jistsiAPI = this.jitsiAPI;
      setTimeout(() => {
        this.jitsiAPI.executeCommand('subject', 'bsport');
        this.jitsiAPI.executeCommand('toggleChat');
      }, 2000);
    }
  };

  componentWillUnmount() {
    if (this.jitsiAPI) {
      this.jitsiAPI.dispose();
      this.jitsiAPI = undefined;
    }
  }

  isChrome = () => {
    try {
      if (
        (navigator.userAgent.includes('Chrome') ||
          navigator.userAgent.includes('Chromium') ||
          navigator.userAgent.includes('chrome') ||
          navigator.userAgent.includes('chromium')) &&
        !(
          navigator.userAgent.includes('android') ||
          navigator.userAgent.includes('Android') ||
          navigator.userAgent.includes('ios') ||
          navigator.userAgent.includes('iOS')
        )
      ) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  render() {
    const minutesLeft =
      1 +
      moment.duration(moment(this.props.date_start).diff(moment(), 'minutes'));

    const isChrome = this.isChrome();
    if (!isChrome) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <WarningIcon style={{ height: '10vh', width: '10vh' }} />
          <div>
            <Typography color="error" variant="subtitle">
              Le cours vidéo n'est compatible qu'avec Google Chrome
            </Typography>
            <Typography>
              Disponible{' '}
              <a href="https://www.google.com/intl/fr_fr/chrome/">ici</a>
            </Typography>
          </div>
        </div>
      );
    }
    return (
      <div>
        <Helmet>
          <script src="https://cdn.bsport.io/scripts/jitsi_external_api.js" />
        </Helmet>
        <div className={this.props.classes.container} id="broadcast">
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
