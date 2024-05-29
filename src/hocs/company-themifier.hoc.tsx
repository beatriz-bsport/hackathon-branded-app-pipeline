import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
// @ts-expect-error
import { getTheme, getFranchiseTheme } from '../theme';
import { CompanyTheme } from '../libs/theme/types';
import {
  Franchise,
  FranchiseDetails,
  FranchiseTheme,
} from '#src/libs/franchise/types';

type Props = {
  theme: CompanyTheme;
  franchisor?: Franchise | FranchiseDetails;
  franchiseTheme?: FranchiseTheme;
};

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class extends React.Component<Props & P> {
    getMuiTheme = () => {
      // @ts-expect-error
      if (!!this.props.franchisor && !!this.props.franchiseTheme) {
        // @ts-expect-error
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
