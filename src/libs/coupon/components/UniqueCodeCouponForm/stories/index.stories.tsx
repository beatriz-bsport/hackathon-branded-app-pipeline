import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Immutable from 'seamless-immutable';

import UniqueCodeCouponFormWithFormik, {
  UniqueCodeCouponForm,
} from '../UniqueCodeCouponForm.component';
import { action } from '@storybook/addon-actions';
import { paymentPackListFactory } from '#libs/payment-packs/factory';
import { PaymentPack } from '#libs/payment-packs/types';
import withFormik from '@bbbtech/storybook-formik';
import ValidationSchema from '../ValidationSchema';
import { PrivatePass } from '#libs/private-service/types';
import { private_services_passes_factory } from '#libs/private-service/factory';
import { paymentComboListFactory } from '#libs/payment-combo/factory';
import { PaymentCombo } from '#libs/payment-combo/types';
import { BUYABLE_ITEM_PASS } from '@bsport/common/lib/master-data/buyable-items';
import { UniqueCodeCouponCreationPayload } from '#libs/coupon/types';

const actionsData = {
  onCancel: action('onCancel'),
};

const fakePaymentPacks: PaymentPack[] = paymentPackListFactory(10, {
  isTemplate: false,
});

const fakeAllPaymentPacksById = fakePaymentPacks.reduce(
  (result: { [key: number]: PaymentPack }, paymentPack) => {
    result[paymentPack.id] = paymentPack;
    return result;
  },
  {},
);

// @ts-ignore
const fakePrivatePasses: PrivatePass[] = private_services_passes_factory(10);

const fakePrivatePassesById = fakePrivatePasses.reduce(
  (result: { [key: number]: PrivatePass }, privatePass) => {
    result[privatePass.id] = privatePass;
    return result;
  },
  {},
);

const fakePaymentCombos = paymentComboListFactory(10) as PaymentCombo[];

const fakePaymentCombosById = fakePaymentCombos.reduce(
  (result: { [key: number]: PaymentCombo }, paymentCombo) => {
    result[paymentCombo.id] = paymentCombo;
    return result;
  },
  {},
);

const initialValues: UniqueCodeCouponCreationPayload = {
  name: '',
  is_active: false,
  only_on_first_checkout: false,
  usage_per_member: 1,
  applies_to: BUYABLE_ITEM_PASS,
  only_on_objects: [],
  expiration_date: '2030/03/16',
  coupon_cost_for_company: null,
  codes: [],
};

const UniqueCodeCouponFormMeta: ComponentMeta<typeof UniqueCodeCouponForm> = {
  title: 'Library/Coupon/UniqueCodeCouponCreateForm',
  component: UniqueCodeCouponFormWithFormik,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues,
      enableReinitialize: true,
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema: ValidationSchema,
      onSubmit: () => {},
    },
  },
  argTypes: {
    onCancel: actionsData.onCancel,
  },
  args: {
    isLoading: false,
    isProcessing: false,
    paymentPacks: fakePaymentPacks,
    paymentPacksById: fakeAllPaymentPacksById,
    shopItems: Immutable([]),
    shopItemsById: {},
    privatePasses: fakePrivatePasses,
    privatePassesById: fakePrivatePassesById,
    paymentCombos: fakePaymentCombos,
    paymentCombosById: fakePaymentCombosById,
  },
};

export default UniqueCodeCouponFormMeta;

const Template: ComponentStory<typeof UniqueCodeCouponForm> = (args) => {
  const [withExpirationDate, setWithExpirationDate] = useState(false);
  const [isUsagePerMemberLimited, setIsUsagePerMemberLimited] = useState(false);
  return (
    <UniqueCodeCouponForm
      {...args}
      withExpirationDate={withExpirationDate}
      setWithExpirationDate={setWithExpirationDate}
      isUsagePerMemberLimited={isUsagePerMemberLimited}
      setIsUsagePerMemberLimited={setIsUsagePerMemberLimited}
    />
  );
};

export const EmptyForm = Template.bind({});
