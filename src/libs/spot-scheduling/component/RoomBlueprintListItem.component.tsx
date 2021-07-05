import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SpotSchedulingHelper from '../utils';
import { RoomBlueprint } from '../types';

import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';

type Props = {
  roomBlueprint: RoomBlueprint;
  onClick?: (r: RoomBlueprint) => void;
  selected?: boolean;
  onClickPreview: (r: RoomBlueprint) => void;
  onClickEdit: (r: RoomBlueprint) => void;
  onClickDelete: (r: RoomBlueprint) => void;
  onClickCancel: (r: RoomBlueprint) => void;
};

const RoomBlueprintsListItem = (props: Props) => {
  const { t } = useTranslation(['spotScheduling']);
  return (
    <ListItem
      selected={props.selected}
      onClick={props.onClick ? () => props.onClick(props.roomBlueprint) : null}
      button={!!props.onClick}
    >
      <ListItemText
        primary={props.roomBlueprint.name}
        secondary={t('placeCount', {
          count: SpotSchedulingHelper.getSpotCount(props.roomBlueprint),
        })}
      />
      <ListItemResponsiveAction
        actions={[
          props.onClickPreview && {
            icon: VisibilityIcon,
            label: t('common.preview'),
            onClick: () => props.onClickPreview(props.roomBlueprint),
          },
          props.onClickCancel && {
            icon: ClearIcon,
            label: t('common.delete'),
            onClick: () => props.onClickCancel(props.roomBlueprint),
          },
          props.onClickEdit && {
            icon: EditIcon,
            label: t('common.edit'),
            color: 'secondary',
            onClick: () => props.onClickEdit(props.roomBlueprint),
          },
          props.onClickDelete && {
            icon: DeleteIcon,
            label: t('common.delete'),
            onClick: () => props.onClickDelete(props.roomBlueprint),
          },
        ]}
      />
    </ListItem>
  );
};

export default RoomBlueprintsListItem;
