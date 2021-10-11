import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import RedButton from '../../../components/button/RedButton.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Giftcard } from '../types';

type Props = {
  giftcard: Giftcard;
  divider?: boolean;
  onDuplicate?: (id: number) => void;
  onEdit?: (id: number) => void;
  onRemove?: (id: number) => void;
  onRestore?: (id: number) => void;
  onClick?: (id: number) => void;
  selected?: boolean;
  isFocused?: boolean;
};

export default function GiftcardListItem(props: Props) {
  const {
    giftcard,
    divider,
    onDuplicate,
    onEdit,
    onRemove,
    onRestore,
    onClick,
    selected,
    isFocused,
  } = props;
  const { t } = useTranslation(['giftcard']);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = React.useState(false);
  return (
    <ListItem
      divider={divider}
      selected={!!selected}
      button={!!onClick}
      onClick={() => onClick && onClick(giftcard.id)}
      style={isFocused ? { backgroundColor: '#EFEFEF' } : {}}
    >
      <ListItemAvatar>
        <Avatar src={giftcard.cover} alt="" />
      </ListItemAvatar>
      <ListItemText
        primary={giftcard.name}
        secondary={`${getCurrencyDisplayWithPrice(giftcard.price)} - ${
          giftcard.expiration_days
            ? t('list.validity', { duration: giftcard.expiration_days })
            : t('list.unlimited')
        }`}
      />
      {giftcard.manager_only ? (
        <Tooltip title={t('list.visibility')}>
          <ListItemIcon>
            <VisibilityOffIcon />
          </ListItemIcon>
        </Tooltip>
      ) : null}
      <ListItemResponsiveAction
        actions={[
          {
            icon: FileCopyIcon,
            label: 'duplicate',
            color: 'primary',
            onClick: onDuplicate ? () => onDuplicate(giftcard.id) : null,
          },
          {
            icon: EditIcon,
            label: 'edit',
            color: 'primary',
            onClick: onEdit ? () => onEdit(giftcard.id) : null,
          },
          {
            icon: DeleteIcon,
            label: 'delete',
            onClick: onRemove ? () => setIsOpenDeleteDialog(true) : null,
          },
          {
            icon: RestoreFromTrashIcon,
            label: 'restore',
            onClick: onRestore ? () => onRestore(giftcard.id) : null,
          },
        ]}
      />
      {isOpenDeleteDialog && (
        <Dialog open>
          <DialogTitle>{t('giftcard.delete.dialog.title')}</DialogTitle>
          <DialogContent>{t('giftcard.delete.dialog.content')}</DialogContent>
          <DialogActions>
            <Button onClick={() => setIsOpenDeleteDialog(false)}>
              {t('giftcard.delete.dialog.actions.close')}
            </Button>
            <RedButton
              onClick={() => {
                props.onRemove(giftcard.id);
                setIsOpenDeleteDialog(false);
              }}
            >
              {t('giftcard.delete.dialog.actions.delete')}
            </RedButton>
          </DialogActions>
        </Dialog>
      )}
    </ListItem>
  );
}
