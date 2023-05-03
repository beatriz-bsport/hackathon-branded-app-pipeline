import React from 'react';
import FactoryBotTheme from '#libs/theme/factories';
import FactorybotEstablishment from '#libs/establishment/factories/Establishments';

import MarketplaceEstablishmentTitle from '.';

import PlaceIcon from '@material-ui/icons/Place';

import type { Props } from '.';

const fakeTheme = FactoryBotTheme.companyTheme.create();
const fakeEstablishment = FactorybotEstablishment.Establishment.create();

export default {
  title: 'Components/Marketplace/EstablishmentTitle',
  component: MarketplaceEstablishmentTitle,
  args: {
    theme: { ...fakeTheme, show_establishment: true },
    establishment: fakeEstablishment,
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};

const Template = (args: Props) => {
  return <MarketplaceEstablishmentTitle {...args} />;
};

export const establishmentTitleWithoutIcon = Template.bind({});

export const establishmentTitleWithIcon = Template.bind({});
establishmentTitleWithIcon.args = {
  icon: <PlaceIcon />,
};
