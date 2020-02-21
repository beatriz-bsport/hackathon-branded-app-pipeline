// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
}
export const ShopItemFeatured = (props: Props) => {
  return (
    <div/>
  )
}

const styles = (theme) => ({
  container: {},
})

export default compose(
  withNamespaces(),
  withStyles(styles),
)(ShopItemFeatured)
