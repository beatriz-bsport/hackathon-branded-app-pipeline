// @flow
import React from 'react';

import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  dataLayer: {},
};

type Props = {
  theme: ?CompanyTheme,
  username?: ?string,
};

export class GoogleTagManager extends React.Component<Props> {
  componentDidMount() {
    if (this.props.theme) {
      TagManager.initialize({
        ...tagManagerArgs,
        gtmId: this.props.theme.gtmId || 'GTM-W4G3NQ6',
      });
      (window.dataLayer || []).push({ email: this.props.username });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.theme &&
      (!prevProps.theme || this.props.theme.gtmId !== prevProps.theme.gtmId)
    ) {
      TagManager.initialize({
        ...tagManagerArgs,
        gtmId: this.props.theme.gtmId || 'GTM-W4G3NQ6',
      });
    }
    if (this.props.username && this.props.username !== prevProps.username) {
      (window.dataLayer || []).push({ email: this.props.username });
    }
  }

  render() {
    return <div />;
  }
}

export default GoogleTagManager;
