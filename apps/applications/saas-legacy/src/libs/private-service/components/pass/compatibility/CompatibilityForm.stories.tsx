import React from 'react';
import { ArgTypes, ComponentMeta, ComponentStory } from '@storybook/react';
import withFormik from '@bbbtech/storybook-formik';
import CompatibilityFormComponent, {
  CompatibilityFormForStorybook,
} from './CompatibilityForm.component';
import { Props } from './CompatibilityForm.component';
import { factory_scts } from '#src/libs/category/factory';
import { establishment_factory } from '#src/libs/establishment/factory';
import { meta_activity_factory } from '#src/libs/meta-activity/factory';

const componentMeta: ComponentMeta<typeof CompatibilityFormComponent> = {
  title: 'Library/PrivateBooking/CompatibilityForm',
  component: CompatibilityFormForStorybook,
  decorators: [withFormik],
  parameters: {
    layout: 'centered',
    formik: {
      initialValues: { categories: [], establishments: [], activities: [] },
    },
  },
};

const baseArgs: Props = {
  paymentPackValues: {
    SCTs: factory_scts(5),
    establishments: establishment_factory(5),
    metaActivities: meta_activity_factory(5),
  },
  updatePassCompatibility: () => {},
  SCTList: factory_scts(5),
  availableEstablishmentList: establishment_factory(5),
  metaActivityList: meta_activity_factory(5),
};

export default componentMeta;

const CompatibilityFormComponentTemplate: ComponentStory<
  typeof CompatibilityFormComponent
> = (args) => <CompatibilityFormComponent {...args} />;

export const BasicCompatibilityFormComponent =
  CompatibilityFormComponentTemplate.bind({});
BasicCompatibilityFormComponent.args = baseArgs;
