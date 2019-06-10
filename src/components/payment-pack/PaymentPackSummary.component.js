// @flow
import React from 'react';
import type { Node } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../datetime';

type Props = {
  t: TFunction,
  paymentPack: Object,
  noDivider: boolean,
  buyButton: ?Node,
  button: boolean,
};

export function PaymentPackMinimalSummary(props: Props) {
  const { t, paymentPack, noDivider, buyButton, button } = props;
  const {
    name,
    credits,
    validity_daterange,
    duration_days,
    duration_months,
    duration_years,
    unlimited,
    price,
  } = paymentPack;

  const creditsFormatted = unlimited
    ? t('paymentPack.unlimitedCredits')
    : `${t('paymentPack.credits')}: ${credits}`;

  let dateInfo = '';
  if (duration_days || duration_months || duration_years) {
    dateInfo = t('paymentPack.validForDuration')(
      duration_days,
      duration_months,
      duration_years,
    );
  }
  if (validity_daterange) {
    dateInfo = `${t('paymentPack.validity')} ${formatAsDate(
      Moment(validity_daterange.lower),
    )} - ${formatAsDate(Moment(JSON.parse(validity_daterange).upper))}`;
  }

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

export default withNamespaces()(PaymentPackMinimalSummary);
