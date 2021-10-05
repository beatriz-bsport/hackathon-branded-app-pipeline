import React from 'react';

import {
  ListItem,
  ListItemIcon,
  makeStyles,
  MenuItem,
  Theme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { TFunction } from 'i18next';

import withConfirm from '../../../hocs/with-confirm.hoc';
import { EmailTemplateSummary } from '../../email-editor/types';
import HighlightedText from '../../../components/HighlightedText/HighlightedText.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { FranchiseCompany } from '../types';
import CompanyChip from '../../../components/franchise/CompanyChip.component';

export type OwnProps = {
  email: EmailTemplateSummary;
  selectedId?: number;
  navigateTo: () => void;
  onEdit: () => void;
  onDelete: () => void;
  search?: string;
  withTag?: boolean;
  company: FranchiseCompany;
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

const DeleteButtonMenuItem = (props: { onClick: () => void }) => {
  const { t } = useTranslation(['emailTemplate']);

  return (
    <MenuItem
      onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
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

const ButtonWithConfirm = withConfirm(DeleteButton, 'onClick', {
  title: 'emailTemplate:modal.delete.title',
  cancel: 'emailTemplate:modal.delete.cancel',
  confirm: 'emailTemplate:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('emailTemplate:modal.delete.content')}</p>
  ),
});

const ButtonWithConfirmMenuItem = withConfirm(DeleteButtonMenuItem, 'onClick', {
  title: 'emailTemplate:modal.delete.title',
  cancel: 'emailTemplate:modal.delete.cancel',
  confirm: 'emailTemplate:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('emailTemplate:modal.delete.content')}</p>
  ),
});

const CompanyEmailTemplateListItem = (props: OwnProps) => {
  const {
    email,
    selectedId,
    search,
    withTag,
    company,
    onEdit,
    navigateTo,
    onDelete,
  } = props;
  const classes = useStyles();

  return (
    <ListItem
      button
      onClick={navigateTo}
      selected={email.id === selectedId}
      className={classes.listItem}
      divider
    >
      <div className={classes.innerList}>
        <ListItemText
          primary={
            <Typography component="span" variant="subtitle1">
              <HighlightedText text={email.title} highlight={search} />
            </Typography>
          }
          secondary={
            <HighlightedText text={email.subject} highlight={search} />
          }
        />
        {withTag && <CompanyChip className={classes.chip} company={company} />}
        <div className={classes.actionList}>
          <ListItemResponsiveAction
            actions={[
              {
                icon: EditIcon,
                label: `edit-company-${email.id}`,
                color: 'primary',
                onClick: onEdit,
              },
              {
                icon: DeleteButton,
                iconButtonComponent: ButtonWithConfirm,
                menuItemComponent: ButtonWithConfirmMenuItem,
                label: `delete-company-${email.id}`,
                onClick: onDelete,
                color: 'secondary',
              },
            ]}
          />
        </div>
      </div>
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  innerList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  list: {
    backgroundColor: 'white',
    marginBottom: theme.spacing(2),
    borderRadius: 5,
    boxShadow: theme.shadows[1],
    paddingTop: 0,
    paddingBottom: 0,
  },
  chip: {
    marginRight: theme.spacing(2),
  },
  listItem: {
    padding: theme.spacing(1),
  },
  actionList: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default CompanyEmailTemplateListItem;
