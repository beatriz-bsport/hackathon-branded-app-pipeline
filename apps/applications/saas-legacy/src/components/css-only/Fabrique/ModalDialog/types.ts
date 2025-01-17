/* eslint-disable-next-line */
const ModalDialogColorTypes = [
  'primary',
  'info',
  'success',
  'warning',
  'error',
] as const;

export type ModalDialogColor = (typeof ModalDialogColorTypes)[number];

/* eslint-disable-next-line */
const ModalDialogSizeTypes = ['xs', 'md', 'lg', 'xl'] as const;

export type ModalDialogSize = (typeof ModalDialogSizeTypes)[number];
