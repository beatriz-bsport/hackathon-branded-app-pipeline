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

import {
  emptyFormRenderingTest,
  generalSectionRenderingTest,
  validitySectionRenderingTest,
  restrictionsSectionRenderingTest,
  advancedOptionsSectionRenderingTest,
} from './rendering-tests';

import {
  generalSectionRenderingInteractionTests,
  validitySectionRenderingInteractionTests,
  restrictionsSectionRenderingInteractionTests,
  advancedSectionRenderingInteractionTests,
} from './rendering-interaction-tests';

import {
  generalSectionInteractionTests,
  validitySectionInteractionTests,
} from './interaction-tests';

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

// The purpose of these tests is to check that all the elements of the form are rendered correctly
export const EmptyFormRenderingTest = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
EmptyFormRenderingTest.play = emptyFormRenderingTest;

export const GeneralSectionRenderingTest = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
GeneralSectionRenderingTest.play = generalSectionRenderingTest;

export const ValiditySectionRenderingTest = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
ValiditySectionRenderingTest.play = validitySectionRenderingTest;

export const RestrictionsSectionRenderingTest = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
RestrictionsSectionRenderingTest.play = restrictionsSectionRenderingTest;

export const AdvancedOptionsSectionRenderingTest = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
AdvancedOptionsSectionRenderingTest.play = advancedOptionsSectionRenderingTest;

// Rendering Interaction Tests
// The purpose of these tests is to mimic user behavior and check that hidden fields / elements are rendered

export const GeneralSectionRenderingInteractionTests = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
GeneralSectionRenderingInteractionTests.play =
  generalSectionRenderingInteractionTests;

export const ValiditySectionRenderingInteractionTests = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
ValiditySectionRenderingInteractionTests.play =
  validitySectionRenderingInteractionTests;

export const RestrictionsSectionRenderingInteractionTests =
  newStoryFromTemplate(PaymentPackFormTemplate);
RestrictionsSectionRenderingInteractionTests.play =
  restrictionsSectionRenderingInteractionTests;

export const AdvancedSectionRenderingInteractionTests = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
AdvancedSectionRenderingInteractionTests.play =
  advancedSectionRenderingInteractionTests;

// Interaction Tests
// The purpose of these tests is to interact with the component and to check that
// the input values are the ones received by the form

export const GeneralSectionInteractionTests = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
GeneralSectionInteractionTests.play = generalSectionInteractionTests;

export const ValiditySectionInteractionTests = newStoryFromTemplate(
  PaymentPackFormTemplate,
);
ValiditySectionInteractionTests.play = validitySectionInteractionTests;
