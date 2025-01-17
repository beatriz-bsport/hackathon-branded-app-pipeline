/* eslint-disable-next-line */
const ButtonColorTypes = [
  'primary',
  'secondary',
  'grey',
  'white',
  'info',
  'error',
  'warning',
] as const;

export type ButtonColor = (typeof ButtonColorTypes)[number];

/* eslint-disable-next-line */
const ButtonVariants = ['contained', 'outlined', 'text'] as const;

export type ButtonVariant = (typeof ButtonVariants)[number];

/* eslint-disable-next-line */
const ButtonSizes = ['lg', 'md', 'sm'];

export type ButtonSize = (typeof ButtonSizes)[number];
