import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { MenuItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import withConfirm from '../../../hocs/with-confirm.hoc';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import type { CustomForm } from '../types';
import {
  CUSTOM_FORM_FIELD_TITLE_OPTION,
  CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
} from '../utils';

type Props = {
  customform: CustomForm;
  onClick?: (item: any) => void;
  onClickEdit?: (id: number) => void;
  onClickDelete?: (id: number) => void;
  selected: boolean;
  onClickDuplicate?: (id: number) => void;
  onRestore?: (id: number) => void;
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
const DeleteButtonMenuItem = withTranslation(['marketing'])(
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
  title: 'marketing:customForm.modal.delete.title',
  cancel: 'marketing:customForm.modal.delete.cancel',
  confirm: 'marketing:customForm.modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('marketing:customForm.modal.delete.content')}</p>
  ),
});

const ButtonWithConfirmMenuItem = withConfirm(DeleteButtonMenuItem, 'onClick', {
  title: 'marketing:customForm.modal.delete.title',
  cancel: 'marketing:customForm.modal.delete.cancel',
  confirm: 'marketing:customForm.modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('marketing:customForm.modal.delete.content')}</p>
  ),
});

export const CustomFormListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['marketing']);
  return (
    <ListItem
      divider
      button
      selected={props.selected}
      onClick={() => props.onClick(props.customform.id)}
      className={classes.listitem}
    >
      <Grid container>
        <Grid item xs={3} className={classes.nameItem}>
          <div>
            <Typography component="span">{props.customform.name}</Typography>
          </div>
        </Grid>
        <Grid item xs={6} className={classes.questionItem}>
          <Typography component="span">
            {
              props.customform?.custom_form_field.filter(
                (field) =>
                  !field.disabled &&
                  ![
                    CUSTOM_FORM_FIELD_TITLE_OPTION,
                    CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
                  ].includes(field.kind),
              ).length
            }
          </Typography>
        </Grid>
        <Grid item xs={3} className={classes.actionItem}>
          <ListItemResponsiveAction
            actions={[
              props.onClickEdit && {
                icon: ArrowForwardIcon,
                label: t('edit'),
                color: 'primary',
                onClick: () => {
                  props.onClickEdit(props.customform.id);
                },
              },
              props.onClickDuplicate && {
                icon: FileCopyIcon,
                label: t('duplicate'),
                color: 'primary',
                onClick: () => {
                  props.onClickDuplicate(props.customform.id);
                },
              },
              props.onClickDelete && {
                iconButtonComponent: ButtonWithConfirm,
                menuItemComponent: ButtonWithConfirmMenuItem,
                onClick: () => {
                  props.onClickDelete(props.customform.id);
                },
                color: 'secondary',
              },
              props.onRestore && {
                icon: RestoreFromTrashIcon,
                label: t('restore'),
                color: 'primary',
                onClick: () => {
                  props.onRestore(props.customform.id);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
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
    alignItems: 'center',
  },
  actions: { display: 'flex' },
  nameItem: {
    display: 'flex',
    alignItems: 'center',
  },
  questionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

export default CustomFormListItem;
