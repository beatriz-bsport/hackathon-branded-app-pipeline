// @flow

import React, { Component, createContext } from 'react';
import type { AbstractComponent } from 'react';
import i18next from 'i18next';

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

const withDrawer = (
  title: string | ((*) => string),
  noTranslation: ?boolean,
) => {
  const mapPropsToTitle = typeof title === 'string' ? () => title : title;
  return (WrappedComponent: AbstractComponent<any>) => {
    class Wrapper extends Component<any> {
      static contextType = DrawerContext;

      componentDidMount() {
        // set the title only when it provided
        const titleString = mapPropsToTitle(this.props);
        if (titleString && noTranslation) {
          this.context.setTitle(titleString);
        }
        if (titleString && !noTranslation) {
          this.context.setTitle(i18next.t(`appbar.title.${titleString}` || ''));
        }
      }

      componentWillUnmount() {
        // necessary if you go on another page which is not composed with
        // this HOC
        this.context.setTitle('');
      }

      render() {
        return <WrappedComponent {...this.props} {...this.context} />;
      }
    }
    return Wrapper;
  };
};

export default withDrawer;
