import { Immutable } from 'seamless-immutable';

export enum NetworkState {
  ONLINE = 'online',
  SERVER_ERROR = 'serverError',
  NETWORK_RESTORED = 'networkRestored',
  SERVER_RESTORED = 'serverRestored',
  OFFLINE = 'offline',
}

export type ImmutableNetworkState = Immutable<{
  networkState: NetworkState;
  networkStateBuffer: NetworkState;
  lastNetworkStatusUpdateTime: number;
  fetchOrigin: {
    success: boolean | null;
    loading: boolean;
    error: Error | null;
  };
}>;
