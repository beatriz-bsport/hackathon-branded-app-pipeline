// @flow
import React from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  broadcast_info: {
    // TODO TYPES, use BookingBroadCastRoom type
    room: string,
    domain: string,
    provider: string,
  },
};
export class BroadcastRoomWhereby extends React.Component<Props> {
  openLink = () => {
    window.open(this.getRoomLink(), '_blank');
  };

  getRoomLink = () => {
    return `https://${this.props.broadcast_info.domain}/${this.props.broadcast_info.room}`;
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

export default withTranslation(['offer'])(BroadcastRoomWhereby);
