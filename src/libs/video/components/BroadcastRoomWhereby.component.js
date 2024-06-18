// @flow
import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import type { BroadcastInfo } from '../../booking/types';
import { openNewBackOfficeWindow } from '#src/utils/windows';

type Props = {
  t: TFunction,
  broadcast_info: BroadcastInfo,
};
export class BroadcastRoomWhereby extends React.Component<Props> {
  openLink = () => {
    const url = this.getRoomLink();
    if (url) {
      openNewBackOfficeWindow(url);
    }
  };

  getRoomLink = () => {
    if (this.props.broadcast_info.room) {
      return `https://${this.props.broadcast_info.domain}/${this.props.broadcast_info.room}`;
    }
    return null;
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

export default withTranslation(['offer'])(BroadcastRoomWhereby);
