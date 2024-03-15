// @flow
import React from 'react';
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
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import type { CheckoutItem } from '../types';
import CountDown from '../../../components/time/CountDown.component';
import ReferralCouponHelpText from './ReferralCouponHelpText.component';
import {
  getCheckoutItemPrice,
  getIsCheckoutItemApplied,
  getIsCheckoutItemReferralItem,
} from '../utils';

import { getShopItemName } from '../../shop/utils';

export const CheckoutItemListItem = (props: {
  checkout_item: CheckoutItem,
  onAddOne: () => void,
  onRemoveOne: () => void,
  dense: ?boolean,
  hideExtraData: ?boolean,
  onItemExpire?: (item: CheckoutItem) => void,
  loading?: boolean,
  isExcludingTax?: boolean,
}) => {
  const isApplied = getIsCheckoutItemApplied(props.checkout_item.extra_data);
  const isReferralCouponItem = getIsCheckoutItemReferralItem(
    props.checkout_item.extra_data,
  );
  const classes = useStyles({ isApplied });

  const { t } = useTranslation('checkout');

  return (
    <React.Fragment>
      <ListItem divider className={classes.container} dense={!!props.dense}>
        <div className={classes.itemContainer}>
          <div className={classes.itemContent} id="itemContent">
            <ListItemAvatar>
              <Avatar className={classes.quantity}>
                {`x${props.checkout_item.quantity}`}
              </Avatar>
            </ListItemAvatar>
            <div>
              <ListItemText
                classes={{ secondary: classes.checkoutItemPrice }}
                primary={getShopItemName({
                  name: props.checkout_item?.name ?? '',
                  color: props.checkout_item?.color ?? '',
                  size: props.checkout_item?.size ?? '',
                })}
                secondary={getCheckoutItemPrice({
                  checkoutItem: props.checkout_item,
                  isExcludingTax: props.isExcludingTax,
                })}
              />
            </div>
            {props.checkout_item.editable &&
            props.onRemoveOne &&
            props.onAddOne ? (
              <div className={classes.actionButtons}>
                {!!props.onRemoveOne && (
                  <IconButton
                    disabled={props.loading}
                    onClick={props.onRemoveOne}
                  >
                    <ExposureNeg1Icon />
                  </IconButton>
                )}
                {!!props.onAddOne &&
                  !props.checkout_item?.sub_items?.length && (
                    <IconButton
                      disabled={props.loading}
                      onClick={props.onAddOne}
                    >
                      <ExposurePlus1Icon />
                    </IconButton>
                  )}
              </div>
            ) : null}
            {props.checkout_item.clearable &&
            !props.checkout_item.editable &&
            props.onRemoveOne ? (
              <ListItemSecondaryAction>
                <IconButton
                  disabled={props.loading}
                  onClick={props.onRemoveOne}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            ) : null}
          </div>
          {isReferralCouponItem && !isApplied && (
            <div className={classes.errorContainer}>
              <ReferralCouponHelpText
                hasReachedMaxUses={
                  props.checkout_item.extra_data?.has_reached_max_uses
                }
                missingAmountBeforeApplication={
                  props.checkout_item.extra_data
                    ?.missing_amount_before_application
                }
              />
            </div>
          )}
        </div>
      </ListItem>
      {!props.hideExtraData && props.checkout_item.expiration_datetime && (
        <CountDown
          onFinish={() =>
            props.onItemExpire && props.onItemExpire(props.checkout_item)
          }
          timestamp={moment(props.checkout_item.expiration_datetime).unix()}
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

      {!props.hideExtraData &&
        (props.checkout_item.sub_items || []).map((sub_item, idx) => (
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
