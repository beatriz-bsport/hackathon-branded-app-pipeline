import React from 'react';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-expect-error
import PaginatedListStateful from '#src/components/PaginatedListStateful.component';
import ExtensionListItem from '#src/components/ExtensionListItem';
import InvoiceListItem from '#src/libs/invoice/InvoiceListItem.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import {
  PrivateBooking,
  PrivateConsumerPass,
  PrivateConsumerPassExtension,
} from '#src/libs/private-service/types';
import { Invoice } from '#src/libs/invoice/types';

import { PRIVATE_CONSUMER_PASS_EXTENSION_PAGE_SIZE } from '#src/libs/private-service/constants';
import { OptionCallback } from '../../../../state/types';
import PrivateBookingDisableDialog from '../booking/PrivateBookingDisableDialog.component';
import PrivateBookingListItem from '../booking/PrivateBookingListItem.component';

type Props = {
  private_booking_list: Array<PrivateBooking>;
  privateBookingsLoading: boolean;
  fetchPrivateConsumerPass: (id: number) => void;
  goToPrivateBooking: (privateBookingId: number) => void;
  private_consumer_pass?: PrivateConsumerPass;
  onCreateExtension: () => void;
  extensions: Array<PrivateConsumerPassExtension>;
  extensionsPage: number;
  extensionsCount: number;
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
  onExtensionPageRequested: (page: number) => void;
};

export const PrivateConsumerPassDetail: React.FC<Props> = (props) => {
  const [regularizeProcessing, setRegularizeProcessing] = React.useState(false);
  const [privateBookingToDelete, setPrivateBookingToDelete] =
    React.useState<PrivateBooking | null>(null);
  const { t } = useTranslation('privateService');
  const classes = useStyles();

  // Check if the private consumer pass has been reverted
  const isPassReverted = !!props.private_consumer_pass?.reverted;

  // Check if the pass is associated with an unpaid private booking integration
  const isUnpaidPrivateBookingIntegration =
    !!props.private_consumer_pass?.private_pass
      ?.is_unpaid_private_booking_integration;

  // Check if the pass is shared from a relationship pass
  const isPassSharedFromRelation =
    !!props.private_consumer_pass?.dst_private_consumer_pass?.length;

  // Check if the private consumer pass is a universal pass
  const isUniversalPass =
    !!props.private_consumer_pass?.linked_consumer_payment_pack;

  // Determine if the creation of a validity extension is forbidden
  // It is forbidden if one of these conditions is true:
  // - The pass is a universal pass
  // - The pass is shared from a relationship pass
  // - The pass has been reverted
  // - The pass is associated with an unpaid private booking integration
  const isValidityExtensionCreationForbidden =
    isUniversalPass ||
    isPassSharedFromRelation ||
    isPassReverted ||
    isUnpaidPrivateBookingIntegration;

  // Determine if the deletion of a validity extension is forbidden
  // It is forbidden if one of these conditions is true:
  // - The pass is a universal pass
  // - The pass is shared from a relationship pass
  const isValidityExtensionsDeletionForbidden =
    isUniversalPass || isPassSharedFromRelation;

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
          </>
        )}
      </ObjectLevelPermissionProvider>

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
      <div className={classes.section}>
        {!!props.extensions && props.extensionsCount > 0 ? (
          <>
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
              <PaginatedListBase
                itemPerPage={PRIVATE_CONSUMER_PASS_EXTENSION_PAGE_SIZE}
                items={props.extensions}
                listProps={{ disablePadding: 'true' }}
                loading={props.extensionsLoading}
                nbItems={props.extensionsCount}
                onPageRequested={props.onExtensionPageRequested}
                page={props.extensionsPage}
                renderItem={(
                  extension: PrivateConsumerPassExtension,
                  index: number,
                ) => (
                  <ExtensionListItem
                    key={extension.id}
                    extension={extension}
                    onDelete={
                      !isValidityExtensionsDeletionForbidden
                        ? () => props.deleteExtension(extension.id)
                        : null
                    }
                    showBottomDivider={index !== props.extensions.length - 1}
                  />
                )}
              />
            </Paper>
          </>
        ) : null}
        {!isValidityExtensionCreationForbidden && (
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
