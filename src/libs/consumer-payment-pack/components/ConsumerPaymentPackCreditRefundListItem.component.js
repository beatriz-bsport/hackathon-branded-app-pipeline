// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

type Props = {};
export const ConsumerPaymentPackCreditRefundListItem = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const description = props.creditRefund.credits
    ? t('consumerPaymentPack.refund.description', {
        credits: props.creditRefund.credits,
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
        secondary={moment(props.creditRefund.date_created).format('LL')}
      />
      <ListItemSecondaryAction>
        <Typography variant="subtitle1" color="primary">
          {`${props.creditRefund.price || 0} €`}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ConsumerPaymentPackCreditRefundListItem;
