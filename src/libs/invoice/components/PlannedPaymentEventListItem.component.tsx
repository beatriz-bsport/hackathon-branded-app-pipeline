// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

import { PlannedPaymentEvent } from '../types';

type Props = {
  plannedPaymentEvent: PlannedPaymentEvent;
};

export const PlannedPaymentEventListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <HourglassEmptyIcon className={classes.leftIcon} />
        <div className={classes.leftColumn}>
          <Typography>
            {t(
              `paymentMethod.label.${props.plannedPaymentEvent.payment_method_identifier}`,
            )}
          </Typography>
          <div className={classes.row}>
            <Typography color="textSecondary" variant="caption">
              {moment(props.plannedPaymentEvent.future_date).format('L')}
            </Typography>
          </div>
        </div>
      </div>
      {/*
      <IconButton onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        onClose={() => setMenuAnchorEl(null)}
        open={!!menuAchorEl}
        anchorEl={menuAchorEl}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchorEl(null);
            props.onEdit(props.plannedPaymentEvent);
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary={t('plannedPaymentEvent.actions.edit')} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchorEl(null);
            props.onRegisterNow(props.plannedPaymentEvent.id);
          }}
        >
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('plannedPaymentEvent.actions.registerNow')}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchorEl(null);
            props.onDelete(props.plannedPaymentEvent.id);
          }}
        >
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText primary={t('plannedPaymentEvent.actions.delete')} />
        </MenuItem>
      </Menu>
      */}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rowRight: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default PlannedPaymentEventListItem;
