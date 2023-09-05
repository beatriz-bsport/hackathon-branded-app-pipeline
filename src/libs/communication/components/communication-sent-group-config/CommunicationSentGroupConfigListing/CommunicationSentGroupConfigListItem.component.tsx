import React, { useCallback } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { MenuItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import type { ImmutableObject } from 'seamless-immutable';
// @ts-expect-error
import withConfirm from '../../../../../hocs/with-confirm.hoc';

import ListItemResponsiveAction from '../../../../../components/button/ListItemResponsiveAction.component';
import type { CommunicationSentGroupConfig } from '#libs/communication//types';

type Props = {
  communicationSentGroupConfig: ImmutableObject<CommunicationSentGroupConfig>;
  onClick: (arg: any) => void;
  onClickEdit: (id: number) => void;
  onClickDelete: (id: number) => void;
  selected: boolean;
  onClickDuplicate: (id: number) => void;
};

const DeleteButton = (props: { onClick: () => void }) => (
  <IconButton
    onClick={(ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      props.onClick();
    }}
  >
    <DeleteIcon />
  </IconButton>
);

const ButtonWithConfirm = withConfirm(DeleteButton, 'onClick', {
  title: 'campaign:modal.delete.title',
  cancel: 'campaign:modal.delete.cancel',
  confirm: 'campaign:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('campaign:modal.delete.content')}</p>
  ),
});

const DeleteButtonMenuItem = (props: { onClick: () => void }) => {
  const { t } = useTranslation('campaign');
  return (
    <MenuItem
      onClick={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        props.onClick();
      }}
    >
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <Typography>{t('delete')}</Typography>
    </MenuItem>
  );
};

const ButtonWithConfirmMenuItem = withConfirm(DeleteButtonMenuItem, 'onClick', {
  title: 'campaign:modal.delete.title',
  cancel: 'campaign:modal.delete.cancel',
  confirm: 'campaign:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('campaign:modal.delete.content')}</p>
  ),
});

export const CommunicationSentGroupConfigListItem: React.FC<Props> = ({
  onClick,
  onClickEdit,
  onClickDuplicate,
  onClickDelete,
  communicationSentGroupConfig,
  selected,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['campaign']);

  const handleOnClickEdit = useCallback(() => {
    onClickEdit(communicationSentGroupConfig.id);
  }, [communicationSentGroupConfig, onClickEdit]);

  const handleOnClickDuplicate = useCallback(() => {
    onClickDuplicate(communicationSentGroupConfig.id);
  }, [communicationSentGroupConfig, onClickDuplicate]);

  const handleOnClickDelete = useCallback(() => {
    onClickDelete(communicationSentGroupConfig.id);
  }, [communicationSentGroupConfig.id, onClickDelete]);

  const handleOnClick = useCallback(
    () => onClick(communicationSentGroupConfig.id),
    [communicationSentGroupConfig.id, onClick],
  );
  return (
    <>
      <ListItem
        button
        divider
        className={classes.listitem}
        onClick={handleOnClick}
        selected={selected}
      >
        <ListItemText
          primary={
            <span>
              <Typography component="span">
                {communicationSentGroupConfig.name}
              </Typography>
            </span>
          }
        />
        <ListItemResponsiveAction
          actions={[
            onClickEdit && {
              icon: ArrowForwardIcon,
              label: t('edit'),
              color: 'primary',
              onClick: handleOnClickEdit,
            },
            onClickDuplicate && {
              icon: FileCopyIcon,
              label: t('duplicate'),
              color: 'primary',
              onClick: handleOnClickDuplicate,
            },
            onClickDelete && {
              iconButtonComponent: ButtonWithConfirm,
              menuItemComponent: ButtonWithConfirmMenuItem,
              onClick: handleOnClickDelete,
              color: 'secondary',
              label: t('delete'),
            },
          ]}
        />
      </ListItem>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    fontSize: 11,
  },
  listitem: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  actions: { display: 'flex' },
}));

export default React.memo(CommunicationSentGroupConfigListItem);
