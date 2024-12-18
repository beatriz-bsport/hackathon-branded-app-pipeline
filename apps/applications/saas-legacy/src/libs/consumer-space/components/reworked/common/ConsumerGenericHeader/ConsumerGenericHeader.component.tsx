import React from 'react';

import Typography from '#Fabrique/Typography';
import Button, { Props as ButtonProps } from '#Fabrique/ButtonV2';
import IconButton from '#Fabrique/IconButton';

import './styles.css';

export type HeaderButton = Pick<
  ButtonProps,
  'color' | 'leftIcon' | 'rightIcon' | 'variant' | 'onClick'
> & {
  label: string;
};

type Props = {
  isMobile?: boolean;
  buttons?: HeaderButton[];
  title: string;
};

export const ConsumerGenericHeader: React.FC<Props> = ({
  isMobile,
  buttons,
  title,
}) => (
  <div className="bs-consumer-generic-header">
    <Typography className="bs-consumer-generic-header__text" variant="title-lg">
      {title}
    </Typography>

    <div className="bs-consumer-generic-header__actions">
      {buttons?.map(
        ({ label, color, leftIcon, rightIcon, variant, onClick }, index) =>
          isMobile ? (
            <IconButton
              key={index}
              color={color}
              onClick={onClick}
              size="md"
              variant={variant}
            >
              {leftIcon || rightIcon}
            </IconButton>
          ) : (
            <Button
              key={index}
              className="bs-consumer-generic-header__actions__button"
              color={color}
              leftIcon={leftIcon}
              onClick={onClick}
              rightIcon={rightIcon}
              size="md"
              variant={variant}
            >
              {label}
            </Button>
          ),
      )}
    </div>
  </div>
);

export default React.memo(ConsumerGenericHeader);
