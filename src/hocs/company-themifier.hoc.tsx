// @ts-nocheck
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
// @ts-expect-error
import { getTheme, getFranchiseTheme } from '../theme';
import { Theme } from '../libs/theme/types';

type Props = {
  theme: Theme;
};

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class extends React.Component<Props & P> {
    getMuiTheme = () => {
      if (!!this.props.franchisor && !!this.props.franchiseTheme) {
        return getFranchiseTheme(this.props.franchiseTheme);
      }
      return getTheme(this.props.theme);
    };

    render() {
      return (
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <WrappedComponent {...(this.props as P)} />
        </MuiThemeProvider>
      );
    }
  };
};
