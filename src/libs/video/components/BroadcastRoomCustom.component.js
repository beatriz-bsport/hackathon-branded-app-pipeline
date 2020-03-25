// @flow
import React from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  broadcast_info: {
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
    if (!this.props.broadcast_info.room.toLowerCase().includes('http')) {
      return `http://${this.props.broadcast_info.room}`;
    }
    return this.props.broadcast_info.room;
    // return `https://${this.props.broadcast_info.domain}/${this.props.broadcast_info.room}`;
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

export default withNamespaces(['offer'])(BroadcastRoomWhereby);
