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
    return `https://${this.props.broadcast_info.domain}/${this.props.broadcast_info.room}`;
  };

  componentDidMount() {
    this.openLink();
  }

  render() {
    return (
      <a target="_blank" rel="noopener noreferrer" href={this.getRoomLink()}>
        {this.props.t('video.redirectLink')}
      </a>
    );
  }
}

export default withNamespaces(['offer'])(BroadcastRoomWhereby);
