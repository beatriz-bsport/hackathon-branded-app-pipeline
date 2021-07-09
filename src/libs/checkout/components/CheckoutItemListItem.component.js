// @flow
import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
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
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';

import { getCurrencyDisplay } from '../../theme/selectors';

import type { CheckoutItem } from '../types';
import CountDown from '../../../components/time/CountDown.component';

export const CheckoutItemListItem = (props: {
  checkout_item: CheckoutItem,
  onAddOne: () => void,
  onRemoveOne: () => void,
  classes: Object,
  dense: ?boolean,
  onItemExpire?: (item: CheckoutItem) => void,
  loading?: boolean,
  t: any,
}) => (
  <React.Fragment>
    <ListItem dense={!!props.dense} divider className={props.classes.container}>
      <div className={props.classes.itemContent}>
        <ListItemAvatar>
          <Avatar className={props.classes.quantity}>
            {`x${props.checkout_item.quantity}`}
          </Avatar>
        </ListItemAvatar>
        <div>
          <ListItemText
            primary={props.checkout_item.name}
            secondary={`${
              props.checkout_item.unit_price
            } ${getCurrencyDisplay()} x ${props.checkout_item.quantity}`}
          />
        </div>

        {props.checkout_item.editable && props.onRemoveOne && props.onAddOne ? (
          <div className={props.classes.actionButtons}>
            <IconButton disabled={props.loading} onClick={props.onRemoveOne}>
              <ExposureNeg1Icon />
            </IconButton>
            <IconButton disabled={props.loading} onClick={props.onAddOne}>
              <ExposurePlus1Icon />
            </IconButton>
          </div>
        ) : null}
        {props.checkout_item.clearable &&
        !props.checkout_item.editable &&
        props.onRemoveOne ? (
          <ListItemSecondaryAction>
            <IconButton disabled={props.loading} onClick={props.onRemoveOne}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : null}
      </div>
    </ListItem>
    {props.checkout_item.expiration_datetime && (
      <CountDown
        timestamp={moment(props.checkout_item.expiration_datetime).unix()}
        onFinish={() =>
          props.onItemExpire && props.onItemExpire(props.checkout_item)
        }
      >
        {(countdown) => {
          if (countdown) {
            return (
              <ListItem dense divider>
                <ListItemIcon>
                  <ScheduleIcon color="textSecondary" />
                </ListItemIcon>
                <ListItemText
                  primary={`${props.t('expire_in')} ${countdown}`}
                  primaryTypographyProps={{ color: 'textSecondary' }}
                />
              </ListItem>
            );
          }
          return null;
        }}
      </CountDown>
    )}

    {(props.checkout_item.sub_items || []).map((sub_item, idx) => (
      <ListItem dense key={idx} divider>
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

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  itemContent: {
    display: 'flex',
    flex: 1,
    width: '100%',
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
});

export default compose(
  withStyles(styles),
  withTranslation(['checkout']),
)(CheckoutItemListItem);
