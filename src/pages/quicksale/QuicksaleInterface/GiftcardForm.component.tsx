import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';

import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { Giftcard, GiftcardBackgroundImage } from '#libs/giftcard/types';
import ConsumerGiftcardFormWithPreviewComponent from '#libs/giftcard/components/ConsumerGiftcardFormWithPreview.component';

import type { FormValues as ConsumerGiftcardDetails } from '#libs/giftcard/components/ConsumerGiftcardForm.component';
import type { OptionCallback } from '../../../state/types';
import type { QuicksaleCardInfo } from '#libs/quicksale/types';
import type { Basket, CheckoutItemData } from '#libs/checkout/types';

import useStyles from './hooks/styles';
import { getIdsFromQuicksaleCardInfoId } from '#libs/quicksale/utils';

type Props = {
  company: number;
  giftcard: Giftcard | null;
  cover?: string;
  giftcardBackgroundImageList?: GiftcardBackgroundImage[];
  pendingItemToAdd: QuicksaleCardInfo | null;
  currentBasket?: Basket;
  setCurrentBasket: (basket: Basket) => void;
  addItemToBasket: (
    basketId: string,
    checkoutItem: CheckoutItemData,
    options?: OptionCallback<Basket>,
  ) => void;
  showGiftcardFormModal: boolean;
  closeGiftcardFormModal: () => void;
  fetchGiftcardBackgroundImageList: (
    companyId: number,
    options?: OptionCallback<GiftcardBackgroundImage>,
  ) => void;
};

const GiftcardForm: React.FC<Props> = ({
  company,
  giftcard,
  cover,
  giftcardBackgroundImageList,
  pendingItemToAdd,
  currentBasket,
  addItemToBasket,
  showGiftcardFormModal,
  closeGiftcardFormModal,
  setCurrentBasket,
  fetchGiftcardBackgroundImageList,
}) => {
  const addGiftcardToBasket = React.useCallback(
    (
      data: ConsumerGiftcardDetails & { force: boolean },
      options?: OptionCallback,
    ) => {
      const [buyable_item_identifier, buyable_item_id] =
        getIdsFromQuicksaleCardInfoId(pendingItemToAdd);
      if (
        currentBasket &&
        pendingItemToAdd &&
        Number(buyable_item_identifier) ===
          QuicksaleBasketItem.GiftcardIdentifier
      )
        addItemToBasket(
          currentBasket.id,
          {
            buyable_item_identifier: QuicksaleBasketItem.GiftcardIdentifier,
            quantity: 1,
            buyable_item_id: Number(buyable_item_id),
            extra_data: { customization_dict: data },
          },
          {
            ...options,
            onSuccess: (basket) => {
              closeGiftcardFormModal();
              setCurrentBasket(basket);
              options?.onSuccess?.();
            },
          },
        );
    },
    [
      addItemToBasket,
      closeGiftcardFormModal,
      currentBasket,
      pendingItemToAdd,
      setCurrentBasket,
    ],
  );

  React.useEffect(() => {
    fetchGiftcardBackgroundImageList(company);
  }, [company, fetchGiftcardBackgroundImageList]);

  const classes = useStyles();
  return (
    <GenericResponsiveDialog
      open={showGiftcardFormModal}
      onClose={closeGiftcardFormModal}
    >
      <DialogTitle disableTypography className={classes.giftcardDialogTitle}>
        <IconButton
          onClick={closeGiftcardFormModal}
          className={classes.giftcardDialogCloseButton}
        >
          <Close className={classes.giftcardDialogCloseIcon} />
        </IconButton>
      </DialogTitle>

      <ConsumerGiftcardFormWithPreviewComponent
        // @ts-expect-error because ConsumerGiftcardFormFieldHOC is wrongly typed
        giftcard={giftcard}
        companyCover={cover}
        giftcardBackgroundImageList={giftcardBackgroundImageList}
        onSubmit={addGiftcardToBasket}
        isManager
      />
    </GenericResponsiveDialog>
  );
};

export default React.memo(GiftcardForm);
