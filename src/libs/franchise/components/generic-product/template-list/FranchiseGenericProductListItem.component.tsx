// @ts-nocheck
import React from 'react';
import { pure } from 'recompose';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core';
import {
  ArrowForward,
  Edit,
  Delete,
  VisibilityOff,
  RestoreFromTrash,
} from '@material-ui/icons';
import { TFunction } from 'i18next';
import ListItemResponsiveAction from '#components/button/ListItemResponsiveAction.component';
import FranchiseCompanyChipList from '#components/franchise/FranchiseCompanyChipList.component';
import { FranchiseCompany } from '#libs/franchise/types';
import Tooltip from '#components/Tooltip.component';

type Props = {
  id: number;
  companies: FranchiseCompany[];
  cover?: string;
  withCover?: boolean;
  primaryText: string;
  secondaryText: string;
  manager_only?: boolean;
  onEdit?: (templateId: number) => void;
  onDelete?: (templateId: number) => void;
  onRestore?: (templateId: number) => void;
  onClick?: (templateId: number) => void;
  selected?: boolean;
  isFocused?: boolean;
  t: TFunction;
};

const FranchiseGenericProductListItem = (props: Props) => {
  const {
    id,
    companies,
    cover,
    withCover,
    primaryText,
    secondaryText,
    manager_only,
    onEdit,
    onDelete,
    onRestore,
    onClick,
    selected,
    isFocused,
    t,
  } = props;
  const classes = useStyles();
  return (
    <ListItem
      divider
      selected={!!selected}
      // @ts-ignore
      button={!!onClick}
      onClick={() => onClick && onClick(id)}
      style={isFocused ? { backgroundColor: '#EFEFEF' } : {}}
    >
      {withCover && (
        <ListItemAvatar>
          <Avatar src={cover} alt="" />
        </ListItemAvatar>
      )}
      <ListItemText primary={primaryText} secondary={secondaryText} />
      <FranchiseCompanyChipList companies={companies} />
      {manager_only && (
        <div className={classes.visibility}>
          <Tooltip title={t('genericProduct.list.visibility')}>
            <ListItemIcon>
              <VisibilityOff />
            </ListItemIcon>
          </Tooltip>
        </div>
      )}
      <ListItemResponsiveAction
        actions={[
          {
            icon: ArrowForward,
            label: t('genericProduct.list.shortMenu.goTo'),
            color: 'primary',
            onClick: onClick ? () => onClick(id) : null,
          },
          {
            icon: Edit,
            label: t('genericProduct.list.shortMenu.edit'),
            color: 'primary',
            onClick: onEdit ? () => onEdit(id) : null,
          },
          {
            icon: Delete,
            label: t('genericProduct.list.shortMenu.delete'),
            onClick: onDelete ? () => onDelete(id) : null,
          },
          {
            icon: RestoreFromTrash,
            label: t('genericProduct.list.shortMenu.restore'),
            onClick: onRestore ? () => onRestore(id) : null,
          },
        ]}
      />
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  visibility: {
    minWidth: 0,
    marginLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
}));

export default pure(FranchiseGenericProductListItem);
