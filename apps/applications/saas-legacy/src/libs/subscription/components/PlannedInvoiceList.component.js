// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import PaginatedListBase from '../../../components/PaginatedListBase.component';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

const PlannedInvoiceListItem = (props: {
  plannedInvoice: PlannedInvoice,
  onClick: (billingPlanId: number) => void,
}) => {
  const { plannedInvoice } = props;
  return (
    <ListItem divider>
      <ListItemText
        primary={plannedInvoice.name}
        secondary={formatAsDatetimeAdapted(plannedInvoice.date, 'DDD')}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => props.onClick(plannedInvoice.billing_plan)}>
          <ArrowForwardIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

type Props = {
  title: string,
  count: number,
  loading: boolean,
  plannedInvoiceList: Array<PlannedInvoice>,
  itemPerPage: number,
  page: number,
  fetchPlannedInvoicePage: () => void,
  onClick: (billingPlanId: number) => void,
};

export const PlannedInvoiceList = (props: Props) => {
  const classes = useStyles();
  return (
    <Paper>
      {!!props.title && (
        <div>
          <div className={classes.title}>
            <Typography variant="subtitle">{props.title}</Typography>
          </div>
          <Divider />
        </div>
      )}
      <PaginatedListBase
        itemPerPage={props.itemPerPage}
        items={props.plannedInvoiceList}
        listProps={{ dense: true, divider: true, disablePadding: true }}
        loading={props.loading}
        nbItems={props.count}
        onPageRequested={props.fetchPlannedInvoicePage}
        page={props.page}
        renderItem={(plannedInvoice) => (
          <PlannedInvoiceListItem
            key={plannedInvoice.id}
            onClick={props.onClick}
            plannedInvoice={plannedInvoice}
          />
        )}
      />
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(2),
  },
}));

export default PlannedInvoiceList;
