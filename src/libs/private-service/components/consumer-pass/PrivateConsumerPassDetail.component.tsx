import React from 'react';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import PaginatedListStateful from '#components/PaginatedListStateful.component';
import PrivateBookingListItem from '../booking/PrivateBookingListItem.component';
import PrivateBookingDisableDialog from '../booking/PrivateBookingDisableDialog.component';
import PrivateConsumerPassExtensionListItem from './PrivateConsumerPassExtensionListItem.component';
import InvoiceListItem from '#libs/invoice/InvoiceListItem.component';
import { OptionCallback } from '../../../../state/types';
import {
  PrivateBooking,
  PrivateConsumerPass,
  PrivateConsumerPassExtension,
} from '#libs/private-service/types';
import { Invoice } from '#libs/invoice/types';

type Props = {
  private_booking_list: Array<PrivateBooking>;
  privateBookingsLoading: boolean;
  fetchPrivateConsumerPass: (id: number) => void;
  goToPrivateBooking: (privateBookingId: number) => void;
  private_consumer_pass?: PrivateConsumerPass;
  onCreateExtension: () => void;
  extensions: Array<PrivateConsumerPassExtension>;
  disablePrivateBooking: (
    id: number,
    data: any,
    options: OptionCallback<PrivateBooking>,
  ) => void;
  deletePrivateBooking: (
    id: number,
    data: any,
    options: OptionCallback<PrivateBooking>,
  ) => void;
  invoice?: Invoice;
  onInvoiceClick?: (uuid: string) => void;
  extensionsLoading: boolean;
  deleteExtension: (extensionId: number) => void;
  privateConsumerPassExtensionDeleteLoading: boolean;
  forceRegularizeUnpaid?: (options: OptionCallback) => void;
};

export const PrivateConsumerPassDetail = (props: Props) => {
  const [regularizeProcessing, setRegularizeProcessing] = React.useState(false);
  const [privateBookingToDelete, setPrivateBookingToDelete] =
    React.useState<PrivateBooking | null>(null);
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  return (
    <div>
      {props.invoice ? (
        <div className={classes.section}>
          <Typography
            variant="h5"
            component="h2"
            className={classes.sectionTitle}
          >
            {t('consumerPass.detail.invoice')}
          </Typography>
          <Paper>
            <InvoiceListItem
              onClick={() => props.onInvoiceClick(props.invoice.uuid)}
              invoice={props.invoice}
            />
          </Paper>
        </div>
      ) : null}
      {!!props.extensionsLoading && <LinearProgress />}
      {props.extensions && props.extensions.length ? (
        <div className={classes.section}>
          <Typography
            variant="h5"
            component="h2"
            className={classes.sectionTitle}
          >
            {t('consumerPass.detail.extensionsTitle')}
          </Typography>
          <Paper>
            {!!props.privateConsumerPassExtensionDeleteLoading && (
              <LinearProgress />
            )}
            <List disablePadding>
              {props.extensions.map((ex) => (
                <PrivateConsumerPassExtensionListItem
                  key={ex.id}
                  extension={ex}
                  divider
                  onDelete={
                    props.private_consumer_pass &&
                    !props.private_consumer_pass.dst_private_consumer_pass
                      ? () => props.deleteExtension(ex.id)
                      : null
                  }
                />
              ))}
            </List>
          </Paper>
        </div>
      ) : null}
      {props.onCreateExtension &&
        !!props.private_consumer_pass &&
        !props.private_consumer_pass?.private_pass?.template_instance && (
          <div className={classes.addButtonContainer}>
            <Button
              variant="outlined"
              color="primary"
              onClick={props.onCreateExtension}
            >
              {t('consumerPass.actions.addExtension')}
            </Button>
          </div>
        )}
      <div className={classes.section}>
        <Typography
          variant="h5"
          component="h2"
          className={classes.sectionTitle}
        >
          {t('consumerPass.detail.booking')}
        </Typography>
        <Paper>
          <PaginatedListStateful
            itemPerPage={5}
            loading={props.privateBookingsLoading}
            listProps={{ disablePadding: true }}
            items={props.private_booking_list}
            renderItem={(b: PrivateBooking) => (
              <PrivateBookingListItem
                key={b.id}
                private_booking={b}
                onDelete={() => setPrivateBookingToDelete(b)}
                onClick={() => props.goToPrivateBooking(b.id)}
              />
            )}
          />
        </Paper>
        {!!props.forceRegularizeUnpaid && (
          <Button
            className={classes.paddingTop}
            disabled={regularizeProcessing}
            onClick={() => {
              setRegularizeProcessing(true);
              props.forceRegularizeUnpaid({
                onSuccess: () => setRegularizeProcessing(false),
                onError: () => setRegularizeProcessing(false),
              });
            }}
            variant="contained"
            color="primary"
          >
            {regularizeProcessing && (
              <CircularProgress size={16} color="inherit" />
            )}
            {t('privatePass.actions.forceRegularizeUnpaid')}
          </Button>
        )}
        {!!privateBookingToDelete && (
          <PrivateBookingDisableDialog
            open={!!privateBookingToDelete}
            private_booking={privateBookingToDelete}
            onClose={() => setPrivateBookingToDelete(null)}
            onSubmit={(force_refund) => {
              if (
                privateBookingToDelete.booking_status_code ===
                BOOKING_STATUS_OK.id
              ) {
                props.disablePrivateBooking(
                  privateBookingToDelete.id,
                  { force_refund },
                  {
                    onSuccess: () => {
                      props.fetchPrivateConsumerPass(
                        privateBookingToDelete.private_consumer_pass,
                      );
                      setPrivateBookingToDelete(null);
                    },
                  },
                );
                return;
              }
              props.deletePrivateBooking(
                privateBookingToDelete.id,
                { force_refund },
                {
                  onSuccess: () => {
                    props.fetchPrivateConsumerPass(
                      privateBookingToDelete.private_consumer_pass,
                    );
                    setPrivateBookingToDelete(null);
                  },
                },
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  addButtonContainer: {
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paddingTop: {
    marginTop: theme.spacing(1),
  },
}));

export default PrivateConsumerPassDetail;
