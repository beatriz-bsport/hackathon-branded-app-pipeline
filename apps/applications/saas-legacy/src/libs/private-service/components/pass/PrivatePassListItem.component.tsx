import React from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableSyntheticListeners } from '@dnd-kit/core';

import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import StyleIcon from '@material-ui/icons/Style';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import ListItemResponsiveAction from '#src/components/button/ListItemResponsiveAction.component';
import ConditionalWrapper from '#src/components/ConditionnalWrapper.component';
import Tooltip from '#src/components/Tooltip.component';

import type { PrivatePass } from '#src/libs/private-service/types';

import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import { getValidityInfo } from '../../utils';

type Props = {
  // Use this prop to disable all shared pass' specific behaviors.
  asStandardPass?: boolean;
  attributes?: any;
  dense?: boolean;
  divider?: boolean;
  draggable?: boolean;
  listeners?: DraggableSyntheticListeners;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onRestore?: () => void;
  pass: PrivatePass;
  removePaper?: boolean;
};

export const PrivatePassListItem: React.FC<Props> = ({
  asStandardPass,
  attributes,
  dense,
  divider,
  draggable,
  listeners,
  onClick,
  onDelete,
  onEdit,
  onRestore,
  pass,
  removePaper,
}) => {
  const { t } = useTranslation('privateService');

  const isSharedPass =
    !asStandardPass &&
    (pass.template_instance || pass.linked_payment_pack_template_instance);

  if (!pass) {
    return (
      <ListItem divider={divider}>
        <CircularProgress />
      </ListItem>
    );
  }

  const dateInfo = getValidityInfo(pass, t);

  return (
    <ConditionalWrapper condition={!removePaper} WrapperComponent={Paper}>
      <ListItem
        // @ts-expect-error
        button={!!onClick}
        dense={dense}
        divider={divider}
        onClick={onClick}
      >
        {draggable && (
          <IconButton {...listeners} {...attributes}>
            <DragHandleIcon />
          </IconButton>
        )}
        <ListItemText
          primary={pass.name}
          // @ts-expect-error
          secondary={`${t('privatePass.parameters.nbCredits', {
            count: getCreditsDividedDisplay(pass.credits),
            credits: getCreditsDividedValue(pass.credits),
          })} - ${dateInfo}`}
          style={{ marginLeft: 10 }}
        />
        {!pass.is_usable_by_staff && pass.available && (
          <Tooltip title={t('privatePass.listItem.unusableByStaff')}>
            <IconButton>
              <RemoveShoppingCartIcon />
            </IconButton>
          </Tooltip>
        )}
        {!!pass.linked_payment_pack && (
          <Tooltip title={t('privatePass.form.universalPass.label')}>
            <IconButton onClick={null}>
              <StyleIcon color="inherit" />
            </IconButton>
          </Tooltip>
        )}
        {pass.manager_only && pass.available && (
          <Tooltip title={t('privatePass.form.managerOnly.label')}>
            <IconButton>
              <VisibilityOffIcon />
            </IconButton>
          </Tooltip>
        )}

        <ListItemResponsiveAction
          actions={[
            onEdit && {
              icon: EditIcon,
              label: t('privatePass.edit'),
              color: 'primary',
              onClick: onEdit,
            },
            onDelete &&
              !isSharedPass && {
                icon: DeleteIcon,
                label: t('privatePass.delete.delete'),
                onClick: onDelete,
              },
            // @ts-expect-error
            onRestore &&
              !isSharedPass && {
                icon: RestoreFromTrashIcon,
                color: 'secondary',
                onClick: onRestore,
              },
          ]}
        />
      </ListItem>
    </ConditionalWrapper>
  );
};

export default React.memo(PrivatePassListItem);
