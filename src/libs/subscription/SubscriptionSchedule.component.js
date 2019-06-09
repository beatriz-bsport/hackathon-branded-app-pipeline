// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { withNamespaces } from 'react-i18next';
import {
  PENDING,
  SUCCEEDED,
  FAILED,
  CANCELED,
} from '@bsport/common/lib/master-data/planned-invoice-status';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import CancelIcon from '@material-ui/icons/Cancel';

import type { StatusCode } from '@bsport/common/lib/master-data/planned-invoice-status';
import type { TFunction } from 'react-i18next';

import { formatAsDate } from '../../datetime';
import PaginatedList from '../../components/PaginatedListStateful.component';

import type { PlannedInvoice } from './types';

const renderStatus = (t: TFunction, status: StatusCode) => {
  switch (status) {
    case PENDING.id:
      return {
        statusText: t('plannedInvoiceStatus.pending'),
        statusIcon: <HourglassEmptyIcon color="secondary" />,
      };
    case SUCCEEDED.id:
      return {
        statusText: t('plannedInvoiceStatus.succeeded'),
        statusIcon: <CheckIcon color="primary" />,
      };
    case CANCELED.id:
      return {
        statusText: t('plannedInvoiceStatus.canceled'),
        statusIcon: <CancelIcon color="secondary" />,
      };
    case FAILED.id:
    default:
      return {
        statusText: t('plannedInvoiceStatus.failed'),
        statusIcon: <ErrorIcon color="error" />,
      };
  }
};

const PlannedInvoiceItem = (props: {
  invoice: PlannedInvoice,
  onClick: (event: *) => void,
  t: TFunction,
}) => {
  const { statusText, statusIcon } = renderStatus(
    props.t,
    props.invoice.status,
  );
  return (
    <ListItem button={!!props.onClick} onClick={props.onClick} divider>
      <ListItemText
        primary={formatAsDate(props.invoice.date)}
        secondary={(props.invoice.uuid && props.invoice.uuid.slice(0, 8)) || ''}
      />
      <ListItemText
        primary={`${props.invoice.price} €`}
        secondary={statusText}
        primaryTypographyProps={{ align: 'right' }}
        secondaryTypographyProps={{ align: 'right' }}
      />
      <ListItemSecondaryAction>
        <IconButton disabled>{statusIcon}</IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

type Props = {
  t: TFunction,
  onPlannedInvoiceClick: (uuid: string) => void,
  scheduledInvoices: Array<PlannedInvoice>,
};

export function SubscriptionSchedule(props: Props) {
  return (
    <PaginatedList
      listProps={{ dense: true, disablePadding: true }}
      itemPerPage={6}
      items={props.scheduledInvoices}
      renderItem={(si, idx) => (
        <PlannedInvoiceItem
          invoice={si}
          t={props.t}
          key={idx}
          onClick={
            props.onPlannedInvoiceClick
              ? () => props.onPlannedInvoiceClick(si.uuid)
              : null
          }
        />
      )}
    />
  );
}

export default withNamespaces(['subscription'])(SubscriptionSchedule);
