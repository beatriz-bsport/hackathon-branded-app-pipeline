import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';

import { OfferForm } from '../components';

const styles = (theme) => ({
  container: {},
});

type Props = {};

export class OfferFormPage extends Component<Props> {
  render() {
    const { id } = parseInt(this.props.match.params.id, 10);
    return <OfferForm metaActivityId={id} />;
  }
}

export default withStyles(styles)(translate()(OfferFormPage));
