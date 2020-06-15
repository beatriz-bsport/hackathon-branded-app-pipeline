// @flow

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '../../../components/Tooltip.component';

import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  email_template: EmailTemplate,
  onClick: (any) => void,
  onClickDuplicate: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
  onClickEdit: (id: number) => void,
};

const ButtonWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'emailTemplate:modal.delete.title',
  cancel: 'emailTemplate:modal.delete.cancel',
  confirm: 'emailTemplate:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('emailTemplate:modal.delete.content')}</p>
  ),
});

export const EmailCard = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['emailTemplate']);
  return (
    <ListItem
      divider
      button
      dense
      className={classes.listitem}
      selected={props.selected}
      onClick={() => props.onClick(props.email_template.id)}
    >
      <ListItemText
        primary={
          <Typography component="span" variant="subtitle1">
            {props.email_template.title}
          </Typography>
        }
        secondary={props.email_template.subject || t('no_subject')}
      />
      <div className={classes.actions}>
        {props.onClickEdit ? (
          <IconButton
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              props.onClickEdit(props.email_template.id);
            }}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        ) : null}
        {props.onClickDuplicate && (
          <Tooltip title={t('duplicate')} aria-label="info">
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                props.onClickDuplicate(props.email_template.id);
              }}
              color="primary"
            >
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        )}
        {props.onClickDelete && (
          <ButtonWithConfirm
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              props.onClickDelete(props.email_template.id);
            }}
            color="secondary"
          >
            <DeleteIcon />
          </ButtonWithConfirm>
        )}
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

export default EmailCard;
