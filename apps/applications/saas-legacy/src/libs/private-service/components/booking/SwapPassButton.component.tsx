import React, { useCallback, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch } from 'react-redux';

import SwapPassDialog, {
  type SwapPassItem,
} from '#src/libs/booking/components/SwapPassDialog.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import { analyticsClientB2B } from '#src/components/analytics/mixpanel';
import {
  trackSwapPassDialogOpenedEvent,
  trackSwapPassConfirmedEvent,
} from '#src/events/booking/trackers';
import { SESSION_TYPES } from '#src/events/constants';
import {
  fetchCompatiblePrivateConsumerPass,
  swapPrivateBookingPass,
} from '../../api';
import type { PrivateConsumerPass } from '../../types';
import { snackbarError as snackbarErrorAction } from '#src/libs/snackbar/actions';
import { isErrorWithCustomCode } from '#src/libs/utils';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';

const SWAP_PASS_ERROR_CODES = [
  5347100, 5347101, 5347102, 5347103, 5347104, 5347105, 5347106, 5347107,
];

type Props = {
  privateBookingId: number;
  privateSlotId: number;
  memberId: number;
  currentPrivateConsumerPassId?: number;
  onSwapSuccess?: (newPrivateConsumerPassId: number) => void;
};

const buildSwapPassItemsFromPrivatePasses = (
  responseData: unknown,
  currentPrivateConsumerPassId: number | undefined,
  t: ReturnType<typeof useTranslation>['t'],
): SwapPassItem[] => {
  const maybePaginated = responseData as
    | { results?: unknown }
    | null
    | undefined;
  const privateConsumerPasses: PrivateConsumerPass[] = Array.isArray(
    maybePaginated?.results,
  )
    ? (maybePaginated!.results as PrivateConsumerPass[])
    : Array.isArray(responseData)
    ? (responseData as PrivateConsumerPass[])
    : [];

  return privateConsumerPasses
    .filter(
      (pcp: PrivateConsumerPass) =>
        !pcp.reverted && pcp.id !== currentPrivateConsumerPassId,
    )
    .map((pcp: PrivateConsumerPass) => ({
      id: pcp.id,
      name: pcp.private_pass.name,
      details: `${getCreditsDividedDisplay(
        pcp.private_pass.credits - pcp.used_credits,
      )}/${getCreditsDividedDisplay(pcp.private_pass.credits)} ${t(
        'paymentPack:credits',
        { count: pcp.private_pass.credits - pcp.used_credits },
      )}`,
    }));
};

export const SwapPassButton: React.FC<Props> = ({
  privateBookingId,
  privateSlotId,
  memberId,
  currentPrivateConsumerPassId,
  onSwapSuccess,
}) => {
  const showSwapPass = useSafeFlag(FeatureFlags.BOOKING_DISPLAY_SWAP_PASS);
  const { t } = useTranslation(['b2b_booking', 'paymentPack']);
  const dispatch = useDispatch();

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
  }, []);

  const open = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsOpen(true);
      setItems([]);
      setSelectedItemId(null);
      setIsLoading(true);

      analyticsClientB2B.trackEvent(
        trackSwapPassDialogOpenedEvent({
          session_type: SESSION_TYPES.appointment,
          booking_id: privateBookingId,
          member_id: memberId,
        }),
      );

      fetchCompatiblePrivateConsumerPass(privateSlotId, { member: memberId })
        .then((response) => {
          const passes = buildSwapPassItemsFromPrivatePasses(
            response.data,
            currentPrivateConsumerPassId,
            t,
          );
          setItems(passes);
        })
        .catch(() => {
          dispatch(
            snackbarErrorAction(
              'b2b_booking:swapPass.dialog.errors.loadCompatiblePasses',
            ),
          );
          close();
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [
      close,
      currentPrivateConsumerPassId,
      dispatch,
      memberId,
      privateBookingId,
      privateSlotId,
    ],
  );

  const handleSubmit = useCallback(() => {
    if (isSubmitting || !selectedItemId) return;

    setIsSubmitting(true);

    swapPrivateBookingPass(privateBookingId, selectedItemId)
      .then(() => {
        analyticsClientB2B.trackEvent(
          trackSwapPassConfirmedEvent({
            session_type: SESSION_TYPES.appointment,
            booking_id: privateBookingId,
            member_id: memberId,
            new_pass_id: selectedItemId,
          }),
        );
        onSwapSuccess?.(selectedItemId);
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
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [
    close,
    dispatch,
    isSubmitting,
    onSwapSuccess,
    privateBookingId,
    selectedItemId,
  ]);

  if (!showSwapPass) return null;

  return (
    <ObjectLevelPermissionWrapper
      forcedBehavior="hidden"
      requiredPermission="reservation.privateBooking.allowed_actions.edit"
    >
      <>
        <Tooltip title={t('swapPass.menuAction', { ns: 'b2b_booking' })}>
          <IconButton onClick={open}>
            <SwapHorizIcon />
          </IconButton>
        </Tooltip>
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
    </ObjectLevelPermissionWrapper>
  );
};
