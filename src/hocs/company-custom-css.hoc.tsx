import React from 'react';

import ApplyCustomCssStyles from '#libs/widget/components/ApplyCustomCssStyles.component';
import type { MarketplaceCSSConfiguration } from '#libs/exportable-components/types';
import ApplyCustomTheme from '#libs/exportable-components/ApplyCustomTheme.component';
import { CompanyTheme } from '#libs/theme/types';

type CustomCssConfigurationProps = {
  customConfiguration: MarketplaceCSSConfiguration;
};

type CompanyThemeProps =
  // theme or companyTheme can be provided. The below is done to avoid having
  // either to connect (redux) this HOC or changing props naming on pages where this HOC
  // is used.
  | {
      theme?: CompanyTheme;
      companyTheme: never;
    }
  | {
      companyTheme?: CompanyTheme;
      theme: never;
    };

type Props = CustomCssConfigurationProps & CompanyThemeProps;

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class extends React.Component<Props & P> {
    render() {
      const companyThemeProps = this.props.theme ?? this.props.companyTheme;

      return (
        <>
          <ApplyCustomTheme styles={companyThemeProps?.widget_theme} />
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
