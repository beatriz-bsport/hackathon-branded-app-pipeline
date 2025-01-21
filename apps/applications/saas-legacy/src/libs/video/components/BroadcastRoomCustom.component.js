// @flow
// eslint-disable-next-line max-classes-per-file
import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import type { BroadcastInfo } from '../../booking/types';
import { openNewBackOfficeWindow } from '#src/utils/windows';

type Props = {
  t: TFunction,
  broadcast_info: BroadcastInfo,
};

class ErrorCatcher extends React.Component<
  {
    theme?: CompanyTheme,
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

export class BroadcastRoomWhereby extends React.Component<Props> {
  openLink = () => {
    const url = this.getRoomLink();
    if (url) {
      window.open(this.getRoomLink(), '_blank');
    }
  };

  getRoomLink = () => {
    if (!this.props.broadcast_info.room) return null;
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
        <a href={link} rel="noopener noreferrer" target="_blank">
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
  <ErrorCatcher classes={props.classes} t={props.t} theme={props.theme}>
    <BroadcastRoomWhereby {...props} />
  </ErrorCatcher>
));
