import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

/**
 * @description This HOC provides a store from props if necessary.
 * If any store is detected from props, re-provide the correct redux context from props.
 * @returns {React.Component<WrappedComponentProps>}
 */
function ReLiftReduxProviderIfDetected<
  WrappedComponentProps extends {
    /** Optional store context passed for widget case */
    store: Store;
  },
>(): (
  component: React.ComponentType<WrappedComponentProps>,
) => React.ReactNode {
  return (WrappedComponent: React.ComponentType<WrappedComponentProps>) => {
    class Wrapper extends React.Component<WrappedComponentProps> {
      render() {
        const { store } = this.props;

        if (store) {
          return (
            <Provider store={store}>
              <WrappedComponent {...this.props} />
            </Provider>
          );
        }
        return <WrappedComponent {...this.props} />;
      }
    }
    return Wrapper;
  };
}

export default ReLiftReduxProviderIfDetected;
