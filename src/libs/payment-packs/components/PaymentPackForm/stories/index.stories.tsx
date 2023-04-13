import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FactoryBotPaymentPackCategories from '../../../../payment-packs/factory';
import FactoryBotEstablishment from '../../../../establishment/factories/Establishments';
import FactoryBotTag from '../../../../tag/factory';
import { factory_scts } from '../../../../category/factory';
import { meta_activity_factory } from '../../../../meta-activity/factory';
import { private_services_factory } from '#libs/private-service/factory';

import { newStoryFromTemplate } from '../../../../../utils/storybookHelper';

import PaymentPackForm from '../PaymentPackForm.component';

import { Establishment } from '#libs/establishment/types';

const randomPaymentPackCategorieList =
  FactoryBotPaymentPackCategories.PaymentPackCategory.create(2);
const randomSCT = factory_scts(5);
const randomEstablishments: Establishment[] =
  FactoryBotEstablishment.Establishment.create(5);
const randomMetaActivity = meta_activity_factory(5);
const randomTagList = FactoryBotTag.Tag.create(5);
const privateServices = private_services_factory(3);

const actionsData = {
  onSubmit: action('onSubmit'),
  onCancel: action('onCancel'),
};

export default {
  title: 'library/PaymentPack/Payment Pack Form',
  component: PaymentPackForm,
  argTypes: {
    onSubmit: actionsData.onSubmit,
    onCancel: actionsData.onCancel,
  },
  args: {
    open: true,
    paymentPackCategories: randomPaymentPackCategorieList,
    categoryList: randomSCT,
    availableEstablishmentList: randomEstablishments,
    metaActivityList: randomMetaActivity,
    tagList: randomTagList,
    privateServices: privateServices,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '50%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof PaymentPackForm>;

const PaymentPackFormTemplate: ComponentStory<typeof PaymentPackForm> = (
  args,
) => <PaymentPackForm {...args} />;

export const EmptyForm = newStoryFromTemplate(PaymentPackFormTemplate);
