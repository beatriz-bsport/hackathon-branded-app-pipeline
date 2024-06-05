import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import type { Establishment } from '#libs/establishment/types';
import type { SCT } from '#libs/category/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { Tag, TagGroup } from '#libs/tag/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import type {
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
} from '#libs/private-service/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import type { BookkeepingAccount } from '#libs/payment/types';
import type { OptionCallback } from '../../../../state/types';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackFormValues,
} from '../../types';
import PaymentPackForm from './PaymentPackForm.component';

type OwnProps = {
  open: boolean;
  paymentPackCategories: Array<PaymentPackCategory>;
  categoryList: Array<SCT>;
  availableEstablishmentList: Array<Establishment>;
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
  provincialTax: number;
  displayNewCheckoutFlow?: boolean;
  privateServices: Array<PrivateServiceWithSlots>;
  compatibleServicePass: Array<ServiceCompatibilityPass>;
  allowGuestMaster?: boolean;
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
};
type Props = OwnProps & WithTranslation;
export const PaymentPackFormDrawer = (props: Props) => {
  const {
    t,
    open,
    paymentPackCategories,
    categoryList,
    availableEstablishmentList,
    metaActivityList,
    tagList,
    onCancelText,
    provincialTax,
    onSubmit,
    initial,
    clearPaymentPackToEdit,
    closeForm,
    privateServices,
    compatibleServicePass,
    allowGuestMaster,
    displayNewCheckoutFlow,
    bookkeepingAccounts,
    bookkeepingAccountById,
  } = props;

  return (
    <GenericResponsiveDrawer
      onClose={closeForm}
      open={open}
      subtitle={initial?.name || null}
      title={t('addPaymentPack.paymentPack')}
      trackingObjectId={initial?.id}
      trackingObjectIdentifier={
        SegmentAnalyticsFormObjectIdentifier.PaymentPack
      }
    >
      <PaymentPackForm
        isInDrawer
        allowGuestMaster={!!allowGuestMaster}
        availableEstablishmentList={availableEstablishmentList}
        bookkeepingAccountById={bookkeepingAccountById}
        bookkeepingAccounts={bookkeepingAccounts}
        categoryList={categoryList}
        clearPaymentPackToEdit={clearPaymentPackToEdit}
        closeForm={closeForm}
        compatibleServicePass={compatibleServicePass}
        displayNewCheckoutFlow={displayNewCheckoutFlow}
        // @ts-expect-error
        initial={initial}
        metaActivityList={metaActivityList}
        onCancelText={onCancelText}
        // @ts-expect-error
        onSubmit={onSubmit}
        paymentPackCategories={paymentPackCategories}
        privateServices={privateServices}
        provincialTax={provincialTax}
        tagList={tagList}
      />
    </GenericResponsiveDrawer>
  );
};
export default compose<any, OwnProps>(withTranslation('paymentPack'))(
  PaymentPackFormDrawer,
);
