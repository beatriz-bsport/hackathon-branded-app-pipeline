import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Theme } from '@material-ui/core';

import { compose } from 'recompose';

import { WithTranslation, withTranslation } from 'react-i18next';
import Analytics from '../../../components/analytics/Analytics.component';
import PaymentPackItem from '../../payment-packs/components/PaymentPackBookableItem.component';
import { PrivatePass } from '../../private-service/types';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  privatePassList: Array<PrivatePass>;
  onAddBasket: (privatePassId: number) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

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
              <PaymentPackItem paymentPack={pp} />
              <ListItemSecondaryAction>
                <IconButton
                  color="primary"
                  disabled={!props.onAddBasket}
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

const styles = (theme: Theme) => ({
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1) * 1,
  },
});

export default compose<any, OwnProps>(
  withTranslation(),
  withStyles(styles),
)(MarketplacePrivatePassList);
