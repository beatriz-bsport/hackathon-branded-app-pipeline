// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import {
  getCurrencyDisplayWithPrice,
  getCreditFactor,
} from '../../theme/selectors';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

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
      button={props.onClick}
      dense={props.dense}
      divider={props.divider}
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
        <Typography color="primary" variant="subtitle1">
          {`${getCurrencyDisplayWithPrice(props.creditRefund.price || 0)}`}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ConsumerPaymentPackCreditRefundListItem;
