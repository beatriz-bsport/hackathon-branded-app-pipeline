// @flow

import React from 'react';

import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import { useTranslation } from 'react-i18next';

import FilterMenu from '../../../components/button/FilterMenu.component';
import { PaymentPackFilters, PaymentPackFiltersOpener } from '../types';

type Props = {
  filters: PaymentPackFilters;
  open: PaymentPackFiltersOpener;
  setOpenValue: (name: string) => void;
  setFiltersValue: (filterDict: { [name: string]: boolean | null }) => void;
};

export function ConsumerPaymentPackFilters(props: Props) {
  const { t } = useTranslation(['paymentPack']);
  return (
    <div>
      <FilterMenu
        emptyLabel={t('filters.all')}
        menu={[
          {
            openFunction: () => props.setOpenValue('expiration'),
            label: t('filters.expiration'),
            open: props.open.expiration,
            subMenu: [
              {
                onClick: () => {
                  props.setFiltersValue({
                    is_expired: true,
                    is_valid_today: null,
                  });
                },
                onDelete: () => props.setFiltersValue({ is_expired: null }),
                icon: HourglassFullIcon,
                label: t('filters.isExpired'),
                show: props.filters.is_expired,
              },
              {
                onClick: () => {
                  props.setFiltersValue({
                    is_expired: false,
                    is_valid_today: null,
                  });
                },
                onDelete: () => props.setFiltersValue({ is_expired: null }),
                icon: AccessTimeIcon,
                label: t('filters.isActive'),
                show: props.filters.is_expired === false,
              },
              {
                onClick: () => {
                  props.setFiltersValue({
                    is_valid_today: true,
                    is_expired: null,
                  });
                },
                onDelete: () => props.setFiltersValue({ is_valid_today: null }),
                icon: CheckCircleOutlineIcon,
                label: t('filters.isValidToday'),
                show: props.filters.is_valid_today === true,
              },
            ],
          },
          {
            openFunction: () => props.setOpenValue('reverted'),
            label: t('filters.invoice'),
            open: props.open.reverted,
            subMenu: [
              {
                onClick: () => props.setFiltersValue({ reverted: true }),
                onDelete: () => props.setFiltersValue({ reverted: null }),
                icon: CancelIcon,
                label: t('filters.reverted'),
                show: props.filters.reverted,
              },
              {
                onClick: () => props.setFiltersValue({ reverted: false }),
                onDelete: () => props.setFiltersValue({ reverted: null }),
                icon: CheckSharpIcon,
                label: t('filters.notReverted'),
                show: props.filters.reverted === false,
              },
            ],
          },
          {
            openFunction: () => props.setOpenValue('credit_left'),
            label: t('filters.credits'),
            open: props.open.credit_left,
            subMenu: [
              {
                onClick: () => props.setFiltersValue({ has_credit_left: true }),
                onDelete: () =>
                  props.setFiltersValue({ has_credit_left: null }),
                icon: AttachMoneyIcon,
                label: t('filters.hasCreditLeft'),
                show: props.filters.has_credit_left,
              },
              {
                onClick: () =>
                  props.setFiltersValue({ has_credit_left: false }),
                onDelete: () =>
                  props.setFiltersValue({ has_credit_left: null }),
                icon: MoneyOffIcon,
                label: t('filters.hasCreditNull'),
                show: props.filters.has_credit_left === false,
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default ConsumerPaymentPackFilters;
