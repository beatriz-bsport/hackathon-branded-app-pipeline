// @flow
import React from 'react';
import type { Node } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
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
  const classes = useStyles();

  return (
    <ListItem
      divider={!!noDivider}
      dense
      button={!!button}
      selected={!!props.selected}
      style={props.isFocused ? { backgroundColor: '#EFEFEF' } : {}}
    >
      <div className={classes.container}>
        <ListItemText primary={name} secondary={creditsFormatted} />
        <div className={classes.rightInfo}>
          <Typography variant="caption" align="right">
            {`${price} €`}
          </Typography>
          <Typography variant="caption" align="right">
            {dateInfo}
          </Typography>
        </div>
      </div>

      {buyButton}
    </ListItem>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  rightInfo: {
    paddingRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default withNamespaces(['paymentPack'])(PaymentPackMinimalSummary);
