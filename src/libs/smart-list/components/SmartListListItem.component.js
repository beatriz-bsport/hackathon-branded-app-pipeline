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
  isSequentialMarketingAuthorized: boolean,
  fetchCadences: (id: number) => void,
  getCadences: (id: number) => Cadence[],
  cadencesLoading: boolean,
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
  const {
    onClickEdit,
    onClickDuplicate,
    isSequentialMarketingAuthorized,
    fetchCadences,
    onClickDelete,
    getCadences,
    cadencesLoading,
    smartlist,
  } = props;
  const [openCannotBeDeletedDialog, setOpenCannotBeDeletedDialog] =
    useState(false);

  const [previousCadenceLoading, setPreviousCadenceLoading] =
    useState(cadencesLoading);

  const [smartlistToDelete, setSmartlistToDelete] = useState(null);

  const handleOnClickEdit = useCallback(() => {
    onClickEdit(smartlist.id);
  }, [smartlist, onClickEdit]);

  const handleOnClickDuplicate = useCallback(() => {
    onClickDuplicate(smartlist.id);
  }, [smartlist, onClickDuplicate]);

  const handleOnClickDelete = useCallback(() => {
    if (isSequentialMarketingAuthorized) {
      setSmartlistToDelete(smartlist.id);
      fetchCadences(smartlist.id);
    } else {
      onClickDelete(smartlist.id);
    }
  }, [
    isSequentialMarketingAuthorized,
    smartlist.id,
    fetchCadences,
    onClickDelete,
  ]);

  const handleCloseCannotBeDeletedDialog = () => {
    setOpenCannotBeDeletedDialog(false);
  };

  useEffect(() => {
    if (isSequentialMarketingAuthorized) {
      if (
        previousCadenceLoading &&
        !cadencesLoading &&
        smartlistToDelete === smartlist.id
      ) {
        const cadencesUsingSmartlist = getCadences(smartlist.id);
        if (!!cadencesUsingSmartlist && cadencesUsingSmartlist.length > 0) {
          setOpenCannotBeDeletedDialog(true);
        } else {
          onClickDelete(smartlist.id);
        }
        setSmartlistToDelete(null);
      }
      setPreviousCadenceLoading(cadencesLoading);
    }
  }, [
    isSequentialMarketingAuthorized,
    previousCadenceLoading,
    onClickDelete,
    smartlistToDelete,
    getCadences,
    cadencesLoading,
    smartlist,
  ]);

  return (
    <>
      <ListItem
        button
        divider
        className={classes.listitem}
        onClick={() => props.onClick(props.smartlist.id)}
        selected={props.selected}
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
      {isSequentialMarketingAuthorized &&
        !cadencesLoading &&
        openCannotBeDeletedDialog && (
          <SmartListCannotBeDeletedDialog
            cadences={props.getCadences(props.smartlist.id)}
            onCancel={handleCloseCannotBeDeletedDialog}
            open={openCannotBeDeletedDialog}
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
