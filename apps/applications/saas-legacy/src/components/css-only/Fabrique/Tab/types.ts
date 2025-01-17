/* eslint-disable-next-line */
const TabColorTypes = ['grey', 'main'] as const;

export type TabColor = (typeof TabColorTypes)[number];
