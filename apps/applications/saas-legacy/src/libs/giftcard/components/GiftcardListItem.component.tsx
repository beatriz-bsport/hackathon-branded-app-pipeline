import React from 'react';
import { useTranslation } from 'react-i18next';
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

import ListItemResponsiveAction from '#src/components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type { OptionCallback } from '#src/state/types';

import { GIFTCARD_TYPES } from '../constants';
import type { Giftcard } from '../types';

type Props = {
  giftcard: Giftcard;
  divider?: boolean;
  disabled?: boolean;
  onDuplicate?: (id: number) => void;
  onEdit?: (id: number) => void;
  onRemove?: (id: number, options?: OptionCallback<void>) => void;
  onRestore?: (id: number) => void;
  onClick?: (id: number) => void;
  selected?: boolean;
  isFocused?: boolean;
};

export default function GiftcardListItem(props: Props) {
  const {
    giftcard,
    divider,
    disabled,
    onDuplicate,
    onEdit,
    onRemove,
    onRestore,
    onClick,
    selected,
    isFocused,
  } = props;

  const { t } = useTranslation(['giftcard', 'b2b_giftcard']);

  const managerOnlyTooltip = t('list.visibility', { ns: 'giftcard' });

  const expirationMessage = giftcard.expiration_days
    ? t('list.validity', { ns: 'giftcard', duration: giftcard.expiration_days })
    : t('list.unlimited', { ns: 'giftcard' });

  const priceMessage =
    giftcard.card_type === GIFTCARD_TYPES.CUSTOM || !giftcard.price
      ? t('giftcardFreeAmount.customAmount', { ns: 'b2b_giftcard' })
      : getCurrencyDisplayWithPrice(giftcard.price);

  return (
    <>
      <ListItem
        // @ts-expect-error
        button={!!onClick}
        disabled={disabled}
        divider={divider}
        onClick={() => onClick && onClick(giftcard.id)}
        selected={!!selected}
        style={isFocused ? { backgroundColor: '#EFEFEF' } : {}}
      >
        <ListItemAvatar>
          <Avatar alt={giftcard.name} src={giftcard.cover} />
        </ListItemAvatar>

        <ListItemText
          primary={giftcard.name}
          secondary={`${priceMessage} - ${expirationMessage}`}
        />

        {giftcard.manager_only ? (
          <Tooltip title={managerOnlyTooltip}>
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
              onClick: onDuplicate ? () => onDuplicate(giftcard.id) : undefined,
            },
            {
              icon: EditIcon,
              label: 'edit',
              color: 'primary',
              onClick: onEdit ? () => onEdit(giftcard.id) : undefined,
            },
            {
              icon: DeleteIcon,
              label: 'delete',
              onClick: onRemove ? () => onRemove(giftcard.id) : undefined,
            },
            {
              icon: RestoreFromTrashIcon,
              label: 'restore',
              onClick: onRestore ? () => onRestore(giftcard.id) : undefined,
            },
          ]}
        />
      </ListItem>
    </>
  );
}
