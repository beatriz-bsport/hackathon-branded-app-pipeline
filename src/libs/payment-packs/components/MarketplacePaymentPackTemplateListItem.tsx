import React from 'react';

import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import { AddShoppingCart } from '@material-ui/icons';
import { PaymentPackTemplate } from '../types';
import PaymentPackItem from '#libs/booker-module/components/PaymentPackBookableItem.component';

type OwnProps = {
  paymentPackTemplate: PaymentPackTemplate;
  onSelect: () => void;
  buyPaymentPackTemplateInstance: () => void;
};
type Props = OwnProps;
export const MarketplacePaymentPackTemplateListItem = (props: Props) => {
  const { onSelect, paymentPackTemplate, buyPaymentPackTemplateInstance } =
    props;

  return (
    <ListItem divider button onClick={onSelect}>
      <PaymentPackItem paymentPack={paymentPackTemplate} />
      <IconButton style={{ marginRight: 16 }} disableRipple onClick={onSelect}>
        <Visibility />
      </IconButton>
      <ListItemSecondaryAction>
        <React.Fragment>
          <IconButton
            color="primary"
            onClick={() => buyPaymentPackTemplateInstance()}
          >
            <AddShoppingCart />
          </IconButton>
        </React.Fragment>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default MarketplacePaymentPackTemplateListItem;
