import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { getTheme } from '../theme';

export default (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <MuiThemeProvider theme={getTheme(this.props.theme)}>
          <WrappedComponent {...this.props} />;
        </MuiThemeProvider>
      );
    }
  };
};
