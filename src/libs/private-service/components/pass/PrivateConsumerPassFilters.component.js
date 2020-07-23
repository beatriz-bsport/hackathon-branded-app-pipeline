// @flow

import React from 'react';

import { useTranslation } from 'react-i18next';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CancelIcon from '@material-ui/icons/Cancel';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';

import FilterMenu from '../../../../components/button/FilterMenu.component';

type Props = {
  filters: any,
  open: any,
  setOpenValue: (name: string) => void,
  setFiltersValue: (name: string, bool: any) => void,
};

export function PrivateConsumerPassFilters(props: Props) {
  const { t } = useTranslation(['privateService']);
  return (
    <FilterMenu
      emptyLabel={t('filters.all')}
      menu={[
        {
          openFunction: () => props.setOpenValue('expiration'),
          label: t('filters.expiration'),
          open: props.open.expiration,
          subMenu: [
            {
              onClick: () => props.setFiltersValue('is_expired', true),
              onDelete: () => props.setFiltersValue('is_expired', null),
              icon: HourglassFullIcon,
              label: t('filters.isExpired'),
              show: props.filters.is_expired,
            },
            {
              onClick: () => props.setFiltersValue('is_expired', false),
              onDelete: () => props.setFiltersValue('is_expired', null),
              icon: AccessTimeIcon,
              label: t('filters.isActive'),
              show: props.filters.is_expired === false,
            },
          ],
        },
        {
          openFunction: () => props.setOpenValue('reverted'),
          label: t('filters.invoice'),
          open: props.open.reverted,
          subMenu: [
            {
              onClick: () => props.setFiltersValue('reverted', true),
              onDelete: () => props.setFiltersValue('reverted', null),
              icon: CancelIcon,
              label: t('filters.reverted'),
              show: props.filters.reverted,
            },
            {
              onClick: () => props.setFiltersValue('reverted', false),
              onDelete: () => props.setFiltersValue('reverted', null),
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
              onClick: () => props.setFiltersValue('has_credit_left', true),
              onDelete: () => props.setFiltersValue('has_credit_left', null),
              icon: AttachMoneyIcon,
              label: t('filters.hasCreditLeft'),
              show: props.filters.has_credit_left,
            },
            {
              onClick: () => props.setFiltersValue('has_credit_left', false),
              onDelete: () => props.setFiltersValue('has_credit_left', null),
              icon: MoneyOffIcon,
              label: t('filters.hasCreditNull'),
              show: props.filters.has_credit_left === false,
            },
          ],
        },
      ]}
    />
  );
}

export default PrivateConsumerPassFilters;
