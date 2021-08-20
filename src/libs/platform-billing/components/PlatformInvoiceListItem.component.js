// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AttachIcon from '@material-ui/icons/Attachment';
import WarningIcon from '@material-ui/icons/Warning';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  platformInvoice: PlatformInvoice,
};

export const PlatformInvoiceListItem = (props: Props) => {
  const { t } = useTranslation(['platformBilling']);

  const { platformInvoice } = props;
  const { pdf_url, month, year, success, total_price_cts } = platformInvoice;
  return (
    <ListItem>
      <ListItemText
        primary={t('platformInvoice.label', { month, year })}
        secondary={`${getCurrencyDisplayWithPrice(total_price_cts / 100)}`}
      />
      {!!pdf_url && (
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => {
              window.location = pdf_url;
            }}
          >
            <AttachIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
      {!!pdf_url && !success && (
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => {
              window.location = pdf_url;
            }}
          >
            <WarningIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default PlatformInvoiceListItem;
