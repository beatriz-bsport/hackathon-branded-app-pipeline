import React from 'react';
import { Membership } from '#src/libs/membership/types';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';

interface Props {
  companyId: number;
  membership?: Membership;
  queryParams: { consumerspacecontext: ConsumerSpaceContextEnum };
}

export class AgentChat extends React.Component<Props> {
  render() {
    return <div>Agent will go here!</div>;
  }
}

export default AgentChat;
