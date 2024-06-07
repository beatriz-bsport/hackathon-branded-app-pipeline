import { Props as ButtonProps } from '#Fabrique/ButtonV2';

export type FooterButton = Pick<
  ButtonProps,
  'color' | 'leftIcon' | 'rightIcon' | 'variant' | 'onClick'
> & {
  label: string;
};
