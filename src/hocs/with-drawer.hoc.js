// @flow

import React, { Component, createContext } from 'react';
import type { Node } from 'react';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

export const DrawerContext = createContext({
  title: '',
});
type State = {
  title: string,
  setTitle: (title: string) => {},
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
  return (WrappedComponent: Node) => {
    class Wrapper extends Component<{ t: TFunction }> {
      static contextType = DrawerContext;

      componentDidMount() {
        // set the title only when it provided
        const titleString = mapPropsToTitle(this.props);
        if (titleString && noTranslation) {
          this.context.setTitle(titleString);
        }
        if (titleString && !noTranslation) {
          this.context.setTitle(
            this.props.t(`appbar.title.${titleString}` || ''),
          );
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
    return translate()(Wrapper);
  };
};

export default withDrawer;
