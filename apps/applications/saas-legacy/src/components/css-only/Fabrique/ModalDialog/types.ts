const ModalDialogColorTypes = [
  'primary',
  'info',
  'success',
  'warning',
  'error',
] as const;

export type ModalDialogColor = (typeof ModalDialogColorTypes)[number];

const ModalDialogSizeTypes = ['xs', 'md', 'lg', 'xl'] as const;

export type ModalDialogSize = (typeof ModalDialogSizeTypes)[number];
