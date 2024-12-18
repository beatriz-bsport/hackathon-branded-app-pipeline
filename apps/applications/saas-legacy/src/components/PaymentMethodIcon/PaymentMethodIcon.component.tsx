import React from 'react';

import '#src/components/PaymentMethodIcon/styles.css';

type Props = {
  src: string;
  alt: string;
};

export const PaymentMethodIcon: React.FC<Props> = React.memo(({ src, alt }) => {
  return (
    <div className="bs-payment-method-icon__container">
      <img alt={alt} className="bs-payment-method-icon__image" src={src} />
    </div>
  );
});
