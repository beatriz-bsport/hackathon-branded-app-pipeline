import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';

import PaymentPackCategoryItemWithPaymentPack from './PaymentPackCategoryItemWithPaymentPack.component';
import type { PaymentPack, PaymentPackCategory } from '../../types';
import { MaterialStyleType } from '../../../../utils/types';

interface PaymentPackByCategory {
  id: number;
  name: string;
  company_id: number;
  publicPacks: Array<PaymentPack>;
  managerPacks: Array<PaymentPack>;
}

interface PaymentPackByUnCategorized {
  publicPacks: Array<PaymentPack>;
  managerPacks: Array<PaymentPack>;
}

type OwnProps = {
  paymentPackByCategory: Array<PaymentPackByCategory>;
  paymentPackUnCategorized: PaymentPackByUnCategorized;
  onEdit: (pp: PaymentPack) => void;
  onDelete: (pp: PaymentPack) => void;
  onClick: (ppId: number) => void;
  onRestore: (ppId: number) => void;
  setSelectedCategory: (category: PaymentPackCategory) => void;
  showCategoryEditDialog: () => void;
  deletePaymentPackCategory: (category: PaymentPackCategory) => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const PaymentPackListByCategory = (props: Props) => {
  const { paymentPackUnCategorized, paymentPackByCategory } = props;

  return (
    <>
      <PaymentPackCategoryItemWithPaymentPack
        paymentPackUnCategorized={paymentPackUnCategorized}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onClick={props.onClick}
        onRestore={props.onRestore}
      />
      {paymentPackByCategory &&
        paymentPackByCategory.map((cat: PaymentPackByCategory) => (
          <PaymentPackCategoryItemWithPaymentPack
            paymentPackCategory={cat}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
            onClick={props.onClick}
            onRestore={props.onRestore}
            setSelectedCategory={props.setSelectedCategory}
            showCategoryEditDialog={props.showCategoryEditDialog}
            deletePaymentPackCategory={props.deletePaymentPackCategory}
          />
        ))}
    </>
  );
};
const styles = (theme: Theme) => ({
  titleContainer: {
    marginBottom: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('paymentPack'),
  withStyles(styles),
)(PaymentPackListByCategory);
