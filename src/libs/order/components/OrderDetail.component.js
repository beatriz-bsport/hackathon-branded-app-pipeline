// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';

import {
  ORDER_STATE_CANCELLED,
  ORDER_STATE_ONSITEDELIVERY,
  ORDER_STATE_SENT,
} from '@bsport/common/lib/master-data/order-states';
import RedButton from '../../../components/button/RedButton.component';
import MemberSummaryCard from '../../member/components/MemberSummaryCard.component';
import ProductLine from './ProductLine.component';
import DeliveryInfo from './DeliveryInfo.component';
import InvoiceSummary from '../../invoice/InvoiceListItem.component';

import type { OrderWithProducts } from '../types';
import type { Member } from '../../member/types';
import type { Invoice } from '../../invoice/types';

import DeliveryFeeListItem from './DeliveryFeeListItem.component';

type Props = {
  onInvoiceClick: (uuid: string) => void,
  goToMember: (id: number) => void,
  updateOrderState: (id: number) => void,
  mailMember: () => void,

  order: ?OrderWithProducts,
  invoice: ?Invoice,
  member: ?Member,

  t: TFunction,
  classes: Object,
};

export const OrderDetail = (props: Props) => {
  const {
    order,
    invoice,
    t,
    classes,
    onInvoiceClick,
    updateOrderState,
    goToMember,
    mailMember,
  } = props;
  return (
    <div>
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography inline component="h2" variant="h4">
            {t('detail.section.title')}
          </Typography>
          <Typography
            color={
              order.state === ORDER_STATE_CANCELLED.id ? 'error' : 'primary'
            }
            component="p"
            variant="h4"
          >
            {t(`state.${order.state}`)}
          </Typography>
        </div>
        <Divider className={classes.bannerDivider} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <RedButton
            variant="contained"
            className={classes.actionButton}
            disabled={order.state >= 1000}
            onClick={() => updateOrderState(ORDER_STATE_CANCELLED.id)}
          >
            <CancelIcon className={classes.leftIcon} />
            {t('actions.flagAsCancelled')}
          </RedButton>
          <Button
            color="secondary"
            variant="contained"
            className={classes.actionButton}
            disabled={order.state >= 1000}
            onClick={() => updateOrderState(ORDER_STATE_ONSITEDELIVERY.id)}
          >
            <LocationOnIcon className={classes.leftIcon} />
            {t('actions.flagAsOnSiteDelivery')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.actionButton}
            disabled={order.state >= 1000}
            onClick={() => updateOrderState(ORDER_STATE_SENT.id)}
          >
            <SendIcon className={classes.leftIcon} />
            {t('actions.flagAsSent')}
          </Button>
        </div>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography
            component="h2"
            variant="h5"
            className={classes.sectionTitle}
          >
            {t('detail.section.productDetail')}
          </Typography>
          <Paper>
            <List dense disablePadding>
              {order ? (
                <React.Fragment>
                  {order.product_lines.map((pl) => (
                    <ProductLine key={pl.product_id} product={pl} />
                  ))}
                  {order.delivery_fee ? (
                    <DeliveryFeeListItem deliveryFee={order.delivery_fee} />
                  ) : null}
                </React.Fragment>
              ) : (
                <CircularProgress />
              )}
            </List>
          </Paper>
          <Typography
            component="h2"
            variant="h5"
            className={classes.sectionTitle}
          >
            {t('detail.section.deliveryInfo')}
          </Typography>
          <Paper className={classes.addressPaper}>
            <DeliveryInfo order={order} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            component="h2"
            variant="h5"
            className={classes.sectionTitle}
          >
            {t('detail.section.invoice')}
          </Typography>
          <Paper>
            <InvoiceSummary invoice={invoice} onClick={onInvoiceClick} />
          </Paper>
          <Typography
            component="h2"
            variant="h5"
            className={classes.sectionTitle}
          >
            {t('detail.section.member')}
          </Typography>
          {order.member ? (
            <MemberSummaryCard
              memberId={order.member.id}
              member={order.member}
              goToMember={() => goToMember(order.member.id)}
              mailMember={mailMember}
            />
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

const styles = (theme) => ({
  bannerDivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  addressPaper: {
    padding: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  actionButton: {
    marginLeft: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['order']),
  withStyles(styles),
)(OrderDetail);
