import React from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import FranchiseCompanyChipList from '../../../components/franchise/FranchiseCompanyChipList.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { getValidityInfo } from '../utils';

import { PaymentPackTemplate, PaymentPackTemplateAPI } from '../types';

type Props = {
  paymentPackTemplate: PaymentPackTemplate | PaymentPackTemplateAPI;
  onEdit?: (id: number) => void;
  onClick?: (id: number) => void;
  onRestore?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const PaymentPackTemplateListItem = React.memo((props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const {
    paymentPackTemplate: template,
    onEdit,
    onClick,
    onDelete,
    onRestore,
  } = props;

  const dateInfo = getValidityInfo(template, t);

  const hasCompaniesInfo = 'companies' in template;

  return (
    <ListItem
      divider
      // @ts-expect-error
      button={!!onClick}
      onClick={onClick && (() => onClick(template.id))}
    >
      <ListItemText
        primary={template.name}
        secondary={`${
          !template.unlimited
            ? t('specifications.nbCredits', {
                count: template.credits,
                credits: template.credits,
              })
            : t('specifications.unlimitedCredits')
        } - ${getCurrencyDisplayWithPrice(template.price)}${` - ${dateInfo}`}`}
      />
      {hasCompaniesInfo && (
        //@ts-expect-error
        <FranchiseCompanyChipList companies={template.companies} />
      )}
      {!template.is_usable_by_staff && !template.disabled && (
        <IconButton onClick={null}>
          <Tooltip title={t('listItem.unusableByStaff')}>
            <RemoveShoppingCartIcon />
          </Tooltip>
        </IconButton>
      )}
      {template.manager_only && !template.disabled && (
        <IconButton onClick={null}>
          <Tooltip title={t('form.paymentPack.managerOnly')}>
            <VisibilityOffIcon />
          </Tooltip>
        </IconButton>
      )}
      <ListItemResponsiveAction
        // @ts-expect-error
        actions={
          template.disabled
            ? [
                onRestore && {
                  icon: RestoreFromTrashIcon,
                  label: t('actions.restore'),
                  color: 'primary',
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
                  label: t('actions.edit'),
                  color: 'primary',
                  onClick: () => {
                    onEdit(template.id);
                  },
                },
                onDelete && {
                  icon: DeleteIcon,
                  label: t('actions.delete'),
                  onClick: () => {
                    onDelete(template.id);
                  },
                },
              ]
        }
      />
    </ListItem>
  );
});

export default PaymentPackTemplateListItem;
