import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';

import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { ConsumerGiftcardFormWithPreview } from '#src/libs/giftcard/components/ConsumerGiftcardFormWithPreview';

import type { QuicksaleCardInfo } from '#src/libs/quicksale/types';
import type { Basket, CheckoutItemData } from '#src/libs/checkout/types';
import type {
  ConsumerGiftcardAPI,
  Giftcard,
  GiftcardBackgroundImage,
} from '#src/libs/giftcard/types';

import { getIdsFromQuicksaleCardInfoId } from '#src/libs/quicksale/utils';
import useStyles from './hooks/styles';
import type { OptionCallback } from '../../../state/types';

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
      data: ConsumerGiftcardAPI & { force: boolean },
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
      onClose={closeGiftcardFormModal}
      open={showGiftcardFormModal}
    >
      <DialogTitle disableTypography className={classes.giftcardDialogTitle}>
        <IconButton
          className={classes.giftcardDialogCloseButton}
          onClick={closeGiftcardFormModal}
        >
          <Close className={classes.giftcardDialogCloseIcon} />
        </IconButton>
      </DialogTitle>

      <ConsumerGiftcardFormWithPreview
        companyCover={cover}
        giftcard={giftcard}
        giftcardBackgroundImageList={giftcardBackgroundImageList}
        onSubmit={addGiftcardToBasket}
      />
    </GenericResponsiveDialog>
  );
};

export default React.memo(GiftcardForm);
