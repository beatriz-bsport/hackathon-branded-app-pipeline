import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import type { Establishment } from '#libs/establishment/types';
import PaymentPackForm from './PaymentPackForm.component';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackFormValues,
} from '../../types';
import type { SCT } from '#libs/category/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { Tag, TagGroup } from '#libs/tag/types';
import type { OptionCallback } from '../../../../state/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

type OwnProps = {
  open: boolean;
  paymentPackCategories: Array<PaymentPackCategory>;
  categoryList: Array<SCT>;
  establishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
  tagList: Array<Tag<TagGroup>>;
  onCancelText?: string;
  onSubmit: (
    data: PaymentPackFormValues,
    options: OptionCallback<PaymentPack>,
  ) => void;
  initial?: PaymentPack;
  clearPaymentPackToEdit?: () => void;
  closeForm?: () => void;
};
type Props = OwnProps & WithTranslation;
export const PaymentPackFormDrawer = (props: Props) => {
  const {
    t,
    open,
    paymentPackCategories,
    categoryList,
    establishmentList,
    metaActivityList,
    tagList,
    onCancelText,
    onSubmit,
    initial,
    clearPaymentPackToEdit,
    closeForm,
  } = props;
  return (
    <GenericResponsiveDrawer
      open={open}
      onClose={closeForm}
      title={t('addPaymentPack.paymentPack')}
      subtitle={initial?.name || null}
    >
      <PaymentPackForm
        paymentPackCategories={paymentPackCategories}
        categoryList={categoryList}
        establishmentList={establishmentList}
        metaActivityList={metaActivityList}
        tagList={tagList}
        initial={initial}
        onCancelText={onCancelText}
        onSubmit={onSubmit}
        clearPaymentPackToEdit={clearPaymentPackToEdit}
        closeForm={closeForm}
      />
    </GenericResponsiveDrawer>
  );
};
export default compose<any, OwnProps>(withTranslation('paymentPack'))(
  PaymentPackFormDrawer,
);
