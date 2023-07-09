// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';
import { getCreditFactor } from '#libs/theme/selectors';

type Props = {
  creditRefund: ConsumerPaymentPackCreditRefund,
  onClick: () => void,
  dense?: boolean,
  divider?: boolean,
};
export const ConsumerPaymentPackCreditRefundListItem = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const description = props.creditRefund.credits
    ? t('consumerPaymentPack.refund.description', {
        credits: props.creditRefund.credits / getCreditFactor(),
        note: props.creditRefund.note,
      })
    : props.creditRefund.note;
  return (
    <ListItem
      dense={props.dense}
      divider={props.divider}
      button={props.onClick}
      onClick={props.onClick}
    >
      <ListItemText
        primary={description}
        secondary={formatAsDatetimeAdapted(
          props.creditRefund.date_created,
          'LL',
        )}
      />
      <ListItemSecondaryAction>
        <Typography variant="subtitle1" color="primary">
          {`${getCurrencyDisplayWithPrice(props.creditRefund.price || 0)}`}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ConsumerPaymentPackCreditRefundListItem;
