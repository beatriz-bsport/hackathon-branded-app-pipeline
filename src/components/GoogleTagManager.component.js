// @flow
import React from 'react';

import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  dataLayer: {},
};

type Props = {
  theme: ?CompanyTheme,
};

export class GoogleTagManager extends React.Component<Props> {
  componentDidMount() {
    if (this.props.theme) {
      TagManager.initialize({
        ...tagManagerArgs,
        gtmId: this.props.theme.gtmId || 'GTM-W4G3NQ6',
      });
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
  }

  render() {
    return <div />;
  }
}

export default GoogleTagManager;
