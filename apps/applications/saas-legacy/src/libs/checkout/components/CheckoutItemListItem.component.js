// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import ScheduleIcon from '@material-ui/icons/Schedule';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import DeleteIcon from '@material-ui/icons/Delete';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import makeStyles from '@material-ui/core/styles/makeStyles';

import type { CheckoutItem } from '../types';
import CountDown from '../../../components/time/CountDown.component';
import ReferralCouponHelpText from './ReferralCouponHelpText.component';
import {
  getCheckoutItemPrice,
  getIsCheckoutItemApplied,
  getIsCheckoutItemReferralItem,
} from '../utils';

import { getShopItemName } from '../../shop/utils';

type Props = {
  checkout_item: CheckoutItem,
  dense?: boolean,
  hideExtraData?: boolean,
  isExcludingTax?: boolean,
  loading?: boolean,
  onAddOne: () => void,
  onItemExpire?: (item: CheckoutItem) => void,
  onRemoveOne: () => void,
};

export const CheckoutItemListItem: React.FC<Props> = ({
  checkout_item,
  dense,
  hideExtraData,
  isExcludingTax,
  loading,
  onAddOne,
  onItemExpire,
  onRemoveOne,
}) => {
  const isApplied = getIsCheckoutItemApplied(checkout_item.extra_data);
  const isReferralCouponItem = getIsCheckoutItemReferralItem(
    checkout_item.extra_data,
  );
  const classes = useStyles({ isApplied });

  const { t } = useTranslation('checkout');

  return (
    <React.Fragment>
      <ListItem divider className={classes.container} dense={!!dense}>
        <div className={classes.itemContainer}>
          {' '}
          <div className={classes.itemContent} id="itemContent">
            <ListItemAvatar>
              <Avatar className={classes.quantity}>
                {`x${checkout_item.quantity}`}
              </Avatar>
            </ListItemAvatar>
            <div>
              <ListItemText
                classes={{ secondary: classes.checkoutItemPrice }}
                primary={getShopItemName({
                  name: checkout_item?.name ?? '',
                  color: checkout_item?.color ?? '',
                  size: checkout_item?.size ?? '',
                })}
                secondary={getCheckoutItemPrice({
                  checkoutItem: checkout_item,
                  isExcludingTax,
                })}
              />
            </div>
            {checkout_item.editable && onRemoveOne && onAddOne ? (
              <div className={classes.actionButtons}>
                {!!onRemoveOne && (
                  <IconButton disabled={loading} onClick={onRemoveOne}>
                    <ExposureNeg1Icon />
                  </IconButton>
                )}
                {!!onAddOne && !checkout_item?.sub_items?.length && (
                  <IconButton disabled={loading} onClick={onAddOne}>
                    <ExposurePlus1Icon />
                  </IconButton>
                )}
              </div>
            ) : null}
            {checkout_item.clearable &&
            !checkout_item.editable &&
            onRemoveOne ? (
              <ListItemSecondaryAction>
                <IconButton disabled={loading} onClick={onRemoveOne}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            ) : null}
          </div>
          {isReferralCouponItem && !isApplied && (
            <div className={classes.errorContainer}>
              <ReferralCouponHelpText
                hasReachedMaxUses={
                  checkout_item.extra_data?.has_reached_max_uses
                }
                missingAmountBeforeApplication={
                  checkout_item.extra_data?.missing_amount_before_application
                }
              />
            </div>
          )}
        </div>
      </ListItem>
      {!hideExtraData && checkout_item.expiration_datetime && (
        <CountDown
          onFinish={() => onItemExpire && onItemExpire(checkout_item)}
          timestamp={DateTime.fromISO(
            checkout_item.expiration_datetime,
          ).toUnixInteger()}
        >
          {(countdown) => {
            if (countdown) {
              return (
                <ListItem dense divider>
                  <ListItemIcon>
                    <ScheduleIcon color="textSecondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${t('expire_in')} ${countdown}`}
                    primaryTypographyProps={{ color: 'textSecondary' }}
                  />
                </ListItem>
              );
            }
            return null;
          }}
        </CountDown>
      )}

      {!hideExtraData &&
        (checkout_item.sub_items || []).map((sub_item, idx) => (
          <ListItem key={idx} dense divider>
            <ListItemIcon>
              <CalendarIcon color="textSecondary" />
            </ListItemIcon>
            <ListItemText
              primary={sub_item}
              primaryTypographyProps={{ color: 'textSecondary' }}
            />
          </ListItem>
        ))}
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  itemContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  errorContainer: {
    display: 'flex',
    padding: `0px ${theme.spacing(2)}px ${theme.spacing(1)}px`,
  },
  itemContent: {
    display: 'flex',
    flex: 1,
    width: '100%',
    opacity: ({ isApplied }) => (isApplied ? 1 : 0.5),
  },
  checkoutItemPrice: {
    textDecoration: ({ isApplied }) => (isApplied ? null : 'line-through'),
  },
  quantity: {
    margin: 10,
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  countdown: {
    marginLeft: theme.spacing(1),
  },
}));

export default React.memo(CheckoutItemListItem);
