import React from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { VOUCHER_TYPE_PERCENT } from '@bsport/common/lib/master-data/coupon';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import FranchiseCompanyChipList from '../../../components/franchise/FranchiseCompanyChipList.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import { CouponTemplate } from '../types';

type Props = {
  couponTemplate: CouponTemplate;
  onEdit?: (id: number) => void;
  onClick?: (id: number) => void;
  onRestore?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const CouponTemplateListItem = React.memo(
  ({
    couponTemplate: template,
    onEdit,
    onClick,
    onDelete,
    onRestore,
  }: Props) => {
    const { t } = useTranslation('paymentPack');

    const renderSecondaryText = (couponTemplate: CouponTemplate) => {
      switch (couponTemplate.voucher_type) {
        case VOUCHER_TYPE_PERCENT:
          return `${couponTemplate.percent_off}%`;
        default:
          return `${getCurrencyDisplayWithPrice(couponTemplate.amount_off)}`;
      }
    };

    return (
      <ListItem
        button={!!onClick}
        divider
        onClick={onClick && (() => onClick(template.id))}
      >
        <ListItemText
          primary={`${template.name} (${template.nb_discounts})`}
          secondary={renderSecondaryText(template)}
        />
        <FranchiseCompanyChipList companies={template.companies} />
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
  },
);

export default CouponTemplateListItem;
