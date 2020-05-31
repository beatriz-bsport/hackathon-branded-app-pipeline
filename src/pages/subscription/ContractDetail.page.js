// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
};

export class ContractDetail extends React.Component<Props> {
  render() {
    return <div />;
  }
}

const styles = (theme) => ({
  container: {},
});

export default compose(
  withTranslation(),
  withStyles(styles),
)(ContractDetail);
