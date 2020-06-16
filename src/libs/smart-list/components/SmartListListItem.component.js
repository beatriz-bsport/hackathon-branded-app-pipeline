// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Tooltip from '../../../components/Tooltip.component';
import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  smartlist: SmartList,
  onClick: (any) => void,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
  onClickDuplicate: (id: number) => void,
};

const ButtonWithConfirm = withConfirm(IconButton, 'onClick', {
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
    >
      <ListItemText primary={props.smartlist.name} />
      <div className={classes.actions}>
        {props.onClickEdit ? (
          <IconButton
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              props.onClickEdit(props.smartlist.id);
            }}
            color="primary"
          >
            <ArrowForwardIcon />
          </IconButton>
        ) : null}
        {props.onClickDuplicate ? (
          <Tooltip title={t('duplicate')} classes={classes} aria-label="info">
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                props.onClickDuplicate(props.smartlist.id);
              }}
              color="primary"
            >
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        {props.onClickDelete ? (
          <ButtonWithConfirm
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              props.onClickDelete(props.smartlist.id);
            }}
            color="secondary"
          >
            <DeleteIcon />
          </ButtonWithConfirm>
        ) : null}
      </div>
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
