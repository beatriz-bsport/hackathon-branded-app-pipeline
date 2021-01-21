import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
// @ts-ignore
import { getTheme } from '../theme';
import { Theme } from '../libs/theme/types';

type Props = {
  theme: Theme;
};

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class extends React.Component<Props & P> {
    render() {
      return (
        <MuiThemeProvider theme={getTheme(this.props.theme)}>
          <WrappedComponent {...(this.props as P)} />
        </MuiThemeProvider>
      );
    }
  };
};
