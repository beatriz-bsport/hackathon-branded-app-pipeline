// @flow
import React from 'react';
import { compose } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import ListItemResponsiveAction from '../../../../components/button/ListItemResponsiveAction.component';

import type { PrivateService } from '../../types';

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
