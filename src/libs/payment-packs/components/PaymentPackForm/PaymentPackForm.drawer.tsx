import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import type { Establishment } from '#src/libs/establishment/types';
import type { SCT } from '#src/libs/category/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import type {
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
} from '#src/libs/private-service/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import type { OptionCallback } from '../../../../state/types';
import PaymentPackForm, {
  PaymentPackFormStep,
} from './PaymentPackForm.component';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackFormValues,
} from '../../types';
import { MarketingNotification } from '#src/libs/marketing/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type { CompanyTheme } from '#src/libs/theme/types';

type OwnProps = {
  startAtStep?: PaymentPackFormStep;

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

  // Props for the PaymentPackFormNotificationStep component
  enableNotificationStep?: boolean;
  notifications?: MarketingNotification[];
  emailSummariesById?: Record<number, EmailTemplateSummary>;
  emailDetailLoading?: boolean;
  emailDetails?: { [key: string]: EmailTemplateDetail };
  getEmailDetail?: (id: number) => void;
  resolvedGenericTags?: ResolvedGenericTags;
  smartListsById?: { [key: string]: SmartList };
  smartListLoading?: boolean;
  theme?: CompanyTheme;
};
type Props = OwnProps & WithTranslation;
export const PaymentPackFormDrawer = (props: Props) => {
  const {
    t,
    startAtStep,
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
    notifications,
    emailSummariesById,
    emailDetailLoading,
    emailDetails,
    getEmailDetail,
    resolvedGenericTags,
    smartListLoading,
    smartListsById,
    theme,
    enableNotificationStep = false,
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
        emailDetailLoading={emailDetailLoading}
        emailDetails={emailDetails}
        emailSummariesById={emailSummariesById}
        enableNotificationStep={enableNotificationStep}
        getEmailDetail={getEmailDetail}
        // @ts-expect-error
        initial={initial}
        metaActivityList={metaActivityList}
        notifications={notifications}
        onCancelText={onCancelText}
        // @ts-expect-error
        onSubmit={onSubmit}
        paymentPackCategories={paymentPackCategories}
        privateServices={privateServices}
        provincialTax={provincialTax}
        resolvedGenericTags={resolvedGenericTags}
        smartListLoading={smartListLoading}
        smartListsById={smartListsById}
        startAtStep={startAtStep}
        tagList={tagList}
        theme={theme}
      />
    </GenericResponsiveDrawer>
  );
};
export default compose<any, OwnProps>(withTranslation('paymentPack'))(
  PaymentPackFormDrawer,
);
