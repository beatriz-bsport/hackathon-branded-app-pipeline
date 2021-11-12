import React from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Chip from '@material-ui/core/Chip';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { getValidityInfo } from '../utils';

import CompanyChip from '../../../components/franchise/CompanyChip.component';
import FranchiseCompaniesListingTooltip from '../../franchise/components/FranchiseCompaniesListingTooltip.component';
import { PaymentPackTemplate } from '../types';

type Props = {
  paymentPackTemplate: PaymentPackTemplate;
  onEdit?: (id: number) => void;
  onClick?: (id: number) => void;
  onRestore?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const PaymentPackTemplateListItem = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
  const {
    paymentPackTemplate: template,
    onEdit,
    onClick,
    onDelete,
    onRestore,
  } = props;

  const dateInfo = getValidityInfo(template, t);

  return (
    <ListItem
      button={!!onClick}
      divider
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
      {template.payment_pack_template_instances.length > 0 && (
        <>
          {template.companies
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
          {template.length > 2 && (
            <FranchiseCompaniesListingTooltip
              companies={template.companies.slice(2)}
            >
              <Chip variant="outlined" color="primary" label={t('seeAll')} />
            </FranchiseCompaniesListingTooltip>
          )}
        </>
      )}
      {template.manager_only && !template.disabled && (
        <IconButton onClick={null}>
          <Tooltip title={t('form.paymentPack.managerOnly')}>
            <VisibilityOffIcon />
          </Tooltip>
        </IconButton>
      )}
      <ListItemResponsiveAction
        actions={
          template.disabled
            ? [
                onRestore && {
                  icon: EditIcon,
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
};

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
}));

export default PaymentPackTemplateListItem;
