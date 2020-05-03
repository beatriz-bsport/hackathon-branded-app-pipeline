// @flow
import React from 'react';
import type { Node } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { getValidityInfo } from '../../libs/payment-packs/utils';

type Props = {
  t: TFunction,
  paymentPack: Object,
  noDivider: boolean,
  buyButton: ?Node,
  button: boolean,
  selected?: boolean,
  isFocused?: boolean,
};

export function PaymentPackMinimalSummary(props: Props) {
  const { t, paymentPack, noDivider, buyButton, button } = props;
  const { name, credits, unlimited, price } = paymentPack;

  const creditsFormatted = unlimited
    ? t('unlimitedCredits')
    : `${t('credits')}: ${credits}`;

  const dateInfo = getValidityInfo(paymentPack, props.t);

  return (
    <ListItem
      divider={!!noDivider}
      dense
      button={!!button}
      selected={!!props.selected}
      style={props.isFocused ? { backgroundColor: '#EFEFEF' } : {}}
    >
      <ListItemText primary={name} secondary={creditsFormatted} />
      <ListItemText
        primary={`${price} €`}
        primaryTypographyProps={{ align: 'right', variant: 'caption' }}
        secondaryTypographyProps={{ align: 'right', variant: 'caption' }}
        secondary={dateInfo}
      />
      {buyButton}
    </ListItem>
  );
}

export default withNamespaces(['paymentPack'])(PaymentPackMinimalSummary);
