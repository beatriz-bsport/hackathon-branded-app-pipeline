import React from 'react';
import chroma from 'chroma-js';
import { makeStyles } from '@material-ui/core';

import DialogWithBigIcon from '#components/DialogWithBigIcon';
import WarningIconRounded from '#components/icons/WarningIconRounded.component';

import { QuicksaleInterfaceModalColors } from '../constants';
import SadSmileyIcon from '#components/icons/SadSmileyIcon.component';
import { TranslationProps } from '#components/DialogWithBigIcon/DialogWithBigIcon.component';

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
}) => {
  const classes = useStyles();

  return (
    <>
      {showStillOpenBasketsModal !== undefined && (
        <DialogWithBigIcon
          open={showStillOpenBasketsModal}
          onClose={closeStillOpenBasketsModal}
          withCross
          CustomIcon={WarningIconRounded}
          iconColor={QuicksaleInterfaceModalColors.Warning}
          title="quicksale:interface.ongoingBaskets.title"
          subTexts={[['quicksale:interface.ongoingBaskets.subText']]}
        />
      )}

      {showDeleteWarningModal !== undefined && (
        <DialogWithBigIcon
          open={showDeleteWarningModal}
          onClose={closeDeleteWarningModal}
          withCross
          icon="Delete"
          iconColor={QuicksaleInterfaceModalColors.Error}
          title="quicksale:interface.deleteCurrentBasket.title"
          subTexts={[['quicksale:interface.deleteCurrentBasket.subText']]}
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
        />
      )}

      {blockActions !== undefined && (
        <DialogWithBigIcon
          open={blockActions}
          CustomIcon={WarningIconRounded}
          iconColor={QuicksaleInterfaceModalColors.Warning}
          title="quicksale:interface.cannotEdit.title"
          subTexts={[['quicksale:interface.cannotEdit.subText']]}
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
        />
      )}

      {showWarningRemovedItemsModal !== undefined && (
        <DialogWithBigIcon
          open={showWarningRemovedItemsModal}
          onClose={closeWarningRemovedItemsModal}
          withCross
          CustomIcon={WarningIconRounded}
          iconColor={QuicksaleInterfaceModalColors.Warning}
          title="quicksale:interface.itemsRemovedFromBasket.title"
          subTexts={[['quicksale:interface.itemsRemovedFromBasket.subText']]}
        />
      )}

      {showOutOfStockModal !== undefined && (
        <DialogWithBigIcon
          open={showOutOfStockModal}
          onClose={closeOutOfStockModal}
          withCross
          icon="StoreMallDirectory"
          iconColor={QuicksaleInterfaceModalColors.Warning}
          title="quicksale:interface.outOfStock.title"
          subTexts={[['quicksale:interface.outOfStock.subText']]}
          buttons={[
            {
              title: 'quicksale:interface.outOfStock.addAnyway',
              onClick: addItemAnyway,
              variant: 'contained',
              backgroundColor: QuicksaleInterfaceModalColors.Warning,
              fontColor: 'white',
            },
          ]}
        />
      )}

      {showAuthenticatedMemberRestrictionModal !== undefined && (
        <DialogWithBigIcon
          open={showAuthenticatedMemberRestrictionModal}
          onClose={closeAuthenticatedMemberRestrictionModal}
          withCross
          CustomIcon={SadSmileyIcon}
          iconColor={QuicksaleInterfaceModalColors.Info}
          title="quicksale:interface.cannotAdd.title"
          subTexts={memberRestrictionSubTexts}
        />
      )}

      {showUnauthenticatedMemberRestrictionModal !== undefined && (
        <DialogWithBigIcon
          open={showUnauthenticatedMemberRestrictionModal}
          onClose={closeUnauthenticatedMemberRestrictionModal}
          withCross
          icon="Person"
          title="quicksale:interface.authenticationRequired.title"
          subTexts={memberRestrictionSubTexts}
          buttons={[
            {
              title:
                'quicksale:interface.authenticationRequired.identifyMember',
              variant: 'contained',
              onClick: openAuthenticationModal,
            },
          ]}
        />
      )}

      {showAddItemConfirmationModal !== undefined && (
        <DialogWithBigIcon
          open={showAddItemConfirmationModal}
          onClose={closeAddItemConfirmationModal}
          withCross
          icon="AddShoppingCart"
          title="quicksale:interface.objectAdded.title"
          subTexts={[['quicksale:interface.objectAdded.subText']]}
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
