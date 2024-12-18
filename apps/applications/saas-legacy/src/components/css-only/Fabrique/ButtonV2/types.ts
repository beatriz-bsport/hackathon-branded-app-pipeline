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

const ButtonVariants = ['contained', 'outlined', 'text'] as const;

export type ButtonVariant = (typeof ButtonVariants)[number];

const ButtonSizes = ['lg', 'md', 'sm'];

export type ButtonSize = (typeof ButtonSizes)[number];
