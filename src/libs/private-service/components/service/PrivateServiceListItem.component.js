// @flow
import React from 'react';
import { compose } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import ListItemResponsiveAction from '../../../../components/button/ListItemResponsiveAction.component';
import Tooltip from '../../../../components/Tooltip.component';

import type { PrivateService } from '../../types.ts';

type Props = {
  privateService: PrivateService,
  onClick: () => void,
  onEdit: () => void,
  dense?: boolean,
  selected: boolean,
  hideSecondary: boolean,
  onDelete: () => void,
  t: TFunction,
};

export const PrivateServiceListItem = (props: Props) => {
  const { privateService, onClick, t } = props;
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
      <ListItemText
        primary={privateService.name}
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
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['privateService']),
)(PrivateServiceListItem);
