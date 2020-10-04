// @flow

import React from 'react';
import PresentIcon from '@material-ui/icons/DoneOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import AbsentIcon from '@material-ui/icons/PriorityHigh';
import ConsumerIcon from '@material-ui/icons/Person';
import ManagerIcon from '@material-ui/icons/PermIdentity';
import { useTranslation } from 'react-i18next';
import RefundedIcon from '@material-ui/icons/CheckCircleOutline';
import NotRefundedIcon from '@material-ui/icons/CancelOutlined';
import FutureIcon from '@material-ui/icons/UpdateOutlined';
import PastIcon from '@material-ui/icons/Restore';
import RecurrentBookingIcon from '@material-ui/icons/Autorenew';
import NotRecurrentBookingIcon from '@material-ui/icons/Close';
import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code';
import FilterMenu from '../../../components/button/FilterMenu.component';

type Props = {
  filters: any,
  open: any,
  setOpenValue: (name: string) => void,
  setFiltersValue: (name: string, bool: any) => void,
};

export default function BookingFilters(props: Props) {
  const { t } = useTranslation(['booking']);
  return (
    <FilterMenu
      emptyLabel={t('filters.all')}
      menu={[
        {
          openFunction: () => props.setOpenValue('attendance'),
          label: t('filters.attendance'),
          open: props.open.attendance,
          subMenu: [
            {
              onClick: () => props.setFiltersValue('attendance', true),
              onDelete: () => props.setFiltersValue('attendance', null),
              label: t('filters.present'),
              icon: PresentIcon,
              show: props.filters.attendance,
            },
            {
              onClick: () => props.setFiltersValue('attendance', false),
              onDelete: () => props.setFiltersValue('attendance', null),
              label: t('filters.absent'),
              icon: AbsentIcon,
              show: props.filters.attendance === false,
            },
          ],
        },
        {
          openFunction: () => props.setOpenValue('recurrentBooking'),
          label: t('filters.recurrentBooking'),
          open: props.open.recurrentBooking,
          subMenu: [
            {
              onClick: () =>
                props.setFiltersValue('recurrence_rule_booking', true),
              onDelete: () =>
                props.setFiltersValue('recurrence_rule_booking', null),
              label: t('filters.withRecurrentBookings'),
              icon: RecurrentBookingIcon,
              show: props.filters.recurrence_rule_booking,
            },
            {
              onClick: () =>
                props.setFiltersValue('recurrence_rule_booking', false),
              onDelete: () =>
                props.setFiltersValue('recurrence_rule_booking', null),
              label: t('filters.withoutRecurrentBookings'),
              icon: NotRecurrentBookingIcon,
              show: props.filters.recurrence_rule_booking === false,
            },
          ],
        },
        {
          openFunction: () => props.setOpenValue('cancel'),
          label: t('filters.cancel'),
          open: props.open.cancel,
          subMenu: [
            {
              onClick: () =>
                props.setFiltersValue('booking_status_code__in', [
                  ...(props.filters.booking_status_code__in || []),
                  BOOKING_STATUS_CANCELLED_BY_OFFER.id,
                ]),
              onDelete: () =>
                props.setFiltersValue(
                  'booking_status_code__in',
                  props.filters.booking_status_code__in.filter(
                    (v) => v !== BOOKING_STATUS_CANCELLED_BY_OFFER.id,
                  ),
                ),
              label: t('filters.canceled'),
              icon: CancelIcon,
              show: (props.filters.booking_status_code__in || []).includes(
                BOOKING_STATUS_CANCELLED_BY_OFFER.id,
              ),
            },
            {
              onClick: () =>
                props.setFiltersValue('booking_status_code__in', [
                  ...(props.filters.booking_status_code__in || []),
                  BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
                ]),
              onDelete: () =>
                props.setFiltersValue(
                  'booking_status_code__in',
                  (props.filters.booking_status_code__in || []).filter(
                    (v) => v !== BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
                  ),
                ),
              label: t('filters.managerCanceled'),
              icon: ManagerIcon,
              show: (props.filters.booking_status_code__in || []).includes(
                BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
              ),
            },
            {
              onClick: () =>
                props.setFiltersValue('booking_status_code__in', [
                  ...(props.filters.booking_status_code__in || []),
                  BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
                ]),
              onDelete: () =>
                props.setFiltersValue(
                  'booking_status_code__in',
                  (props.filters.booking_status_code__in || []).filter(
                    (v) => v !== BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
                  ),
                ),
              label: t('filters.consumerCanceled'),
              icon: ConsumerIcon,
              show: (props.filters.booking_status_code__in || []).includes(
                BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
              ),
            },
          ],
        },
        {
          openFunction: () => props.setOpenValue('time'),
          label: t('filters.time'),
          open: props.open.time,
          subMenu: [
            {
              onClick: () => props.setFiltersValue('future_booking', true),
              onDelete: () => props.setFiltersValue('future_booking', false),
              label: t('filters.futureBooking'),
              icon: FutureIcon,
              show: props.filters.future_booking,
            },
            {
              onClick: () => props.setFiltersValue('past_booking', true),
              onDelete: () => props.setFiltersValue('past_booking', false),
              label: t('filters.pastBooking'),
              icon: PastIcon,
              show: props.filters.past_booking,
            },
          ],
        },
        {
          openFunction: () => props.setOpenValue('refunded'),
          label: t('filters.refunded'),
          open: props.open.refunded,
          subMenu: [
            {
              onClick: () => props.setFiltersValue('was_refunded', true),
              onDelete: () => props.setFiltersValue('was_refunded', null),
              label: t('filters.isRefunded'),
              icon: RefundedIcon,
              show: props.filters.was_refunded,
            },
            {
              onClick: () => props.setFiltersValue('was_refunded', false),
              onDelete: () => props.setFiltersValue('was_refunded', null),
              label: t('filters.notRefunded'),
              icon: NotRefundedIcon,
              show: props.filters.was_refunded === false,
            },
          ],
        },
      ]}
    />
  );
}
