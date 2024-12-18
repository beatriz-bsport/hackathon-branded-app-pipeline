import React, { useCallback, useMemo } from 'react';

import Immutable from 'seamless-immutable';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

import {
  VOUCHER_TYPE_PERCENT,
  VOUCHER_TYPE_AMOUNT,
  CouponKind,
} from '@bsport/common/lib/master-data/coupon';

import { useTranslation } from 'react-i18next';
import { IconButton, makeStyles } from '@material-ui/core';
import Popover from '#src/components/Popover';
import type { Coupon } from '../types';
import ListItemResponsiveAction, {
  ActionOption,
} from '../../../components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  coupon: Coupon;
  divider?: boolean;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
};

export const CouponListItem: React.FC<Props> = ({
  coupon,
  divider,
  onEdit,
  onDelete,
  onClick,
}) => {
  const { t } = useTranslation(['translation', 'coupon']);

  const classes = useStyles();

  const isCouponViaUniqueCode =
    coupon?.coupon_type === CouponKind.COUPON_VIA_UNIQUE_CODE_PER_USAGE;

  let secondaryText = '';

  switch (coupon?.voucher_type) {
    case VOUCHER_TYPE_PERCENT:
      secondaryText = `${coupon?.percent_off}%`;
      break;
    case VOUCHER_TYPE_AMOUNT:
      secondaryText = `${getCurrencyDisplayWithPrice(coupon?.amount_off)}`;
      break;
    default:
      break;
  }

  const handleOnDelete = useCallback(() => {
    !!coupon?.id && onDelete(coupon.id);
  }, [onDelete, coupon]);

  const handleOnEdit = useCallback(() => {
    !!coupon && onEdit(coupon);
  }, [onEdit, coupon]);

  const handleOnClick = useCallback(() => {
    !!coupon?.id && onClick(coupon.id);
  }, [onClick, coupon]);

  const listItemActions = useMemo(
    () =>
      Immutable([
        onEdit && {
          icon: EditIcon,
          label: t('translation:common.edit'),
          color: 'primary',
          onClick: handleOnEdit,
        },
        onDelete &&
          !coupon.coupon_template_instance && {
            icon: DeleteIcon,
            label: t('translation:common.delete'),
            onClick: handleOnDelete,
          },
      ]),
    [
      onEdit,
      onDelete,
      coupon?.coupon_template_instance,
      handleOnDelete,
      handleOnEdit,
      t,
    ],
  ) as Immutable.ImmutableArray<ActionOption>;

  return (
    <ListItem button divider={!!divider} onClick={handleOnClick}>
      <ListItemText
        primary={`${coupon.name} (${coupon.nb_discounts})`}
        secondary={!isCouponViaUniqueCode && secondaryText}
      />
      <div className={classes.buttonContainer}>
        {isCouponViaUniqueCode && (
          <Popover
            className={classes.popover}
            title={t('coupon:fabLabels.voucherCodes')}
          >
            <IconButton aria-label="info" size="medium">
              <LocalOfferIcon />
            </IconButton>
          </Popover>
        )}
        <ListItemResponsiveAction actions={listItemActions} />
      </div>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: 'flex',
  },
  popover: {
    background: theme.palette.grey[700],
    color: theme.palette.common.white,
  },
}));

export default React.memo(CouponListItem);
