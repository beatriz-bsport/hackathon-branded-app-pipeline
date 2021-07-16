export type WaitingListConfiguration = {
  auto_cancellation_type: number,
  dumb_delay_minutes: number,
  smart_delay_percentage: number,
};

export type WaitingListState = {
  configuration: {
    data: ?WaitingListConfiguration,
    loading: boolean,
    error: ?Error,
    update: {
      loading: boolean,
      error: ?Error,
    },
  },
};
