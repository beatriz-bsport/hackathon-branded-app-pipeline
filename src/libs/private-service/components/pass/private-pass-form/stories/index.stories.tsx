import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { factory_scts } from '#libs/category/factory';
import { meta_activity_factory } from '#libs/meta-activity/factory';
import {
  privatePassCategoryFactory,
  private_services_factory,
} from '#libs/private-service/factory';
import FactoryBotEstablishment from '#libs/establishment/factories/Establishments';

import { newStoryFromTemplate } from '../../../../../../utils/storybookHelper';

import {
  emptyFormRenderingTests,
  generalSectionRenderingTests,
  paymentSectionRenderingTests,
  validitySectionRenderingTests,
  compatibilitySectionRenderingTests,
} from './rendering-tests';

import {
  paymentSectionInteractionsRenderingTests,
  validitySectionInteractionsRenderingTests,
  universalCompatibilityInteractionsRenderingTests,
} from './rendering-with-interactions-tests';

import {
  generalSectionInteractionsTests,
  paymentSectionInteractionsTests,
  validitySectionInteractionsTests,
  compatibilitySectionInteractionsTests,
  universalCompatibilityInteractionsTests,
} from './interaction-tests';

import { validationTests } from './validation-tests';

import {
  generalSectionErrorTests,
  validitySectionErrorTests,
} from './error-tests';

import PrivatePassForm from '../PrivatePassForm.component';

import { Establishment } from '#libs/establishment/types';

const actionsData = {
  onSubmit: action('onSubmit'),
  onCancel: action('onCancel'),
};

const privateServices = private_services_factory(3);
const randomSCT = factory_scts(5);
const randomMetaActivity = meta_activity_factory(5);
const randomEstablishments: Establishment[] =
  FactoryBotEstablishment.Establishment.create(5);
const privatePassCategories = privatePassCategoryFactory(5);

export default {
  title: 'Library/PrivatePass/PrivatePassForm',
  component: PrivatePassForm,
  argTypes: {
    onSubmit: actionsData.onSubmit,
    onCancel: actionsData.onCancel,
  },
  args: {
    privatePassCategories: privatePassCategories,
    privateServices: privateServices,
    categoryList: randomSCT,
    establishmentList: randomEstablishments,
    metaActivityList: randomMetaActivity,
  },
} as ComponentMeta<typeof PrivatePassForm>;

const PrivatePassFormTemplate: ComponentStory<typeof PrivatePassForm> = (
  args,
) => <PrivatePassForm {...args} />;
export const EmptyForm = newStoryFromTemplate(PrivatePassFormTemplate);

// Rendering tests
// The purpose of these tests is to check that all the elements of the form are rendered correctly
export const EmptyFormRenderingTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
EmptyFormRenderingTests.play = emptyFormRenderingTests;

export const GeneralSectionRenderingTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
GeneralSectionRenderingTests.play = generalSectionRenderingTests;

export const PaymentSectionRenderingTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
PaymentSectionRenderingTests.play = paymentSectionRenderingTests;

export const ValiditySectionRenderingTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
ValiditySectionRenderingTests.play = validitySectionRenderingTests;

export const CompatibilitySectionRenderingTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
CompatibilitySectionRenderingTests.play = compatibilitySectionRenderingTests;

// Rendering tests with interactions
// The purpose of these tests is to mimic user behavior and check that hidden fields / elements are rendered
export const PaymentSectionInteractionsRenderingTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
PaymentSectionInteractionsRenderingTests.play =
  paymentSectionInteractionsRenderingTests;

export const ValiditySectionInteractionsRenderingTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
ValiditySectionInteractionsRenderingTests.play =
  validitySectionInteractionsRenderingTests;

export const UniversalCompatibilityInteractionsRenderingTests =
  newStoryFromTemplate(PrivatePassFormTemplate);
UniversalCompatibilityInteractionsRenderingTests.play =
  universalCompatibilityInteractionsRenderingTests;

// Interactions tests
// The purpose of these tests is to interact with the component and to check that the values inputted are the ones received by the form.
export const GeneralSectionInteractionsTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
GeneralSectionInteractionsTests.play = generalSectionInteractionsTests;

export const PaymentSectionInteractionsTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
PaymentSectionInteractionsTests.play = paymentSectionInteractionsTests;

export const ValiditySectionInteractionsTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
ValiditySectionInteractionsTests.play = validitySectionInteractionsTests;

export const CompatibilitySectionInteractionsTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
CompatibilitySectionInteractionsTests.play =
  compatibilitySectionInteractionsTests;

export const UniversalCompatibilityInteractionsTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
UniversalCompatibilityInteractionsTests.play =
  universalCompatibilityInteractionsTests;

// Validation tests
// The purpose is to test if the validation rules are respected
export const ValidationTests = newStoryFromTemplate(PrivatePassFormTemplate);
ValidationTests.play = validationTests;

// Error tests
// The purpose is to test if errors are displayed properly. It should not be possible to submit the form in case of error
export const GeneralSectionErrorTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
GeneralSectionErrorTests.play = generalSectionErrorTests;

export const ValiditySectionErrorTests = newStoryFromTemplate(
  PrivatePassFormTemplate,
);
ValiditySectionErrorTests.play = validitySectionErrorTests;
