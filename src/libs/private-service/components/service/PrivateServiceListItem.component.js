// @flow
import React from 'react';
import { compose } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItemResponsiveAction from '../../../../components/button/ListItemResponsiveAction.component';
import Tooltip from '../../../../components/Tooltip.component';

import { PrivateService, ServiceCompatibilityPass } from '../../types';

type Props = {
  privateService: PrivateService,
  onClick: () => void,
  onEdit: () => void,
  dense?: boolean,
  selected: boolean,
  hideSecondary: boolean,
  onDelete: () => void,
  t: TFunction,
  compatibilityByService?: ServiceCompatibilityPass,
  classes: any,
};

export const PrivateServiceListItem = (props: Props) => {
  const { privateService, onClick, t, classes } = props;

  return (
    <ListItem
      button={!!onClick}
      divider
      selected={props.selected}
      onClick={onClick ? () => onClick(privateService.id) : null}
      alignItems="center"
      dense={props.dense}
      style={{
        borderLeft: privateService.color !== '' ? '5px solid' : '0px',
        borderLeftColor: privateService.color,
      }}
    >
      <ListItemAvatar>
        <Avatar
          className={classes.avatar}
          alt={privateService.name}
          src={privateService.cover_main}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <div>
            <div>{privateService.name}</div>
            {props.compatibilityByService && (
              <Typography variant="caption">
                {(props.compatibilityByService.excluded_slot_ids || []).length
                  ? `${t('privateServiceCompatibility.forSlots')} ${
                      props.compatibilityByService.included_slots
                        .filter((s) => s && s.name)
                        .map((s) => (s && s.name) || '')
                        .join(', ') || null
                    }`
                  : t('privateServiceCompatibility.allSlots')}
              </Typography>
            )}
          </div>
        }
        secondary={
          props.hideSecondary
            ? null
            : privateService.coaches
                .filter((c) => c && c.name)
                .map((c) => (c && c.name) || '')
                .join(', ') || null
        }
      />
      {privateService.hasActiveNotification && (
        <Tooltip
          title={
            <Typography variant="subtitle2">
              {t('privateBookingNotification.tooltip')}
            </Typography>
          }
        >
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      )}

      <ListItemResponsiveAction
        actions={[
          props.onEdit && {
            icon: EditIcon,
            label: t('serviceGroup.edit'),
            color: 'primary',
            onClick: props.onEdit,
          },
          props.onDelete && {
            icon: DeleteIcon,
            label: t('serviceGroup.delete'),
            onClick: props.onDelete,
          },
        ]}
      />
    </ListItem>
  );
};

const styles = (theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
  textContainer: {
    display: 'flex',
    flex: 1,
    marginLeft: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['privateService']),
)(PrivateServiceListItem);
