import React from 'react';

import Typography from '#Fabrique/Typography';
import Button, { Props as ButtonProps } from '#Fabrique/ButtonV2';

import './styles.css';

export type HeaderButton = Pick<
  ButtonProps,
  'color' | 'leftIcon' | 'rightIcon' | 'variant' | 'onClick'
> & {
  label: string;
};

type Props = {
  buttons: HeaderButton[];
  title: string;
};

export const ConsumerGenericHeader: React.FC<Props> = ({ buttons, title }) => (
  <div className="bs-consumer-generic-header">
    <Typography className="bs-consumer-generic-header__text" variant="title-lg">
      {title}
    </Typography>

    <div className="bs-consumer-generic-header__actions">
      {buttons?.map(
        ({ label, color, leftIcon, rightIcon, variant, onClick }) => (
          <Button
            key={label}
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
