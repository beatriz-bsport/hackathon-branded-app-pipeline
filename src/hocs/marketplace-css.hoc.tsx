import React, { Component } from 'react';

import { useMuiThemeToCssVars } from '../hooks/useMuiThemeToCssVars';

const MuiThemeToCssVarsHOC = (props: { children: React.ReactNode }) => {
  const style = useMuiThemeToCssVars();

  return <div style={style}>{props.children}</div>;
};

export function marketplaceCssHoc<P>(): (
  component: React.ComponentType<P>,
) => React.ReactNode {
  return (WrappedComponent: React.ComponentType<P>) => {
    class Wrapper extends Component<P> {
      render() {
        return (
          <MuiThemeToCssVarsHOC>
            <WrappedComponent {...this.props} />
          </MuiThemeToCssVarsHOC>
        );
      }
    }
    return Wrapper;
  };
}
