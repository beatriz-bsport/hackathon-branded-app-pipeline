// @ts-nocheck
import React from 'react';
import {
  ShoppingBasket as BasketPaidIcon,
  DateRange as BookingIcon,
  Contacts as CustomFormFilledIcon,
  CardGiftcard as GiftcardUsedIcon,
  Receipt as InvoicePaidIcon,
  LockOpen as LoginSuccessfulIcon,
  Schedule as PrivateBookingIcon,
  Label as TagAppliedIcon,
  EventBusy as EventBusyIcon,
  Videocam as VODBoughtIcon,
} from '@material-ui/icons';
import { TFunction } from 'i18next';
import { MEMBER_EVENTS } from '@bsport/common/lib/master-data/events';
import { GenericEvent, MemberEvent } from '#libs/event/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

const getPrimaryText = (event: GenericEvent<MemberEvent>, t: TFunction) => {
  return t(
    `member:events.${event.event_type}.primaryText`,
    getTranslationDataFromEvent(event, t),
  );
};

const getTranslationDataFromEvent = (
  event: GenericEvent<MemberEvent>,
  t: TFunction,
) => {
  const spotIdTranslation = (spotId?: number) => {
    return spotId ? ` (spot ${spotId})` : '';
  };

  switch (event.event_type) {
    case MEMBER_EVENTS.basket_paid:
      return {
        amount: getCurrencyDisplayWithPrice(
          parseFloat(event.data?.amount || '0'),
        ),
      };

    case MEMBER_EVENTS.booking_registered:
      return {
        source: event.data?.by_manager
          ? t(
              `member:events.${MEMBER_EVENTS.booking_registered}.sourceManager`,
              {
                managerName: event.data?.booker_name || '',
              },
            )
          : event.data?.booker_name,
        offerName:
          `${event.data?.offer_name}${spotIdTranslation(
            event.data?.spot_id,
          )}` || '',
        offerDate: event.data?.offer_date_str || '',
      };

    case MEMBER_EVENTS.privatebooking_canceled:
      return {
        private_slot_name: event.data?.private_slot_name || '',
        private_service_name: event.data?.private_service_name || '',
        date_start: event.data?.date_start || '',
      };
    case MEMBER_EVENTS.booking_canceled:
      return {
        name: event.data?.name || '',
        date_start: event.data?.date_start || '',
      };

    case MEMBER_EVENTS.custom_form_filled:
      return { formName: event.data?.custom_form_name };

    case MEMBER_EVENTS.giftcard_used:
      return {
        giftcardName: event.data?.giftcard_name || '',
      };

    case MEMBER_EVENTS.invoice_paid:
      return {
        invoiceUUID: event.data?.invoice_uuid || '',
        amount: getCurrencyDisplayWithPrice(
          parseFloat(event.data?.amount || '0'),
        ),
      };

    case MEMBER_EVENTS.login_successful:
      return {
        source: t(
          `member:events.${MEMBER_EVENTS.login_successful}.${
            event.data?.from_mobile_app ? 'sourceApp' : 'sourceMarketplace'
          }`,
        ),
      };

    case MEMBER_EVENTS.private_booking_registered:
      return {
        source: event.data?.by_manager
          ? t(
              `member:events.${MEMBER_EVENTS.private_booking_registered}.sourceManager`,
              {
                managerName: event.data?.booker_name || '',
              },
            )
          : event.data?.booker_name,
        privateServiceName: event.data?.private_service_name || '',
        privateServiceDate: event.data?.private_service_date_str || '',
        privateSlotName: event.data?.private_slot_name || '',
      };

    case MEMBER_EVENTS.tag_applied:
      return {
        tagName:
          `${event.data?.tag_name} - ${event.data?.tag_group_name}` || '',
      };

    case MEMBER_EVENTS.vod_bought:
      return { VODName: event.data?.vod_name || '' };

    default:
      return {};
  }
};

export const COMPANY_EVENTS = {
  [MEMBER_EVENTS.booking_registered]: {
    icon: <BookingIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.booking_registered}.filter`,
  },
  [MEMBER_EVENTS.booking_canceled]: {
    icon: <EventBusyIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.booking_canceled}.filter`,
  },
  [MEMBER_EVENTS.private_booking_registered]: {
    icon: <PrivateBookingIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.private_booking_registered}.filter`,
  },
  [MEMBER_EVENTS.privatebooking_canceled]: {
    icon: <EventBusyIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.privatebooking_canceled}.filter`,
  },
  [MEMBER_EVENTS.basket_paid]: {
    icon: <BasketPaidIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.basket_paid}.filter`,
  },
  [MEMBER_EVENTS.invoice_paid]: {
    icon: <InvoicePaidIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.invoice_paid}.filter`,
  },
  [MEMBER_EVENTS.vod_bought]: {
    icon: <VODBoughtIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.vod_bought}.filter`,
  },
  [MEMBER_EVENTS.giftcard_used]: {
    icon: <GiftcardUsedIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.giftcard_used}.filter`,
  },
  [MEMBER_EVENTS.tag_applied]: {
    icon: <TagAppliedIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.tag_applied}.filter`,
    disableOnClick: true,
  },
  [MEMBER_EVENTS.login_successful]: {
    icon: <LoginSuccessfulIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.login_successful}.filter`,
    disableOnClick: true,
  },
  [MEMBER_EVENTS.custom_form_filled]: {
    icon: <CustomFormFilledIcon color="primary" />,
    getPrimaryText,
    i18nText: `member:events.${MEMBER_EVENTS.custom_form_filled}.filter`,
  },
};

export const getMemberEventPath = (
  event: GenericEvent<MemberEvent>,
  memberId: number,
) => {
  const defaultPath = `/member/${memberId}`;
  switch (event.event_type) {
    case MEMBER_EVENTS.basket_paid:
      return `${defaultPath}/basket/${event.data?.basket_id || ''}`;

    case MEMBER_EVENTS.booking_registered:
      return `${defaultPath}/bookings/${event.data?.booking_id || ''}`;

    case MEMBER_EVENTS.booking_canceled:
      return `${defaultPath}/bookings/${event.data?.booking_id || ''}`;

    case MEMBER_EVENTS.custom_form_filled:
      // there is no routing with the custom form filled ids
      return `${defaultPath}/form/`;

    case MEMBER_EVENTS.giftcard_used:
      return `${defaultPath}/giftcard/${event.data?.giftcard_id || ''}`;

    case MEMBER_EVENTS.invoice_paid:
      // return `invoice/${event.data?.invoice_uuid || ''}`;
      // The above url path won't work because `member/id/` is added
      // before for no reasons. To bypass, we could redirect to the payment tab
      return `${defaultPath}/payment/`;

    case MEMBER_EVENTS.private_booking_registered:
      return `${defaultPath}/private-booking/${
        event.data?.private_booking_id || ''
      }`;

    case MEMBER_EVENTS.privatebooking_canceled:
      return `${defaultPath}/private-booking/${
        event.data?.private_booking_id || ''
      }`;

    case MEMBER_EVENTS.vod_bought:
      return `${defaultPath}/vod/${event.data?.video_purchase || ''}`;

    case MEMBER_EVENTS.tag_applied:
    case MEMBER_EVENTS.login_successful:
    default:
      return defaultPath;
  }
};
