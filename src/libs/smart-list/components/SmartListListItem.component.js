// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, withTranslation, TFunction } from 'react-i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { MenuItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import withConfirm from '../../../hocs/with-confirm.hoc';

import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';

type Props = {
  smartlist: SmartList,
  onClick: (any) => void,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
  onClickDuplicate: (id: number) => void,
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
const DeleteButtonMenuItem = withTranslation(['smartList'])(
  (props: { onClick: () => void }) => (
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
      <Typography>{props.t('delete')}</Typography>
    </MenuItem>
  ),
);
const ButtonWithConfirm = withConfirm(DeleteButton, 'onClick', {
  title: 'smartList:modal.delete.title',
  cancel: 'smartList:modal.delete.cancel',
  confirm: 'smartList:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('smartList:modal.delete.content')}</p>
  ),
});

const ButtonWithConfirmMenuItem = withConfirm(DeleteButtonMenuItem, 'onClick', {
  title: 'smartList:modal.delete.title',
  cancel: 'smartList:modal.delete.cancel',
  confirm: 'smartList:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('smartList:modal.delete.content')}</p>
  ),
});

export const SmartListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['smartList']);
  return (
    <ListItem
      divider
      button
      selected={props.selected}
      onClick={() => props.onClick(props.smartlist.id)}
      className={classes.listitem}
      style={{ display: 'flex', flexWrap: 'nowrap' }}
    >
      <ListItemText
        primary={
          <span>
            <Typography inline component="span">
              {props.smartlist.name}
            </Typography>
          </span>
        }
      />
      <ListItemResponsiveAction
        actions={[
          props.onClickEdit && {
            icon: ArrowForwardIcon,
            label: t('edit'),
            color: 'primary',
            onClick: () => {
              props.onClickEdit(props.smartlist.id);
            },
          },
          props.onClickDuplicate && {
            icon: FileCopyIcon,
            label: t('duplicate'),
            color: 'primary',
            onClick: () => {
              props.onClickDuplicate(props.smartlist.id);
            },
          },
          props.onClickDelete && {
            iconButtonComponent: ButtonWithConfirm,
            menuItemComponent: ButtonWithConfirmMenuItem,
            onClick: () => {
              props.onClickDelete(props.smartlist.id);
            },
            color: 'secondary',
          },
        ]}
      />
    </ListItem>
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
  },
  actions: { display: 'flex' },
}));

export default SmartListItem;
