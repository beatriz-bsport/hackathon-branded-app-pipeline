// @flow

import React, { Component, createContext } from 'react';
import type { AbstractComponent } from 'react';

// eslint-disable-next-line
export const DrawerContext = createContext({
  title: '',
});

type State = {
  title: ?string,
  setTitle: (title: string) => void,
};
type Props = {
  children: any,
};
export class DrawerContextProvider extends Component<Props, State> {
  state = {
    title: '',
    setTitle: (title) => this.setState({ title }),
  };

  render() {
    return (
      <DrawerContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </DrawerContext.Provider>
    );
  }
}

const withDrawer = (mapPropsToTitle: (*) => string) => {
  return (WrappedComponent: AbstractComponent<any>) => {
    class Wrapper extends Component<any> {
      static contextType = DrawerContext;

      componentDidMount() {
        // set the title only when it provided
        const title = mapPropsToTitle(this.props) || '';
        this.context.setTitle(title);
      }

      componentWillUnmount() {
        // necessary if you go on another page which is not composed with
        // this HOC
        this.context.setTitle('');
      }

      render() {
        const title = mapPropsToTitle(this.props);
        if (title !== this.context.title) {
          this.context.setTitle(title);
        }
        return <WrappedComponent {...this.props} {...this.context} />;
      }
    }
    return Wrapper;
  };
};

export default withDrawer;
