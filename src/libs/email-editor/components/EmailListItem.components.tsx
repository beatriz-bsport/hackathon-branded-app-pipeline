import React from 'react';

import {
  Chip,
  ListItem,
  ListItemIcon,
  makeStyles,
  MenuItem,
  Theme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { TFunction } from 'i18next';

import withConfirm from '../../../hocs/with-confirm.hoc';
import { EmailTemplateSummary } from '../types';
import HighlightedText from '../../../components/HighlightedText/HighlightedText.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { FranchiseCompany } from '../../franchise/types';
import CompanyChip from '../../../components/franchise/CompanyChip.component';
import FranchiseCompaniesListingTooltip from '../../franchise/components/FranchiseCompaniesListingTooltip.component';

export type OwnProps = {
  email: EmailTemplateSummary;
  selectedId?: number;
  navigateTo: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  search?: string;
  companies?: FranchiseCompany[];
  allCompanies?: boolean;
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

const EmailListItem = (props: OwnProps) => {
  const {
    email,
    selectedId,
    onEdit,
    onDuplicate,
    navigateTo,
    onDelete,
    companies,
    allCompanies,
    search,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation(['emailTemplate']);

  if (!email) return null;
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
        {companies?.length > 0 && !allCompanies && (
          <>
            {companies
              .slice(0, 2)
              .map(
                (company) =>
                  company && (
                    <CompanyChip
                      key={company.id}
                      className={classes.chip}
                      company={company}
                    />
                  ),
              )}
            {companies.length > 2 && (
              <FranchiseCompaniesListingTooltip companies={companies.slice(2)}>
                <Chip variant="outlined" color="primary" label={t('seeAll')} />
              </FranchiseCompaniesListingTooltip>
            )}
          </>
        )}
        {allCompanies && (
          <FranchiseCompaniesListingTooltip companies={companies}>
            <Chip color="primary" label={t('allCompanies')} />
          </FranchiseCompaniesListingTooltip>
        )}
        <div className={classes.actionList}>
          <ListItemResponsiveAction
            actions={[
              onEdit && {
                icon: EditIcon,
                label: `edit-${email.id}`,
                color: 'primary',
                onClick: onEdit,
              },
              onDuplicate && {
                icon: FileCopyIcon,
                label: `duplicate-${email.id}`,
                color: 'primary',
                onClick: onDuplicate,
              },
              onDelete && {
                icon: DeleteButton,
                iconButtonComponent: ButtonWithConfirm,
                menuItemComponent: ButtonWithConfirmMenuItem,
                label: `delete-${email.id}`,
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
    marginRight: theme.spacing(1),
  },
  listItem: {
    padding: theme.spacing(1),
  },
  actionList: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default EmailListItem;
