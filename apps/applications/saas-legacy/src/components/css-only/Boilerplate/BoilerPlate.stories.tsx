import React from 'react';

import FunctionalComponentCssOnlyBoilerPlate, {
  Props,
} from './BoilerPlate.component';

const BoilerPlateTemplate = (args: Props) => (
  <FunctionalComponentCssOnlyBoilerPlate {...args} />
);

export const BoilerPlateTemplateExample = BoilerPlateTemplate.bind({});

BoilerPlateTemplateExample.args = {
  numberOfItems: 3,
};

export default {
  title: 'Components/CssOnly/BoilerPlate',
  component: FunctionalComponentCssOnlyBoilerPlate,
  parameters: {
    docs: {
      page: null,
    },
  },
};
