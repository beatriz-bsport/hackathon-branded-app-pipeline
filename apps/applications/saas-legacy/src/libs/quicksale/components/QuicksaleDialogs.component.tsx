import React from 'react';
import chroma from 'chroma-js';
import { makeStyles } from '@material-ui/core';

import DialogWithBigIcon from '#src/components/DialogWithBigIcon';
import WarningIconRounded from '#src/components/icons/WarningIconRounded.component';
import ValidationIcon from '#src/components/icons/ValidationIcon.component';
import SadSmileyIcon from '#src/components/icons/SadSmileyIcon.component';
import EmailIcon from '#src/components/icons/EmailIcon.component';

import type { TranslationProps } from '#src/components/DialogWithBigIcon/DialogWithBigIcon.component';
import { QuicksaleInterfaceModalColors } from '../constants';

type Props = {
  // Modal to warn the staff that there are still open baskets
  showStillOpenBasketsModal?: boolean;
  closeStillOpenBasketsModal?: () => void;

  // Modal of confirmation when deleting a basket
  showDeleteWarningModal?: boolean;
  closeDeleteWarningModal?: () => void;
  dropBasket?: () => void;

  // Modal to indicate a basket can't be changed if it's been
  // partially paid
  blockActions?: boolean;
  goToPaymentPage?: () => void;

  // Modal to warn the staff that some items have been removed
  // when authenticating a member
  showWarningRemovedItemsModal?: boolean;
  closeWarningRemovedItemsModal?: () => void;

  // Modal to warn the staff user that the item is out of stock
  showOutOfStockModal?: boolean;
  closeOutOfStockModal?: () => void;
  addItemAnyway?: () => void;

  // Modal to warn the staff that the item can't be added to the
  // basket because the member is either not a new member or
  // doesn't have required tags
  showAuthenticatedMemberRestrictionModal?: boolean;
  closeAuthenticatedMemberRestrictionModal?: () => void;
  showUnauthenticatedMemberRestrictionModal?: boolean;
  closeUnauthenticatedMemberRestrictionModal?: () => void;
  memberRestrictionSubTexts?: TranslationProps[][];
  openAuthenticationModal?: () => void;

  // Modal to confirm the addition of an item to the basket
  showAddItemConfirmationModal?: boolean;
  closeAddItemConfirmationModal?: () => void;

  // Modal to confirm the payment has been accepted
  showPaymentSuccessModal?: boolean;
  closePaymentSuccessModal?: () => void;
  qrCodeValue?: string;

  // Modal to confirm the invoice has been sent by email
  showInvoiceSentModal?: boolean;
  closeInvoiceSentModal?: () => void;

  // Modal to confirm the payment has been set for later
  showPaymentSetForLaterModal?: boolean;
  closePaymentSetForLaterModal?: () => void;

  // Modal to confirm the partial payment has been accepted
  // and the rest of the payment has been set for later
  showPartialPaymentSuccesModal?: boolean;
  closePartialPaymentSuccesModal?: () => void;
};

// The quicksale interface contains a lot of dialogs that depend on
// the same component (DialogWithBigIcon) but with different props.
// They are all gathered here.
const QuicksaleDialogs: React.FC<Props> = ({
  showStillOpenBasketsModal,
  closeStillOpenBasketsModal,
  showDeleteWarningModal,
  closeDeleteWarningModal,
  dropBasket,
  blockActions,
  goToPaymentPage,
  showWarningRemovedItemsModal,
  closeWarningRemovedItemsModal,
  showOutOfStockModal,
  closeOutOfStockModal,
  addItemAnyway,
  showAuthenticatedMemberRestrictionModal,
  closeAuthenticatedMemberRestrictionModal,
  showUnauthenticatedMemberRestrictionModal,
  closeUnauthenticatedMemberRestrictionModal,
  memberRestrictionSubTexts,
  openAuthenticationModal,
  showAddItemConfirmationModal,
  closeAddItemConfirmationModal,
  showPaymentSuccessModal,
  closePaymentSuccessModal,
  qrCodeValue,
  showInvoiceSentModal,
  closeInvoiceSentModal,
  showPaymentSetForLaterModal,
  closePaymentSetForLaterModal,
  showPartialPaymentSuccesModal,
  closePartialPaymentSuccesModal,
}) => {
  const classes = useStyles();

  return (
    <>
      {showStillOpenBasketsModal !== undefined && (
        <DialogWithBigIcon
          withCross
          CustomIcon={WarningIconRounded}
          iconColor={QuicksaleInterfaceModalColors.Warning}
          namespaces="quicksale"
          onClose={closeStillOpenBasketsModal}
          open={showStillOpenBasketsModal}
          subTexts={[['quicksale:interface.ongoingBaskets.subText']]}
          title="quicksale:interface.ongoingBaskets.title"
        />
      )}

      {showDeleteWarningModal !== undefined && (
        <DialogWithBigIcon
          withCross
          buttons={[
            {
              title: 'quicksale:interface.deleteCurrentBasket.cancel',
              onClick: closeDeleteWarningModal,
              variant: 'text',
              fontColor: '#757575',
            },
            {
              title: 'quicksale:interface.deleteCurrentBasket.delete',
              onClick: dropBasket,
              variant: 'contained',
              fontColor: 'white',
              backgroundColor: QuicksaleInterfaceModalColors.Error,
            },
          ]}
          icon="Delete"
          iconColor={QuicksaleInterfaceModalColors.Error}
          namespaces="quicksale"
          onClose={closeDeleteWarningModal}
          open={showDeleteWarningModal}
          subTexts={[['quicksale:interface.deleteCurrentBasket.subText']]}
          title="quicksale:interface.deleteCurrentBasket.title"
        />
      )}

      {blockActions !== undefined && (
        <DialogWithBigIcon
          buttons={[
            {
              title: 'quicksale:interface.cannotEdit.payment',
              onClick: goToPaymentPage,
              variant: 'contained',
              fontColor: 'white',
            },
          ]}
          customClasses={{
            root: classes.partiallyPaidDialogRoot,
            backdrop: classes.partiallyPaidDialogBackdrop,
          }}
          CustomIcon={WarningIconRounded}
          iconColor={QuicksaleInterfaceModalColors.Warning}
          namespaces="quicksale"
          open={blockActions}
          subTexts={[['quicksale:interface.cannotEdit.subText']]}
          title="quicksale:interface.cannotEdit.title"
        />
      )}

      {showWarningRemovedItemsModal !== undefined && (
        <DialogWithBigIcon
          withCross
          CustomIcon={WarningIconRounded}
          iconColor={QuicksaleInterfaceModalColors.Warning}
          namespaces="quicksale"
          onClose={closeWarningRemovedItemsModal}
          open={showWarningRemovedItemsModal}
          subTexts={[['quicksale:interface.itemsRemovedFromBasket.subText']]}
          title="quicksale:interface.itemsRemovedFromBasket.title"
        />
      )}

      {showOutOfStockModal !== undefined && (
        <DialogWithBigIcon
          withCross
          buttons={[
            {
              title: 'quicksale:interface.outOfStock.addAnyway',
              onClick: addItemAnyway,
              variant: 'contained',
              backgroundColor: QuicksaleInterfaceModalColors.Warning,
              fontColor: 'white',
            },
          ]}
          icon="StoreMallDirectory"
          iconColor={QuicksaleInterfaceModalColors.Warning}
          namespaces="quicksale"
          onClose={closeOutOfStockModal}
          open={showOutOfStockModal}
          subTexts={[['quicksale:interface.outOfStock.subText']]}
          title="quicksale:interface.outOfStock.title"
        />
      )}

      {showAuthenticatedMemberRestrictionModal !== undefined && (
        <DialogWithBigIcon
          withCross
          CustomIcon={SadSmileyIcon}
          iconColor={QuicksaleInterfaceModalColors.Info}
          namespaces="quicksale"
          onClose={closeAuthenticatedMemberRestrictionModal}
          open={showAuthenticatedMemberRestrictionModal}
          subTexts={memberRestrictionSubTexts}
          title="quicksale:interface.cannotAdd.title"
        />
      )}

      {showUnauthenticatedMemberRestrictionModal !== undefined && (
        <DialogWithBigIcon
          withCross
          buttons={[
            {
              title:
                'quicksale:interface.authenticationRequired.identifyMember',
              variant: 'contained',
              onClick: openAuthenticationModal,
            },
          ]}
          icon="Person"
          namespaces="quicksale"
          onClose={closeUnauthenticatedMemberRestrictionModal}
          open={showUnauthenticatedMemberRestrictionModal}
          subTexts={memberRestrictionSubTexts}
          title="quicksale:interface.authenticationRequired.title"
        />
      )}

      {showAddItemConfirmationModal !== undefined && (
        <DialogWithBigIcon
          withCross
          icon="AddShoppingCart"
          namespaces="quicksale"
          onClose={closeAddItemConfirmationModal}
          open={showAddItemConfirmationModal}
          subTexts={[['quicksale:interface.objectAdded.subText']]}
          title="quicksale:interface.objectAdded.title"
        />
      )}

      {showPaymentSuccessModal !== undefined && (
        <DialogWithBigIcon
          withCross
          withoutBackground
          CustomIcon={ValidationIcon}
          customIconFillOpacity={0.08}
          iconColor={QuicksaleInterfaceModalColors.Success}
          namespaces="quicksale"
          onClose={closePaymentSuccessModal}
          open={showPaymentSuccessModal}
          QrCodeProps={{
            value: qrCodeValue || '',
            title: 'quicksale:checkout.paymentSuccess.qrCodeTitle',
          }}
          subTexts={[['quicksale:checkout.paymentSuccess.description']]}
          title="quicksale:checkout.paymentSuccess.title"
        />
      )}

      {showInvoiceSentModal !== undefined && (
        <DialogWithBigIcon
          withCross
          CustomIcon={EmailIcon}
          namespaces="quicksale"
          onClose={closeInvoiceSentModal}
          open={showInvoiceSentModal}
          subTexts={[['quicksale:checkout.emailSent.subText']]}
          title="quicksale:checkout.emailSent.title"
        />
      )}

      {showPaymentSetForLaterModal !== undefined && (
        <DialogWithBigIcon
          withCross
          withoutBackground
          CustomIcon={ValidationIcon}
          customIconFillOpacity={0.08}
          iconColor={QuicksaleInterfaceModalColors.Success}
          namespaces="quicksale"
          onClose={closePaymentSetForLaterModal}
          open={showPaymentSetForLaterModal}
          subTexts={[['quicksale:checkout.payLater.subText']]}
          title="quicksale:checkout.payLater.title"
        />
      )}

      {showPartialPaymentSuccesModal !== undefined && (
        <DialogWithBigIcon
          withCross
          withoutBackground
          CustomIcon={ValidationIcon}
          customIconFillOpacity={0.08}
          iconColor={QuicksaleInterfaceModalColors.Success}
          namespaces="quicksale"
          onClose={closePartialPaymentSuccesModal}
          open={showPartialPaymentSuccesModal}
          subTexts={[
            ['quicksale:checkout.paymentSuccess.subTextPartialPayment'],
          ]}
          title="quicksale:checkout.paymentSuccess.title"
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  partiallyPaidDialogRoot: {
    inset: '130px calc(25% - 8px) 0 0 !important',
  },
  partiallyPaidDialogBackdrop: {
    top: '130px',
    right: 'calc(25% - 8px)',
    backgroundColor: chroma(theme.palette.grey[50]).alpha(0.5).hex(),
  },
}));

export default React.memo(QuicksaleDialogs);
