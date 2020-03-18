// @flow
import React from 'react';

type Props = {
  broadcast_info: {
    room: string,
    domain: string,
    provider: string,
  },
};
export const BroadcastRoomWhereby = (props: Props) => {
  const url = `https://${props.broadcast_info.domain}/${props.broadcast_info.room}`;
  window.open(url, '_blank');
  return (
    <a href={url}>
      Si vous n'êtes pas automatiquement redirigé, cliquez sur ce lien
    </a>
  );
};

export default BroadcastRoomWhereby;
