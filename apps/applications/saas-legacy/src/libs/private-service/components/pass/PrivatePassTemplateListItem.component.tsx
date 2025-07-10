import React from 'react';

import { useTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import ListItemResponsiveAction from '../../../../components/button/ListItemResponsiveAction.component';
import FranchiseCompanyChipList from '../../../../components/franchise/FranchiseCompanyChipList.component';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import { getValidityInfo } from '../../utils';

import { PrivatePassTemplate } from '../../types';

type Props = {
  privatePassTemplate: PrivatePassTemplate;
  onEdit?: (id: number) => void;
  onClick?: (id: number) => void;
  onRestore?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const PrivatePassTemplateListItem = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  const {
    privatePassTemplate: template,
    onEdit,
    onClick,
    onDelete,
    onRestore,
  } = props;

  const dateInfo = getValidityInfo(template, t);

  return (
    <ListItem
      divider
      // @ts-expect-error
      button={!!onClick}
      onClick={onClick && (() => onClick(template.id))}
    >
      <ListItemText
        primary={template.name}
        secondary={`${t('privatePass.parameters.nbCredits', {
          count: template.credits,
          credits: template.credits,
        })} - ${getCurrencyDisplayWithPrice(
          template.price,
        )}${` - ${dateInfo}`}`}
      />
      {!template.disabled && (
        <>
          {/* @ts-expect-error */}
          <FranchiseCompanyChipList companies={template.companies} />
          {!template.is_usable_by_staff && (
            <IconButton>
              <Tooltip title={t('privatePass.listItem.unusableByStaff') ?? ''}>
                <RemoveShoppingCartIcon />
              </Tooltip>
            </IconButton>
          )}
          {template.manager_only && (
            <IconButton>
              <Tooltip title={t('privatePass.parameters.managerOnly') ?? ''}>
                <VisibilityOffIcon />
              </Tooltip>
            </IconButton>
          )}
        </>
      )}

      <ListItemResponsiveAction
        // @ts-expect-error
        actions={
          template.disabled
            ? [
                onRestore && {
                  icon: RestoreFromTrashIcon,
                  label: t('privatePass.actions.restore'),
                  onClick: () => {
                    onRestore(template.id);
                  },
                },
              ]
            : [
                onClick && {
                  icon: ArrowForwardIcon,
                  color: 'primary',
                  onClick: () => {
                    onClick(template.id);
                  },
                },
                onEdit && {
                  icon: EditIcon,
                  label: t('privatePass.actions.edit'),
                  color: 'primary',
                  onClick: () => {
                    onEdit(template.id);
                  },
                },
                onDelete && {
                  icon: DeleteIcon,
                  label: t('privatePass.actions.delete'),
                  onClick: () => {
                    onDelete(template.id);
                  },
                },
              ]
        }
      />
    </ListItem>
  );
};

export default PrivatePassTemplateListItem;
