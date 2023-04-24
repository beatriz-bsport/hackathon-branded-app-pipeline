// @ts-nocheck
import React from 'react';
// @ts-ignore
import { ElementsConsumer, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Theme } from '../libs/theme/types';
import { getStripePkKey } from '../libs/theme/selectors';

type Props = {
  theme: Theme;
};

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class extends React.Component<Props & P> {
    render() {
      const stripePromise = loadStripe(getStripePkKey());
      return (
        <Elements stripe={stripePromise}>
          <ElementsConsumer>
            {({ stripe, elements }) => (
              <WrappedComponent
                stripe={stripe}
                elements={elements}
                {...(this.props as P)}
              />
            )}
          </ElementsConsumer>
        </Elements>
      );
    }
  };
};
