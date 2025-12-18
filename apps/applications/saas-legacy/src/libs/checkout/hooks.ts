import React from 'react';
import { useTranslation } from 'react-i18next';
import { OfferWithSpotInformation } from '#src/libs/offer/types';
import { CheckoutItem, ConfirmationStatus } from './types';
import ConfirmationMessageIcon from './components/ConfirmationMessageIcon';

type ConfirmationAction = {
  label: string;
  onClick: () => void;
};

type ConfirmationAlert = {
  message: string;
  action: ConfirmationAction;
};

type ValidationsActions = {
  cancel?: ConfirmationAction;
  confirm?: ConfirmationAction;
};

type ConfirmationMessage = {
  actions: ValidationsActions;
  icon: React.ReactElement;
  message: string;
  title: string;
  withAlert?: ConfirmationAlert | null;
  withSubScriptionActions?: ValidationsActions | null;
};

type ConfirmationMessages = {
  [key in ConfirmationStatus]: ConfirmationMessage;
};

export const useConfirmationMessageData = (
  offers: OfferWithSpotInformation[],
  checkoutItems: CheckoutItem[],
  goToCalendar: () => void,
  goBack: () => void,
  goToMemberProfile: () => void,
  goToMemberProfilePage: () => void,
  goToMemberBookings: () => void,
  goToMemberPasses: () => void,
  goToMemberSubscriptions: () => void,
  hasDoorAccess: boolean = false,
) => {
  const { t } = useTranslation('checkout');

  const messageData: ConfirmationMessages = React.useMemo(() => {
    return {
      [ConfirmationStatus.GENERIC_ERROR]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goBack
            ? {
                confirm: {
                  label: t('validation.actions.retry'),
                  onClick: goBack,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: true }),
        message: t('validation.sections.errorExplain.generic'),
        title: t('validation.sections.confirmationStatusTitle.errors.generic'),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.GENERIC_OFFER_ERROR]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberBookings
            ? {
                confirm: {
                  label: t('validation.actions.myBookings'),
                  onClick: goToMemberBookings,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: true }),
        message: t('validation.sections.errorExplain.genericOfferError'),
        title: t(
          'validation.sections.confirmationStatusTitle.errors.genericOfferError',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.OFFER_ONLY_BOOKING_ERROR]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goBack
            ? {
                confirm: {
                  label: t('validation.actions.retryBookingSession'),
                  onClick: goBack,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: true }),
        message: t('validation.sections.errorExplain.offerOnlyBookingError'),
        title: t(
          'validation.sections.confirmationStatusTitle.errors.genericOfferError',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.OFFER_GENERIC_ERROR_WITH_PURCHASE]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberBookings
            ? {
                confirm: {
                  label: t('validation.actions.myBookings'),
                  onClick: goToMemberBookings,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t('validation.sections.errorExplain.genericOfferError'),
        title: t(
          'validation.sections.confirmationStatusTitle.errors.genericOfferError',
        ),
        withAlert: {
          message: t('validation.sections.alert'),
          action: {
            label: t('validation.actions.retryBookingSession'),
            onClick: goToCalendar,
          },
        },
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.OFFER_BOOKING_ERROR_WITH_PURCHASE]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberBookings
            ? {
                confirm: {
                  label: t('validation.actions.myBookings'),
                  onClick: goToMemberBookings,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t('validation.sections.errorExplain.genericOfferError'),
        title: t(
          'validation.sections.confirmationStatusTitle.errors.genericOfferError',
        ),
        withAlert: {
          message: t('validation.sections.errorExplain.offerOnlyBookingError'),
          action: {
            label: t('validation.actions.retryBookingSession'),
            onClick: goToCalendar,
          },
        },
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.OFFER_AND_PURCHASE_SUCCESS]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberBookings
            ? {
                confirm: {
                  label: t('validation.actions.myBookings'),
                  onClick: goToMemberBookings,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.offerAndPurchaseSuccess',
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.offerOnlySuccess',
        ),
        withAlert: null,
        withSubScriptionActions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberSubscriptions
            ? {
                confirm: {
                  label: t('validation.actions.mySubscription'),
                  onClick: goToMemberSubscriptions,
                },
              }
            : {}),
        },
      },
      [ConfirmationStatus.OFFER_ONLY_SUCCESS]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberBookings
            ? {
                confirm: {
                  label: t('validation.actions.myBookings'),
                  onClick: goToMemberBookings,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.offerOnlySuccess',
          { count: offers?.length },
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.offerOnlySuccess',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.OFFER_ONLY_GUEST_SUCCESS]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberBookings
            ? {
                confirm: {
                  label: t('validation.actions.myBookings'),
                  onClick: goToMemberBookings,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.offerOnlyGuestSuccess',
          { count: offers?.length },
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.offerOnlyGuestSuccess',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.WAITING_LIST]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberBookings
            ? {
                confirm: {
                  label: t('validation.actions.myBookings'),
                  onClick: goToMemberBookings,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t('validation.sections.explain'),
        title: t(
          'validation.sections.confirmationStatusTitle.success.waitingList',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.PURCHASE_ONLY_SUCCESS]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberProfile
            ? {
                confirm: {
                  label: t('validation.actions.myBookings'),
                  onClick: goToMemberProfile,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.paymentSuccess',
          {
            count: checkoutItems?.length,
          },
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.paymentSuccess',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.PURCHASE_WITH_PASSES_SUCCESS]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberPasses
            ? {
                confirm: {
                  label: t('validation.actions.myPasses'),
                  onClick: goToMemberPasses,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.paymentSuccess',
          {
            count: checkoutItems?.length,
          },
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.paymentSuccess',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.PURCHASE_WITH_ITEMS_SUCCESS]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberProfile
            ? {
                confirm: {
                  label: t('validation.actions.myProducts'),
                  onClick: goToMemberProfile,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.paymentSuccess',
          {
            count: checkoutItems?.length,
          },
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.paymentSuccess',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.PURCHASE_WITH_GIFTCARDS_SUCCESS]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberProfile
            ? {
                confirm: {
                  label: t('validation.actions.myGiftcards'),
                  onClick: goToMemberProfile,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.paymentSuccess',
          {
            count: checkoutItems?.length,
          },
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.paymentSuccess',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.OFFERS_PARTIALLY_CONFIRMED]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
          ...(goToMemberProfile
            ? {
                confirm: {
                  label: t('validation.actions.myBookings'),
                  onClick: goToMemberProfile,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, {
          isError: false,
          isWarning: true,
        }),
        message: t(
          'validation.sections.confirmationStatusMessage.offersPartiallyConfirmed',
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.warning.offersPartiallyConfirmed',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.OFFER_AND_PURCHASE_ONE_CLICK_SUCCESS]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.offerAndPurchaseSuccess',
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.offerOnlySuccess',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.PURCHASE_ONLY_ONE_CLICK_SUCCESS]: {
        actions: {
          cancel: {
            label: t('validation.actions.goToCalendar'),
            onClick: goToCalendar,
          },
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.paymentSuccess',
          {
            count: checkoutItems?.length,
          },
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.paymentSuccess',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
      [ConfirmationStatus.PURCHASE_WITH_PASSES_ONE_CLICK_SUCCESS]: {
        actions: {
          confirm: {
            label: t('validation.actions.bookAClass'),
            onClick: goToCalendar,
          },
          ...(goToMemberPasses
            ? {
                cancel: {
                  label: t('validation.actions.seeAllPasses'),
                  onClick: goToMemberPasses,
                },
              }
            : {}),
        },
        icon: React.createElement(ConfirmationMessageIcon, { isError: false }),
        message: t(
          'validation.sections.confirmationStatusMessage.expressCheckoutPassPurchaseSuccess',
          {
            count: checkoutItems?.length,
          },
        ),
        title: t(
          'validation.sections.confirmationStatusTitle.success.expressCheckoutPassPurchaseSuccess',
        ),
        withAlert: null,
        withSubScriptionActions: null,
      },
    };
  }, [
    t,
    goToCalendar,
    goToMemberProfile,
    goToMemberProfilePage,
    goToMemberBookings,
    goBack,
    checkoutItems?.length,
    offers?.length,
    goToMemberPasses,
    goToMemberSubscriptions,
    hasDoorAccess,
  ]);
  return messageData;
};
