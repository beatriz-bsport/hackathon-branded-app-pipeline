// @flow

// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import WidgetUtils from '../libs/widget/WidgetUtils';

const DefaultTitle = 'Backoffice - bsport';

export function windowTitleToProps<P extends { title: string }>(
  WrappedComponent: React.ComponentType<P>,
) {
  return class extends React.Component {
    state = {
      title: '',
    };

    changeTitle = (ev: MutationRecord[]) => {
      if (ev[0].target?.innerText === DefaultTitle) {
        this.setState({ title: '' });
      } else {
        this.setState({ title: ev[0].target?.innerText });
      }
    };

    componentWillMount() {
      if (WidgetUtils.isWidget()) {
        return;
      }
      try {
        const observer = new MutationObserver(this.changeTitle);
        observer.observe(document.querySelector('title'), {
          childList: true,
        });
      } catch (err) {
        // because mutation observer are not really well implemented on all brosers
        console.error(err);
      }
    }

    render() {
      return (
        <WrappedComponent {...(this.props as P)} title={this.state.title} />
      );
    }
  };
}

function withTitle<P>(
  mapPropsToTitle: (props: any) => string,
): (component: React.ComponentType<P>) => React.ReactNode {
  if (WidgetUtils.isWidget()) {
    return (WrappedComponent) => WrappedComponent;
  }
  return (WrappedComponent: React.ComponentType<P>) => {
    class Wrapper extends Component<P> {
      componentWillUnmount() {
        // necessary if you go on another page which is not composed with
        // this HOC
        document.title = DefaultTitle;
      }

      render() {
        const title = mapPropsToTitle(this.props);

        return (
          <div>
            <Helmet>
              <title>{title}</title>
            </Helmet>
            <WrappedComponent {...(this.props as P)} />
          </div>
        );
      }
    }
    return Wrapper;
  };
}

export default withTitle;
