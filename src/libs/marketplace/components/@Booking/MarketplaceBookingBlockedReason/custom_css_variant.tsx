import React from 'react';

import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import MarketplaceBookingBlockedReason, {
  Props as MarketplaceBookingBlockedReasonProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceBookingBlockedReasonCss from '!!raw-loader!./MarketplaceBookingBlockedReason.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import { getBookingBlockedReasonIcon } from '#libs/marketplace/utils';

const bookingBlockedReasonVariationRegistry = [
  {
    label: 'blockedReasonStatus',
    choices: [
      { label: 'blockedByTags', value: 'blockedByTags' },
      { label: 'isAlreadyRegistered', value: 'isAlreadyRegistered' },
      { label: 'isOfferNotAvailableYet', value: 'isOfferNotAvailableYet' },
      {
        label: 'isTooLate',
        value: 'isTooLate',
      },
      {
        label: 'isWaitingListBlockedByPendingBookings',
        value: 'isWaitingListBlockedByPendingBookings',
      },
      {
        label: 'isWaitingListFull',
        value: 'isWaitingListFull',
      },
      {
        label: 'isAlreadyInWaitingList',
        value: 'isAlreadyInWaitingList',
      },
      {
        label: 'isWaitingListOpen',
        value: 'isWaitingListOpen',
      },
      {
        label: 'isBlockedByMaxFutureBooking',
        value: 'isBlockedByMaxFutureBooking',
      },
    ],
    default: { label: 'blockedByTags', value: 'blockedByTags' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplaceBookingBlockedReasonProps => {
  const selectedStatus = variationsSelected?.blockedReasonStatus?.value;

  const { t } = useTranslation('booking');

  // The method below simplify the behavior of the method coming from @bsport-common
  // getMainOfferNotBookableReasonWithTitle. Too complicated to mock proper
  // OfferBookableStatus and metaActivity setup to display proper messages

  const getMainOfferNotBookableReasonWithTitle = () => {
    switch (selectedStatus) {
      case 'blockedByTags':
        return {
          title: t(
            'booking:newBookingModule.blockedReasons.blockedByTags.title',
          ),
          message: t(
            'booking:newBookingModule.blockedReasons.blockedByTags.message',
          ),
          icon: 'label-off',
          color: 'error',
        };
      case 'isBlockedByMaxFutureBooking':
        return {
          title: t(
            'booking:newBookingModule.blockedReasons.isBookingLimitReached.title',
          ),
          message: t(
            'booking:newBookingModule.blockedReasons.isBookingLimitReached.message',
          ),
          icon: 'block',
          color: 'error',
          isBlockedByMaxFutureBooking: true,
        };
      case 'isAlreadyRegistered':
        return {
          title: t(
            'booking:newBookingModule.blockedReasons.isAlreadyRegistered.title',
          ),
          message: t(
            'booking:newBookingModule.blockedReasons.isAlreadyRegistered.message',
          ),
          icon: 'done-all',
          color: 'success',
        };
      case 'isOfferNotAvailableYet':
        return {
          title: t('booking:newBookingModule.blockedReasons.isTooSoon.title'),
          message: t(
            'booking:newBookingModule.blockedReasons.isTooSoon.message',
            {
              date: DateTime.now().toLocaleString(DateTime.DATE_FULL),
            },
          ),
          icon: 'update',
          color: 'warning',
        };
      case 'isTooLate':
        return {
          title: t('booking:newBookingModule.blockedReasons.isTooLate.title'),
          message: t(
            'booking:newBookingModule.blockedReasons.isTooLate.message',
          ),
          icon: 'timer-off',
          color: 'error',
        };
      case 'isWaitingListBlockedByPendingBookings':
        return {
          title: t(
            'booking:newBookingModule.blockedReasons.waitingListLockedByPendingBookings.title',
          ),
          message: t(
            'booking:newBookingModule.blockedReasons.waitingListLockedByPendingBookings.message',
          ),
          icon: 'block',
          color: 'error',
        };
      case 'isWaitingListFull':
        return {
          title: t(
            'booking:newBookingModule.blockedReasons.isWaitingListFull.title',
          ),
          message: t(
            'booking:newBookingModule.blockedReasons.isWaitingListFull.message',
          ),
          icon: 'block',
          color: 'error',
        };
      case 'isAlreadyInWaitingList':
        return {
          title: t(
            'booking:newBookingModule.blockedReasons.isAlreadyOnWaitingList.title',
          ),
          message: t(
            'booking:newBookingModule.blockedReasons.isAlreadyOnWaitingList.message',
          ),
          icon: 'hourglass',
          color: 'success',
        };
      case 'isWaitingListOpen':
        return {
          title: t(
            'booking:newBookingModule.blockedReasons.waitingListOpen.title',
          ),
          message: t(
            'booking:newBookingModule.blockedReasons.waitingListOpen.message',
          ),
          icon: 'hourglass',
          color: 'success',
          isWaitingListOpenMainReason: true,
        };
      default:
        return {
          title: t('booking:newBookingModule.blockedReasons.default.title'),
          message: t('booking:newBookingModule.blockedReasons.default.message'),
          icon: 'block',
          color: 'error',
          isWaitingListOpenMainReason: false,
        };
    }
  };

  const correlatedProps = getMainOfferNotBookableReasonWithTitle();
  const TheIcon = getBookingBlockedReasonIcon(correlatedProps.icon);
  return {
    bookingBlockedReason: {
      title: correlatedProps.title,
      message: correlatedProps.message,
      TheIcon,
      color: correlatedProps.color,
      isWaitingListOpenMainReason: correlatedProps.isWaitingListOpenMainReason,
    },
    goBackToCalendar: () => {},
    isLoading: false,
  };
};

export const MARKETPLACE_BOOKING_BLOCKED_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_BOOKING_BLOCKED,
    css: MarketplaceBookingBlockedReasonCss,
    pages: [MarketplacePage.CALENDAR, MarketplacePage.WORKSHOP],
    defaultState: {},
    variations: bookingBlockedReasonVariationRegistry,
  };

export const MARKETPLACE_BOOKING_BLOCKED_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return <MarketplaceBookingBlockedReason {...componentProps} />;
});
