// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import PaginatedListStateful from '../../../../components/PaginatedListStateful.component';
import PrivateBookingListItem from '../booking/PrivateBookingListItem.component';
import PrivateBookingDisableDialog from '../booking/PrivateBookingDisableDialog.component';
import InvoiceListItem from '../../../invoice/InvoiceListItem.component';

type Props = {
  private_booking_list: Array<PrivateBooking>,
  setPrivateBookingToDelete: (?PrivateBooking) => void,
  privateBookingToDelete: ?PrivateBooking,
  privateBookingsLoading: boolean,
  fetchPrivateConsumerPass: (id: number) => void,
  goToPrivateBooking: (privateBookingId: number) => void,
  disablePrivateBooking: (
    id: number,
    data: any,
    options: {
      onSuccess?: (PrivateBooking) => void,
      onError?: (Error) => void,
    },
  ) => void,
  deletePrivateBooking: (
    id: number,
    data: any,
    options: {
      onSuccess?: (PrivateBooking) => void,
      onError?: (Error) => void,
    },
  ) => void,
  t: TFunction,
  classes: Object,
  invoice: ?Invoice,
  onInvoiceClick?: (uuid: string) => void,
};
export const PrivateConsumerPassDetail = (props: Props) => {
  return (
    <div>
      {props.invoice ? (
        <div className={props.classes.section}>
          <Typography
            variant="h5"
            component="h2"
            className={props.classes.sectionTitle}
          >
            {props.t('consumerPass.detail.invoice')}
          </Typography>
          <Paper className={props.classes.paper}>
            <InvoiceListItem
              onClick={() => props.onInvoiceClick(props.invoice.uuid)}
              invoice={props.invoice}
            />
          </Paper>
        </div>
      ) : null}
      <div className={props.classes.section}>
        <Typography
          variant="h5"
          component="h2"
          className={props.classes.sectionTitle}
        >
          {props.t('consumerPass.detail.booking')}
        </Typography>
        <Paper>
          <PaginatedListStateful
            itemPerPage={5}
            loading={props.privateBookingsLoading}
            listProps={{ disablePadding: true }}
            items={props.private_booking_list}
            renderItem={(b) => (
              <PrivateBookingListItem
                key={b.id}
                private_booking={b}
                onDelete={() => props.setPrivateBookingToDelete(b)}
                onClick={() => props.goToPrivateBooking(b.id)}
              />
            )}
          />
        </Paper>
        <PrivateBookingDisableDialog
          open={!!props.privateBookingToDelete}
          private_booking={props.privateBookingToDelete}
          onClose={() => props.setPrivateBookingToDelete(null)}
          onSubmit={(force_refund) => {
            if (
              props.privateBookingToDelete.booking_status_code ===
              BOOKING_STATUS_OK.id
            ) {
              props.disablePrivateBooking(
                props.privateBookingToDelete.id,
                { force_refund },
                {
                  onSuccess: () => {
                    props.fetchPrivateConsumerPass(
                      props.privateBookingToDelete.private_consumer_pass,
                    );
                    props.setPrivateBookingToDelete(null);
                  },
                },
              );
              return;
            }
            props.deletePrivateBooking(
              props.privateBookingToDelete.id,
              { force_refund },
              {
                onSuccess: () => {
                  props.fetchPrivateConsumerPass(
                    props.privateBookingToDelete.private_consumer_pass,
                  );
                  props.setPrivateBookingToDelete(null);
                },
              },
            );
          }}
        />
      </div>
    </div>
  );
};

const styles = (theme) => ({
  section: {
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  withState('privateBookingToDelete', 'setPrivateBookingToDelete', null),
)(PrivateConsumerPassDetail);
