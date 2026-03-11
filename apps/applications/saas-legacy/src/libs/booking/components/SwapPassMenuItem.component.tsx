import React, { useCallback, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch, useSelector } from 'react-redux';

import { fetchByOfferByMemberV2 } from '#src/libs/consumer-payment-pack/api';
import { swapBookingPass as swapBookingPassAPI } from '#src/libs/booking/api';
import { updateActions } from '#src/libs/booking/actions';
import { snackbarError as snackbarErrorAction } from '#src/libs/snackbar/actions';
import { getPaymentPackById } from '#src/libs/payment-packs/selectors';
import { isErrorWithCustomCode } from '#src/libs/utils';
import { formatAsDate } from '#src/utils/datetime';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';
import {
  filterCompatibleConsumerPaymentPacksForPassSwap,
  getBookingConsumerPaymentPackId,
  getCompatibleConsumerPaymentPackName,
  getConsumerPaymentPackPaymentPackId,
  type CompatibleConsumerPaymentPack,
} from '#src/libs/booking/services/swapPass.service';
import SwapPassDialog, { type SwapPassItem } from './SwapPassDialog.component';
import type { Booking } from '#src/libs/booking/types';

const SWAP_PASS_ERROR_CODES = [
  5347000, 5347001, 5347002, 5347003, 5347004, 5347005, 5347006,
];

type Props = {
  booking: Booking;
  classes: { menuItem: string; icon: string };
  onClose: () => void;
};

const buildSwapPassItems = (
  compatiblePacks: CompatibleConsumerPaymentPack[],
  currentConsumerPaymentPackId: number | null,
  paymentPacksById: ReturnType<typeof getPaymentPackById>,
  t: ReturnType<typeof useTranslation>['t'],
): SwapPassItem[] => {
  const filtered = filterCompatibleConsumerPaymentPacksForPassSwap(
    compatiblePacks,
    currentConsumerPaymentPackId,
  );

  return filtered.map((cpp, index) => {
    const paymentPackId = getConsumerPaymentPackPaymentPackId(cpp);
    const paymentPack =
      paymentPackId !== null ? paymentPacksById?.[paymentPackId] : null;

    const creditsText = paymentPack?.unlimited
      ? t('unlimited', { ns: 'booking' })
      : `${getCreditsDividedDisplay(cpp.available_credits)} ${t('credits', {
          ns: 'paymentPack',
          count: cpp.available_credits,
        })}`;

    const dateRange =
      cpp.starting_date && cpp.ending_date
        ? `${formatAsDate(cpp.starting_date)}→${formatAsDate(cpp.ending_date)}`
        : null;

    return {
      id: cpp.id,
      name: getCompatibleConsumerPaymentPackName(cpp, index, paymentPacksById),
      details: [creditsText, dateRange].filter(Boolean).join(' • '),
    };
  });
};

const SwapPassMenuItem: React.FC<Props> = ({ booking, classes, onClose }) => {
  const { t } = useTranslation(['b2b_booking', 'booking', 'paymentPack']);
  const dispatch = useDispatch();
  const paymentPacksById = useSelector(getPaymentPackById);

  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SwapPassItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
    setItems([]);
    setSelectedItemId(null);
    setIsLoading(false);
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  const open = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      const currentConsumerPaymentPackId =
        getBookingConsumerPaymentPackId(booking);

      setIsOpen(true);
      setItems([]);
      setSelectedItemId(null);
      setIsLoading(true);
      setIsSubmitting(false);

      fetchByOfferByMemberV2(booking.offer, { member: booking.member })
        .then((response) => {
          const compatiblePacks: CompatibleConsumerPaymentPack[] =
            (response.data as CompatibleConsumerPaymentPack[]) || [];
          const swapPassItems = buildSwapPassItems(
            compatiblePacks,
            currentConsumerPaymentPackId,
            paymentPacksById,
            t,
          );

          setItems(swapPassItems);
          setIsLoading(false);
        })
        .catch(() => {
          dispatch(
            snackbarErrorAction(
              'b2b_booking:swapPass.dialog.errors.loadCompatiblePasses',
            ),
          );
          close();
        });
    },
    [booking, close, dispatch, paymentPacksById],
  );

  const handleSubmit = useCallback(() => {
    if (isSubmitting || !selectedItemId) return;

    setIsSubmitting(true);

    swapBookingPassAPI(booking.id, {
      consumer_payment_pack_id: selectedItemId,
    })
      .then((response) => {
        dispatch(updateActions.success(response.data));
        close();
      })
      .catch((error) => {
        const errorCode = error?.response?.data?.error_code;
        const hasKnownErrorCode =
          isErrorWithCustomCode(error) &&
          SWAP_PASS_ERROR_CODES.includes(errorCode);
        const errorTranslationKey = hasKnownErrorCode
          ? `swapPass.dialog.errors.${errorCode}`
          : 'swapPass.dialog.errors.swapFailed';

        dispatch(snackbarErrorAction(`b2b_booking:${errorTranslationKey}`));
        close();
      });
  }, [booking.id, close, dispatch, isSubmitting, selectedItemId]);

  return (
    <>
      <MenuItem className={classes.menuItem} onClick={open}>
        <SwapHorizIcon className={classes.icon} />
        <Typography>
          {t('swapPass.menuAction', { ns: 'b2b_booking' })}
        </Typography>
      </MenuItem>
      <SwapPassDialog
        isLoading={isLoading}
        isOpen={isOpen}
        isSubmitting={isSubmitting}
        items={items}
        onClose={close}
        onSelectItem={setSelectedItemId}
        onSubmit={handleSubmit}
        selectedItemId={selectedItemId}
      />
    </>
  );
};

export default SwapPassMenuItem;
