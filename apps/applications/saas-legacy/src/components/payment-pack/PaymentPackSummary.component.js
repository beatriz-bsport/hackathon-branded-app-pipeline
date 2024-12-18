// @flow
import React, { Node } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation, TFunction } from 'react-i18next';

import { getValidityInfo } from '#src/libs/payment-packs/utils';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';

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
    : `${t('credits')}: ${getCreditsDividedDisplay(parseInt(credits, 10))}`;

  const dateInfo = getValidityInfo(paymentPack, props.t);
  const classes = useStyles();

  return (
    <ListItem
      dense
      button={!!button}
      divider={!!noDivider}
      selected={!!props.selected}
      style={props.isFocused ? { backgroundColor: '#EFEFEF' } : {}}
    >
      <div className={classes.container}>
        <ListItemText primary={name} secondary={creditsFormatted} />
        <div className={classes.rightInfo}>
          <Typography align="right" variant="caption">
            {getCurrencyDisplayWithPrice(price)}
          </Typography>
          <Typography align="right" variant="caption">
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

export default withTranslation(['paymentPack'])(PaymentPackMinimalSummary);
