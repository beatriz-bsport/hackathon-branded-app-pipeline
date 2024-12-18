import { CSSProperties } from 'react';

export type CustomOptions = {
  textField?: { style?: CSSProperties };
  focus?: {
    withFocus?: boolean;
    onFocus?: () => void;
    updateFocus?: (focus: boolean) => void;
    childrenFocus?: boolean;
  };
  hover?: {
    childrenHover?: boolean;
  };
  rows?: {
    minRows: number;
  };
  margin?: {
    bottom?: boolean;
  };
  display?: {
    column?: boolean;
  };
};

export type StylesProps = {
  minRows: number;
  focus: boolean;
};
