// @flow
import React from 'react';

import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  dataLayer: {},
};

type Props = {
  theme?: ?CompanyTheme,
  username?: ?string,
  isInternal?: boolean,
};

export class GoogleTagManager extends React.Component<Props> {
  initializeGTM = () => {
    if (!this.props.theme || !this.props.theme.gtmId || this.props.isInternal) {
      TagManager.initialize({
        ...tagManagerArgs,
        gtmId: 'GTM-W4G3NQ6',
      });
      setTimeout(() => {
        (window.dataLayer || []).push({
          config: 'UA-158864226-1',
          custom_map: { dimension1: 'email' },
        });
        (window.dataLayer || []).push({
          event: 'email_dimension',
          email: this.props.username,
        });
      }, 1000);
    } else {
      TagManager.initialize({
        ...tagManagerArgs,
        gtmId: this.props.theme.gtmId,
      });
    }
  };

  componentDidMount() {
    if (this.props.isInternal || this.props.theme) {
      this.initializeGTM();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.props.isInternal) {
      if (
        this.props.theme &&
        (!prevProps.theme || this.props.theme.gtmId !== prevProps.theme.gtmId)
      ) {
        this.initializeGTM();
      }
    }
  }

  render() {
    return <div />;
  }
}

export default GoogleTagManager;
