import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';

const styles = (theme) => ({
  container: {},
});

type Props = {};

export class MyPaymentPacks extends Component<Props> {
  render() {
    return <div />;
  }
}

export default withStyles(styles)(translate()(MyPaymentPacks));
