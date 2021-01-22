// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { compose, pure } from 'recompose';
import { VOUCHER_TYPE_AMOUNT } from '@bsport/common/lib/master-data/coupon';
import { getCurrencyDisplay } from '../../theme/selectors';

import { isCurrentlyActive } from '../utils';

import type { Coupon } from '../types';

type Props = {
  coupon: Coupon,
  classes: Object,
  t: TFunction,
  goToEdit: () => void,
};

export const CouponCard = (props: Props) => {
  const { coupon, classes, t } = props;
  const currentlyActive = isCurrentlyActive(coupon);
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.headline}>
        <div>
          <Typography variant="h4">{props.coupon.name}</Typography>
          <Typography variant="h5">{props.coupon.code}</Typography>
        </div>
        <div className={classes.headlineRight}>
          {currentlyActive ? (
            <CheckCircleOutlineIcon
              className={classes.isActiveIcon}
              color="primary"
            />
          ) : (
            <CancelIcon className={classes.isActiveIcon} color="error" />
          )}
          <Typography align="right" variant="h5">
            {coupon.voucher_type === VOUCHER_TYPE_AMOUNT
              ? `${coupon.amount_off}${getCurrencyDisplay()}`
              : `${coupon.percent_off}%`}
          </Typography>
        </div>
      </div>
      <List>
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${t('card.uses')} ${props.coupon.nb_discounts}/${
              props.coupon.usage_total
            }`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              props.coupon.usage_per_member === 1
                ? `${t('card.limitation')} ${props.coupon.usage_per_member} ${t(
                    'card.member_use',
                  )}`
                : `${t('card.limitation')} ${props.coupon.usage_per_member} ${t(
                    'card.member_uses',
                  )}`
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              props.coupon.combinable
                ? t('card.cumulable')
                : t('card.no_cumulable')
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${t('card.validity')} ${t(
              `form.applies_to.choices.${props.coupon.applies_to}`,
            )}`}
          />
        </ListItem>
        {props.coupon.only_on_first_checkout ? (
          <ListItem>
            <ListItemIcon>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary={t('card.first_buy')} />
          </ListItem>
        ) : null}
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              props.coupon.expiration_date
                ? `${t('card.expiration')} ${props.coupon.expiration_date}`
                : t('card.no_expiration')
            }
          />
        </ListItem>
      </List>
      <div className={classes.actionButtons}>
        <Button color="primary" onClick={props.goToEdit}>
          {props.t('detail.seeParameters')}
        </Button>
      </div>
    </Paper>
  );
};

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    width: '100%',
  },
  headline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  isActiveIcon: {
    marginRight: theme.spacing(1),
  },
  headlineRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['coupon']),
  pure,
)(CouponCard);
