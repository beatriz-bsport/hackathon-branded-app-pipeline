import React from 'react';
import Button from '#Fabrique/ButtonV2';

import type { FooterButton } from './types';
import './styles.css';

type Props = {
  buttons: FooterButton[];
};

const ConsumerGenericFooter: React.FC<Props> = ({ buttons }) => {
  return (
    <div className="bs-consumer-generic-footer">
      <div className="bs-consumer-generic-footer__actions">
        {buttons?.map(
          ({ label, color, leftIcon, rightIcon, variant, onClick }) => (
            <Button
              key={label}
              className="bs-consumer-generic-footer__actions__button"
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
};

export default React.memo(ConsumerGenericFooter);
