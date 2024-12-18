import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import ButtonBase from '../ButtonBaseV2';
import { CardVariant, CardType } from './types';
import './styles.css';

export type CardProps = {
  /**
   * The content of the component.
   */
  children: React.ReactNode;
  /**
   * Extend the styles applied to the component.
   */
  className?: string;
  /**
   * The component used for the root node.
   * Either a div or a BaseButton component.
   * @default 'div'
   */
  componentType?: CardType;
  /**
   * A reference to a custom HTML `div` element.
   */
  customRef?: React.RefObject<HTMLDivElement>;
  /**
   *Indicates whether the ripple effect is enabled (true) or disabled (false).
   */
  isRippleEnabled?: boolean;
  /**
   * A callback function to be triggered when clicked.
   */
  onClick?: (
    event?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  /**
   * If `true`, rounded corners are disabled.
   * @default false
   */
  square?: boolean;
  /**
   * The variant to use.
   * @default 'rest'
   */
  variant?: CardVariant;
};

const Card: React.FC<CardProps> = ({
  children,
  className,
  componentType = 'div',
  customRef,
  isRippleEnabled = false,
  onClick,
  square,
  variant = 'rest',
}) => {
  const classes = classNames(
    'bs-fabrique-card-root',
    `bs-fabrique-card--${componentType}`,
    `bs-fabrique-card--${variant}`,
    {
      'bs-fabrique-card--square': square,
    },
    className,
  );

  if (componentType === 'button') {
    return (
      <ButtonBase
        className={classes}
        isRippleEnabled={isRippleEnabled}
        onClick={onClick}
        type="button"
      >
        {children}
      </ButtonBase>
    );
  }

  return (
    <div ref={customRef} className={classes}>
      {children}
    </div>
  );
};

export const CardStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Card>>()(Card);

export default React.memo(Card);
