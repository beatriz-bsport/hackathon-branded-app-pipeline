// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { compose } from 'recompose';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { getCurrencyDisplay } from '../../theme/selectors';
import Analytics from '../../../components/analytics/Analytics.component';

type Props = {
  privatePassList: Array<PrivatePass>,
  onAddBasket: (privatePassId: number) => void,
  classes: Object,
  t: TFunction,
};

export const MarketplacePrivatePassList = (props: Props) => {
  if (!props.privatePassList || !props.privatePassList.length) {
    return null;
  }
  return (
    <div>
      <Typography
        component="h3"
        variant="h6"
        className={props.classes.sectionTitle}
      >
        {props.t('marketplace.privatePassListTitle')}
      </Typography>
      <Paper>
        <List disablePadding dense>
          {props.privatePassList.map((pp) => (
            <ListItem divider key={pp.id}>
              <ListItemText
                primary={`${pp.name} - ${pp.price}${getCurrencyDisplay()}`}
                secondary={`${pp.credits} crédit(s)`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  color="primary"
                  onClick={() => {
                    props.onAddBasket(pp.id);
                    Analytics.addPrivatePassToCart(pp);
                  }}
                >
                  <AddShoppingCartIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

const styles = (theme) => ({
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1) * 1,
  },
});

export default compose(
  withTranslation(),
  withStyles(styles),
)(MarketplacePrivatePassList);
