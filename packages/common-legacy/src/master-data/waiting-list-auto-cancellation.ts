type WaitingListAutoCancellationType = {
  id: number;
  text: string;
};

export const WAITING_LIST_AUTO_CANCELLATION_DUMB: WaitingListAutoCancellationType =
  {
    id: 0,
    text: 'dumb',
  };

export const WAITING_LIST_AUTO_CANCELLATION_SMART: WaitingListAutoCancellationType =
  {
    id: 1,
    text: 'smart',
  };

const WAITING_LIST_AUTO_CANCELLATION_TYPES: Array<WaitingListAutoCancellationType> =
  [WAITING_LIST_AUTO_CANCELLATION_DUMB, WAITING_LIST_AUTO_CANCELLATION_SMART];

export default WAITING_LIST_AUTO_CANCELLATION_TYPES;
