// @flow

import React, { useEffect, useCallback, useState } from 'react';
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
import { SmartListCannotBeDeletedDialog } from './SmartListCannotBeDeletedDialog.component';
import type { Cadence } from '../../sequential_marketingDEPRECATED/types';

type Props = {
  smartlist: SmartList,
  onClick: (any) => void,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
  onClickDuplicate: (id: number) => void,
  fetchCadences: (id: number) => void,
  getCadences: (id: number) => Cadence[],
  getCadencesLoading: () => boolean,
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
  title: 'smartList:modal.delete.title',
  cancel: 'smartList:modal.delete.cancel',
  confirm: 'smartList:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('smartList:modal.delete.content')}</p>
  ),
});

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
  const [openCannotBeDeletedDialog, setOpenCannotBeDeletedDialog] =
    useState(false);
  const [previousCadenceLoading, setPreviousCadenceLoading] = useState(
    props.getCadencesLoading(),
  );
  const [smartlistToDelete, setSmartlistToDelete] = useState(null);

  const handleOnClickEdit = useCallback(() => {
    props.onClickEdit(props.smartlist.id);
  }, [props]);

  const handleOnClickDuplicate = useCallback(() => {
    props.onClickDuplicate(props.smartlist.id);
  }, [props]);

  const handleOnClickDelete = useCallback(() => {
    setSmartlistToDelete(props.smartlist.id);
    props.fetchCadences(props.smartlist.id);
  }, [props]);

  const handleCloseCannotBeDeletedDialog = () => {
    setOpenCannotBeDeletedDialog(false);
  };

  useEffect(() => {
    if (
      previousCadenceLoading &&
      !props.getCadencesLoading() &&
      smartlistToDelete === props.smartlist.id
    ) {
      const cadencesUsingSmartlist = props.getCadences(props.smartlist.id);
      if (!!cadencesUsingSmartlist && cadencesUsingSmartlist.length > 0) {
        setOpenCannotBeDeletedDialog(true);
      } else {
        props.onClickDelete(props.smartlist.id);
      }
      setSmartlistToDelete(null);
    }
    setPreviousCadenceLoading(props.getCadencesLoading());
  }, [previousCadenceLoading, props, smartlistToDelete]);

  return (
    <>
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
              onClick: handleOnClickEdit,
            },
            props.onClickDuplicate && {
              icon: FileCopyIcon,
              label: t('duplicate'),
              color: 'primary',
              onClick: handleOnClickDuplicate,
            },
            props.onClickDelete && {
              iconButtonComponent: ButtonWithConfirm,
              menuItemComponent: ButtonWithConfirmMenuItem,
              onClick: handleOnClickDelete,
              color: 'secondary',
            },
          ]}
        />
      </ListItem>
      {!props.getCadencesLoading() && openCannotBeDeletedDialog && (
        <SmartListCannotBeDeletedDialog
          open={openCannotBeDeletedDialog}
          onCancel={handleCloseCannotBeDeletedDialog}
          cadences={props.getCadences(props.smartlist.id)}
        />
      )}
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
  },
  actions: { display: 'flex' },
}));

export default SmartListItem;
