// @flow

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

const DefaultTitle = 'Backoffice - bsport';

export function windowTitleToProps(WrappedComponent) {
  return class extends React.Component {
    state = {
      title: '',
    };

    changeTitle = (newTitle) => {
      if (newTitle[0].target.innerText === DefaultTitle) {
        this.setState({ title: '' });
      } else {
        this.setState({ title: newTitle[0].target.innerText });
      }
    };

    componentWillMount() {
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
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
}

const withTitle = (mapPropsToTitle: (any) => string) => {
  return (WrappedComponent: AbstractComponent<any>) => {
    class Wrapper extends Component<any> {
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
            <WrappedComponent {...this.props} />
          </div>
        );
      }
    }
    return Wrapper;
  };
};

export default withTitle;
