import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import { useMuiThemeToCssVars } from '../hooks/useMuiThemeToCssVars';

const MuiThemeToCssVarsHOC = (props: { children: React.ReactNode }) => {
  const styles = useMuiThemeToCssVars();

  return (
    <>
      <Helmet>
        <style>
          {`
            /* Here is the setup of the variables */
            #bs-setup-derived-variable {
              ${styles.id}
            }

            /* using the lesser class priority for derived variables */
            .bs-setup-variable {
              ${styles.classes}
            }

          `}
        </style>
      </Helmet>
      <div className="bs-setup-variable" id="bs-setup-derived-variable">
        {props.children}
      </div>
    </>
  );
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
