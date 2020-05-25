// @flow
import React from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';

type Props = {
  t: TFunction,
  broadcast_info: {
    room: string,
    domain: string,
    provider: string,
  },
};

class ErrorCatcher extends React.Component<
  {
    theme: ?CompanyTheme,
    children: any,
    classes: Object,
    t: TFunction,
  },
  { hasError: boolean },
> {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  componentDidCatch(err, errInfo) {
    console.error(err);
    // eslint-disable-next-line
    console.log(errInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={this.props.classes.column}>
          <WarningIcon className={this.props.classes.warningIcon} />
          <Typography align="center">
            {this.props.t('video.cantOpenLink')}
          </Typography>
          <Typography align="center">
            {this.props.theme ? this.props.theme.contact_email : ''}
          </Typography>
        </div>
      );
    }
    return this.props.children;
  }
}

// eslint-disable-next-line
export class BroadcastRoomWhereby extends React.Component<Props> {
  openLink = () => {
    window.open(this.getRoomLink(), '_blank');
  };

  getRoomLink = () => {
    if (!this.props.broadcast_info.room.toLowerCase().includes('http')) {
      return `http://${this.props.broadcast_info.room}`;
    }
    return this.props.broadcast_info.room;
  };

  componentDidMount() {
    this.openLink();
  }

  render() {
    const link = this.getRoomLink();
    return (
      <div>
        <a target="_blank" rel="noopener noreferrer" href={link}>
          {this.props.t('video.redirectLink')}
        </a>
        <div>{link}</div>
      </div>
    );
  }
}

const styles = () => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  warningIcon: {
    height: 160,
    width: 160,
  },
});

export default compose(
  withTranslation(['offer']),
  withStyles(styles),
)((props) => (
  <ErrorCatcher t={props.t} classes={props.classes} theme={props.theme}>
    <BroadcastRoomWhereby {...props} />
  </ErrorCatcher>
));
