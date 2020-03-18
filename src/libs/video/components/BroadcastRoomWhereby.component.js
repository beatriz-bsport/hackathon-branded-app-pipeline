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
  window.open(
    `https://${props.broadcast_info.domain}/${props.broadcast_info.room}`,
    '_blank',
  );
  return <div />;
};

export default BroadcastRoomWhereby;
