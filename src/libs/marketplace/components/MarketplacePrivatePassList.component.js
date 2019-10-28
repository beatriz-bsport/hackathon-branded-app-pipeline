// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
};
export const MarketplacePrivatePassList = (props: Props) => {
  if (!props.privatePassList || !props.privatePassList.length) {
    return null;
  }
  return (
    <div>
      <Typography variant="subtitle">
        {props.t('marketplace.privatePass')}
      </Typography>
      <List disablePadding dense>
        {props.privatePassList.map((pp) => (
          <ListItem key={pp.id}>
            <ListItemText
              primary={`${pp.name} - ${pp.price}€`}
              secondary={`${pp.credits} crédit(s)`}
            />
            <ListItemSecondaryAction>
              <IconButton
                color="primary"
                onClick={() => props.onAddBasket(pp.id)}
              >
                <AddShoppingCartIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

const styles = (theme) => ({
  container: {},
});

export default compose(
  withNamespaces(),
  withStyles(styles),
)(MarketplacePrivatePassList);
