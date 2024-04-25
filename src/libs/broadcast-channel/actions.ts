import type { Dispatch } from '#state/types';
import { BroadcastChannelMessage, BroadcastChannelMessageType } from './types';

import { globalMemberVisitActions } from '#libs/access-control/actions';

export const handleBroadcastChannelMessages = (
  message: BroadcastChannelMessage,
) => {
  return async (dispatch: Dispatch) => {
    switch (message.type) {
      case BroadcastChannelMessageType.accessControlMemberVisitCreate:
        dispatch(globalMemberVisitActions.create(message.payload));
        break;
      case BroadcastChannelMessageType.accessControlMemberVisitRefresh:
      case BroadcastChannelMessageType.accessControlSetEntryStatus:
        dispatch(globalMemberVisitActions.update(message.payload));
        break;
      default:
        break;
    }
  };
};
