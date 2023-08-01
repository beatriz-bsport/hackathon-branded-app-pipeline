// @ts-nocheck
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Paper from '@material-ui/core/Paper';
import { DraggableSyntheticListeners } from '@dnd-kit/core';
import StyleIcon from '@material-ui/icons/Style';
import Tooltip from '#components/Tooltip.component';
import type { PrivatePass } from '../../types';
import { getValidityInfo } from '../../utils';
import ListItemResponsiveAction from '../../../../components/button/ListItemResponsiveAction.component';
import ConditionalWrapper from '#components/ConditionnalWrapper.component';
import { getCreditFactor } from '#libs/theme/selectors';

type Props = {
  pass: PrivatePass;
  onClick?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  divider?: boolean;
  onEdit?: () => void;
  draggable?: boolean;
  listeners?: DraggableSyntheticListeners;
  attributes?: any;
  dense?: boolean;
  removePaper?: boolean;
};

export const PrivatePassListItem = (props: Props) => {
  const { t } = useTranslation('privateService');
  if (!props.pass) {
    return (
      <ListItem divider={props.divider}>
        <CircularProgress />
      </ListItem>
    );
  }
  const dateInfo = getValidityInfo(props.pass, t);

  return (
    <ConditionalWrapper
      condition={!props.removePaper}
      wrapper={(children) => <Paper>{children}</Paper>}
    >
      <ListItem
        button={!!props.onClick}
        dense={props.dense}
        divider={props.divider}
        onClick={props.onClick}
      >
        {props.draggable && (
          <IconButton {...props.listeners} {...props.attributes}>
            <DragHandleIcon />
          </IconButton>
        )}
        <ListItemText
          primary={props.pass.name}
          secondary={`${t('privatePass.parameters.nbCredits', {
            count: props.pass.credits / getCreditFactor(),
            credits: props.pass.credits / getCreditFactor(),
          })} - ${dateInfo}`}
          style={{ marginLeft: 10 }}
        />
        {!props.pass.is_usable_by_staff && props.pass.available && (
          <Tooltip title={t('privatePass.listItem.unusableByStaff')}>
            <IconButton>
              <RemoveShoppingCartIcon />
            </IconButton>
          </Tooltip>
        )}
        {!!props.pass.linked_payment_pack && (
          <Tooltip title={t('privatePass.form.universalPass.label')}>
            <IconButton onClick={null}>
              <StyleIcon color="inherit" />
            </IconButton>
          </Tooltip>
        )}
        {props.pass.manager_only && props.pass.available && (
          <Tooltip title={t('privatePass.form.managerOnly.label')}>
            <IconButton>
              <VisibilityOffIcon />
            </IconButton>
          </Tooltip>
        )}

        <ListItemResponsiveAction
          actions={[
            props.onEdit && {
              icon: EditIcon,
              label: t('privatePass.edit'),
              color: 'primary',
              onClick: props.onEdit,
            },
            props.onDelete &&
              !props.pass.template_instance && {
                icon: DeleteIcon,
                label: t('privatePass.delete.delete'),
                onClick: props.onDelete,
              },
            props.onRestore &&
              !props.pass.template_instance && {
                icon: RestoreFromTrashIcon,
                color: 'secondary',
                onClick: props.onRestore,
              },
          ]}
        />
      </ListItem>
    </ConditionalWrapper>
  );
};

export default React.memo(PrivatePassListItem);
