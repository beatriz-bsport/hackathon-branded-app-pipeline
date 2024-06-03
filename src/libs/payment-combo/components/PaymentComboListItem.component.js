// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import type { PaymentCombo } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import ListItemResponsiveAction from '#components/button/ListItemResponsiveAction.component';
import Tooltip from '#components/Tooltip.component';

type Props = {
  divider?: boolean,
  isFocused?: boolean,
  paymentCombo: PaymentCombo,
  onEdit?: () => void,
  onDelete?: () => void,
  onClick?: () => void,
  t: TFunction,
  isExcludingTax?: boolean,
};

export const PaymentComboListItem = (props: Props) => {
  if (!props.paymentCombo) {
    return (
      <ListItem divider={props.divider}>
        <CircularProgress />
      </ListItem>
    );
  }
  return (
    <ListItem
      button={!!props.onClick}
      divider={!!props.divider}
      onClick={props.onClick}
      style={props.isFocused ? { backgroundColor: '#EFEFEF' } : {}}
    >
      <ListItemText
        primary={props.paymentCombo.name}
        secondary={`${getCurrencyDisplayWithPrice(
          props.paymentCombo.price,
          props.isExcludingTax,
          props.paymentCombo.tax_calculation,
        )} - ${props.t('detail.containsNProducts', {
          n:
            props.paymentCombo.payment_packs.reduce(
              (s, p) => p.quantity + s,
              0,
            ) +
            props.paymentCombo.private_passes.reduce(
              (s, p) => p.quantity + s,
              0,
            ) +
            props.paymentCombo.shop_items.reduce((s, p) => p.quantity + s, 0),
        })}`}
      />
      {!props.paymentCombo.is_usable_by_staff && (
        <Tooltip title={props.t('parameters.unusableByStaff')}>
          <IconButton onClick={null}>
            <RemoveShoppingCartIcon />
          </IconButton>
        </Tooltip>
      )}
      <ListItemResponsiveAction
        actions={[
          props.onEdit && {
            icon: EditIcon,
            label: props.t('edit'),
            color: 'primary',
            onClick: () => {
              props.onEdit();
            },
          },
          props.onDelete && {
            icon: DeleteIcon,
            label: props.t('common.delete'),
            onClick: () => {
              props.onDelete();
            },
          },
        ]}
      />
    </ListItem>
  );
};

const styles = (theme) => ({
  actionButtonWithRightMargin: {
    marginRight: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentCombo']),
)(PaymentComboListItem);
