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
// @ts-expect-error
import PaginatedListStateful from '#components/PaginatedListStateful.component';
import PrivateBookingListItem from '../booking/PrivateBookingListItem.component';
import PrivateBookingDisableDialog from '../booking/PrivateBookingDisableDialog.component';
// @ts-expect-error
import PrivateConsumerPassExtensionListItem from './PrivateConsumerPassExtensionListItem.component';
import InvoiceListItem from '#libs/invoice/InvoiceListItem.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
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

export const PrivateConsumerPassDetail: React.FC<Props> = (props) => {
  const [regularizeProcessing, setRegularizeProcessing] = React.useState(false);
  const [privateBookingToDelete, setPrivateBookingToDelete] =
    React.useState<PrivateBooking | null>(null);
  const { t } = useTranslation('privateService');
  const classes = useStyles();

  return (
    <div>
      <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.readInvoices">
        {(hasReadInvoicePermission: boolean) => (
          <>
            {hasReadInvoicePermission && props.invoice && (
              <div className={classes.section}>
                <Typography
                  className={classes.sectionTitle}
                  component="h2"
                  variant="h5"
                >
                  {t('consumerPass.detail.invoice')}
                </Typography>
                <Paper>
                  <InvoiceListItem
                    invoice={props.invoice}
                    onClick={() => props.onInvoiceClick(props.invoice.uuid)}
                  />
                </Paper>
              </div>
            )}
            {!!props.extensionsLoading && <LinearProgress />}
            {props.extensions && props.extensions.length ? (
              <div className={classes.section}>
                <Typography
                  className={classes.sectionTitle}
                  component="h2"
                  variant="h5"
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
                        divider
                        extension={ex}
                        onDelete={
                          props.private_consumer_pass &&
                          !props.private_consumer_pass.dst_private_consumer_pass
                            .length
                            ? () => props.deleteExtension(ex.id)
                            : null
                        }
                      />
                    ))}
                  </List>
                </Paper>
              </div>
            ) : null}
          </>
        )}
      </ObjectLevelPermissionProvider>
      {props.onCreateExtension &&
        !!props.private_consumer_pass &&
        !props.private_consumer_pass?.private_pass?.template_instance && (
          <div className={classes.addButtonContainer}>
            <Button
              color="primary"
              onClick={props.onCreateExtension}
              variant="outlined"
            >
              {t('consumerPass.actions.addExtension')}
            </Button>
          </div>
        )}
      <div className={classes.section}>
        <Typography
          className={classes.sectionTitle}
          component="h2"
          variant="h5"
        >
          {t('consumerPass.detail.booking')}
        </Typography>
        <Paper>
          <PaginatedListStateful
            itemPerPage={5}
            items={props.private_booking_list}
            listProps={{ disablePadding: true }}
            loading={props.privateBookingsLoading}
            renderItem={(b: PrivateBooking) => (
              <PrivateBookingListItem
                key={b.id}
                onClick={() => props.goToPrivateBooking(b.id)}
                onDelete={() => setPrivateBookingToDelete(b)}
                private_booking={b}
              />
            )}
          />
        </Paper>
        {!!props.forceRegularizeUnpaid && (
          <Button
            className={classes.paddingTop}
            color="primary"
            disabled={regularizeProcessing}
            onClick={() => {
              setRegularizeProcessing(true);
              props.forceRegularizeUnpaid({
                onSuccess: () => setRegularizeProcessing(false),
                onError: () => setRegularizeProcessing(false),
              });
            }}
            variant="contained"
          >
            {regularizeProcessing && (
              <CircularProgress color="inherit" size={16} />
            )}
            {t('privatePass.actions.forceRegularizeUnpaid')}
          </Button>
        )}
        {!!privateBookingToDelete && (
          <PrivateBookingDisableDialog
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
            open={!!privateBookingToDelete}
            private_booking={privateBookingToDelete}
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

export default React.memo(PrivateConsumerPassDetail);
