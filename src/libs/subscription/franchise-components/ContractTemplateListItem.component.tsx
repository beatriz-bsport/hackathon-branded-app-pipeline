import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';

import type { ContractTemplate } from '#src/libs/subscription/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import FranchiseCompanyChipList from '#src/components/franchise/FranchiseCompanyChipList.component';

type Props = {
  contractTemplate: ContractTemplate;
  paymentPackTemplateName: string;
  privatePassTemplateName: string;
  getFranchiseCompanyListById: (id__in: number[]) => FranchiseCompany[];
  onDelete?: (event: React.MouseEvent<HTMLElement>) => void;
  onEdit?: (event: React.MouseEvent<HTMLElement>) => void;
  onClick?: () => void;
  onRestore?: (event: React.MouseEvent<HTMLElement>) => void;
  selected?: boolean;
  dense?: boolean;
};

const ContractTemplateListItem: React.FC<Props> = ({
  contractTemplate,
  paymentPackTemplateName,
  privatePassTemplateName,
  getFranchiseCompanyListById,
  onDelete,
  onEdit,
  onClick,
  onRestore,
  selected,
  dense,
}) => {
  const { t } = useTranslation('subscription');
  const tooltipClasses = useTooltipStyles();

  const franchiseCompanies = getFranchiseCompanyListById(
    contractTemplate.companies,
  );

  const contractTemplateListItemTitle = useMemo(() => {
    let title = `${contractTemplate.name} - ${getCurrencyDisplayWithPrice(
      contractTemplate.recurrent_price,
    )}`;
    if (contractTemplate.flat_fee) {
      title += ` (+${getCurrencyDisplayWithPrice(contractTemplate.flat_fee)})`;
    }
    return title;
  }, [
    contractTemplate.name,
    contractTemplate.recurrent_price,
    contractTemplate.flat_fee,
  ]);

  const contractTemplateListItemSubtitle = useMemo(() => {
    let subtitle = `${
      paymentPackTemplateName || privatePassTemplateName || ''
    } - ${t('contract.duration', {
      month: contractTemplate.nb_interval,
    })}`;
    if (contractTemplate.auto_renewal) {
      subtitle += ` [${t('contract.autoRenewal')}]`;
    }
    return subtitle;
  }, [
    paymentPackTemplateName,
    privatePassTemplateName,
    contractTemplate.nb_interval,
    contractTemplate.auto_renewal,
    t,
  ]);

  return (
    <ListItem
      // @ts-expect-error
      button={!!onClick}
      dense={dense}
      id={`contract-template#${contractTemplate.id}`}
      onClick={!!onClick && onClick}
      selected={selected}
    >
      <ListItemText
        primary={contractTemplateListItemTitle}
        secondary={contractTemplateListItemSubtitle}
      />

      <FranchiseCompanyChipList companies={franchiseCompanies} />
      {!contractTemplate.is_usable_by_staff && !contractTemplate.disabled && (
        <Tooltip classes={tooltipClasses} title={t('invisibleForStaffToolTip')}>
          <IconButton>
            <VisibilityOff />
          </IconButton>
        </Tooltip>
      )}
      {contractTemplate.manager_only && !contractTemplate.disabled && (
        <Tooltip
          classes={tooltipClasses}
          title={t('contract.form.managerOnly.label')}
        >
          <IconButton>
            <RemoveShoppingCartIcon />
          </IconButton>
        </Tooltip>
      )}
      {!!onEdit && (
        <Tooltip classes={tooltipClasses} title={t('subscription.edit')}>
          <IconButton color="primary" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
      {!!onDelete && (
        <Tooltip classes={tooltipClasses} title={t('subscription.delete')}>
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      {!!onRestore && (
        <Tooltip
          classes={tooltipClasses}
          title={t('contractTemplate.icons.restore')}
        >
          <IconButton onClick={onRestore}>
            <RestoreFromTrashIcon />
          </IconButton>
        </Tooltip>
      )}
    </ListItem>
  );
};

const useTooltipStyles = makeStyles((theme) => ({
  tooltip: {
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
  },
}));

export default React.memo(ContractTemplateListItem);
