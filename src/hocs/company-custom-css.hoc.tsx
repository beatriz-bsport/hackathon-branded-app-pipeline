// @ts-nocheck
import React from 'react';
import ApplyCustomCssStyles from '#libs/widget/components/ApplyCustomCssStyles.component';
import type { MarketplaceCSSConfiguration } from '#libs/exportable-components/types';

type Props = {
  customConfiguration: MarketplaceCSSConfiguration;
};

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class extends React.Component<Props & P> {
    render() {
      return (
        <>
          {!!this.props.customConfiguration &&
            !!this.props.customConfiguration.apply_on_marketplace && (
              <ApplyCustomCssStyles
                customConfiguration={this.props.customConfiguration}
              />
            )}
          <WrappedComponent {...(this.props as P)} />
        </>
      );
    }
  };
};
