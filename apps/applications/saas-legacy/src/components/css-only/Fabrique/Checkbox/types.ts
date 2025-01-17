/* eslint-disable-next-line */
const CheckboxSizeType = ['sm', 'lg'] as const;

export type CheckboxSize = (typeof CheckboxSizeType)[number];
