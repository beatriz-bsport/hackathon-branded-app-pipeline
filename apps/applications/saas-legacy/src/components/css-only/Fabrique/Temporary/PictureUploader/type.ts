/* eslint-disable-next-line */
const ActionTypes = ['add', 'edit'] as const;

export type ActionType = (typeof ActionTypes)[number];
