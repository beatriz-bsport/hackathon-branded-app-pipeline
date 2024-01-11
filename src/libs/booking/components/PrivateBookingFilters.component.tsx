import React from 'react';
import { useTranslation } from 'react-i18next';

import CancelIcon from '@material-ui/icons/Cancel';
import ConsumerIcon from '@material-ui/icons/Person';
import ManagerIcon from '@material-ui/icons/PermIdentity';
import RefundedIcon from '@material-ui/icons/CheckCircleOutline';
import NotRefundedIcon from '@material-ui/icons/CancelOutlined';
import FutureIcon from '@material-ui/icons/UpdateOutlined';
import PastIcon from '@material-ui/icons/Restore';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import RecurrentBookingIcon from '@material-ui/icons/Autorenew';
import NotRecurrentBookingIcon from '@material-ui/icons/Close';
import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
  BOOKING_STATUS_OK,
} from '@bsport/common/lib/master-data/booking_status_code';

import FilterMenu from '../../../components/button/FilterMenu.component';
import type { PrivateBookingFilterParams } from '#libs/private-service/types';

type Props = {
  filters: PrivateBookingFilterParams;
  open: {
    recurrentBooking: boolean;
    cancel: boolean;
    time: boolean;
    refunded: boolean;
    paid: boolean;
  };
  setOpenValue: (name: string) => void;
  setFiltersValue: (name: string, bool: any) => void;
};

const PrivateBookingFilters: React.FC<Props> = ({
  open,
  filters,
  setOpenValue,
  setFiltersValue,
}) => {
  const { t } = useTranslation(['booking', 'privateService']);

  return (
    <FilterMenu
      emptyLabel={t('privateService:privateBooking.bookings')}
      menu={[
        {
          openFunction: () => setOpenValue('recurrentBooking'),
          label: t('booking:filters.recurrentBooking'),
          open: open.recurrentBooking,
          subMenu: [
            {
              onClick: () => setFiltersValue('is_recurrent', true),
              onDelete: () => setFiltersValue('is_recurrent', null),
              label: t('booking:filters.withRecurrentBookings'),
              icon: RecurrentBookingIcon,
              show: filters.is_recurrent,
            },
            {
              onClick: () => setFiltersValue('is_recurrent', false),
              onDelete: () => setFiltersValue('is_recurrent', null),
              label: t('booking:filters.withoutRecurrentBookings'),
              icon: NotRecurrentBookingIcon,
              show: filters.is_recurrent === false,
            },
          ],
        },
        {
          openFunction: () => setOpenValue('cancel'),
          label: t('booking:filters.cancel'),
          open: open.cancel,
          subMenu: [
            {
              onClick: () =>
                setFiltersValue('booking_status_code__in', [
                  ...(filters.booking_status_code__in || []),
                  BOOKING_STATUS_OK.id,
                ]),
              onDelete: () =>
                setFiltersValue(
                  'booking_status_code__in',
                  (filters.booking_status_code__in || []).filter(
                    (v) => v !== BOOKING_STATUS_OK.id,
                  ),
                ),
              label: t('booking:filters.notCancelled'),
              icon: ConsumerIcon,
              show: (filters.booking_status_code__in || []).includes(
                BOOKING_STATUS_OK.id,
              ),
            },
            {
              onClick: () =>
                setFiltersValue('booking_status_code__in', [
                  ...(filters.booking_status_code__in || []),
                  BOOKING_STATUS_CANCELLED_BY_OFFER.id,
                ]),
              onDelete: () =>
                setFiltersValue(
                  'booking_status_code__in',
                  filters.booking_status_code__in.filter(
                    (v) => v !== BOOKING_STATUS_CANCELLED_BY_OFFER.id,
                  ),
                ),
              label: t('booking:filters.canceled'),
              icon: CancelIcon,
              show: (filters.booking_status_code__in || []).includes(
                BOOKING_STATUS_CANCELLED_BY_OFFER.id,
              ),
            },
            {
              onClick: () =>
                setFiltersValue('booking_status_code__in', [
                  ...(filters.booking_status_code__in || []),
                  BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
                ]),
              onDelete: () =>
                setFiltersValue(
                  'booking_status_code__in',
                  (filters.booking_status_code__in || []).filter(
                    (v) => v !== BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
                  ),
                ),
              label: t('booking:filters.managerCanceled'),
              icon: ManagerIcon,
              show: (filters.booking_status_code__in || []).includes(
                BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
              ),
            },
            {
              onClick: () =>
                setFiltersValue('booking_status_code__in', [
                  ...(filters.booking_status_code__in || []),
                  BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
                ]),
              onDelete: () =>
                setFiltersValue(
                  'booking_status_code__in',
                  (filters.booking_status_code__in || []).filter(
                    (v) => v !== BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
                  ),
                ),
              label: t('booking:filters.consumerCanceled'),
              icon: ConsumerIcon,
              show: (filters.booking_status_code__in || []).includes(
                BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
              ),
            },
          ],
        },
        {
          openFunction: () => setOpenValue('time'),
          label: t('booking:filters.time'),
          open: open.time,
          subMenu: [
            {
              onClick: () => setFiltersValue('future_booking', true),
              onDelete: () => setFiltersValue('future_booking', false),
              label: t('booking:filters.futureBooking'),
              icon: FutureIcon,
              show: filters.future_booking,
            },
            {
              onClick: () => setFiltersValue('past_booking', true),
              onDelete: () => setFiltersValue('past_booking', false),
              label: t('booking:filters.pastBooking'),
              icon: PastIcon,
              show: filters.past_booking,
            },
          ],
        },
        {
          openFunction: () => setOpenValue('refunded'),
          label: t('booking:filters.refunded'),
          open: open.refunded,
          subMenu: [
            {
              onClick: () => setFiltersValue('was_refunded', true),
              onDelete: () => setFiltersValue('was_refunded', null),
              label: t('booking:filters.isRefunded'),
              icon: RefundedIcon,
              show: filters.was_refunded,
            },
            {
              onClick: () => setFiltersValue('was_refunded', false),
              onDelete: () => setFiltersValue('was_refunded', null),
              label: t('booking:filters.notRefunded'),
              icon: NotRefundedIcon,
              show: filters.was_refunded === false,
            },
          ],
        },
        {
          openFunction: () => setOpenValue('paid'),
          label: t('booking:filters.paid'),
          open: open.paid,
          subMenu: [
            {
              onClick: () => setFiltersValue('is_unpaid', false),
              onDelete: () => setFiltersValue('is_unpaid', null),
              label: t('booking:filters.isPaid'),
              icon: AttachMoneyIcon,
              show: filters.is_unpaid === false,
            },
            {
              onClick: () => setFiltersValue('is_unpaid', true),
              onDelete: () => setFiltersValue('is_unpaid', null),
              label: t('booking:filters.isUnpaid'),
              icon: MoneyOffIcon,
              show: filters.is_unpaid,
            },
          ],
        },
      ]}
    />
  );
};

export default PrivateBookingFilters;
