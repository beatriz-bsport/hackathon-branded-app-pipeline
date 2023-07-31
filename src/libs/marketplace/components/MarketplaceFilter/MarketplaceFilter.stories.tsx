import { PinDrop } from '@material-ui/icons';
import React from 'react';
import { useMuiThemeToCssVars } from '../../../../hooks/useMuiThemeToCssVars';

import MarketplaceFilter, { Props } from './MarketplaceFilter.component';

const options = [
  { label: 'Zinédine Zidane', value: 'Zinédine Zidane' },
  { label: 'Fabien Barthez', value: 'Fabien Barthez' },
  { label: 'Bernard Lama', value: 'Bernard Lama' },
  { label: 'Vincent Candela', value: 'Vincent Candela' },
  { label: 'Bixente Lizarazu', value: 'Bixente Lizarazu' },
  { label: 'Laurent Blanc', value: 'Laurent Blanc' },
  { label: 'Marcel Desailly', value: 'Marcel Desailly' },
  { label: 'Lilian Thuram', value: 'Lilian Thuram' },
  { label: 'Frank Lebœuf', value: 'Frank Lebœuf' },
  { label: 'Patrick Vieira', value: 'Patrick Vieira' },
  { label: 'Youri Djorkaeff', value: 'Youri Djorkaeff' },
  { label: 'Didier Deschamps', value: 'Didier Deschamps' },
  { label: 'Robert Pirès', value: 'Robert Pirès' },
  { label: 'Emmanuel Petit', value: 'Emmanuel Petit' },
  { label: 'Christian Karembeu', value: 'Christian Karembeu' },
  { label: 'Stéphane Guivarc', value: 'Stéphane Guivarc' },
  { label: 'Thierry Henry', value: 'Thierry Henry' },
  { label: 'David Trezeguet', value: 'David Trezeguet' },
  { label: 'Christophe Dugarry', value: 'Christophe Dugarry' },
];

const GroupedOption = [
  {
    label: 'Groupe 1',
    options: options.slice(0, 5),
    icon: <PinDrop />,
  },
  {
    label: 'Groupe 2',
    options: options.slice(5, 10),
    icon: <PinDrop />,
  },
];

const CustomTemplate = (args: Props) => {
  const style = useMuiThemeToCssVars();
  return (
    <div style={{ ...style, height: 400 }}>
      <div>
        <MarketplaceFilter {...args} />
      </div>
    </div>
  );
};

export const MarketplaceFilterBasics = CustomTemplate.bind({});

MarketplaceFilterBasics.args = {
  text: 'Professeur',
  options,
  selectedOptions: ['Stéphane Guivarc'],
  onSelect: () => {},
};

export const MarketplaceFilterGrouped = CustomTemplate.bind({});

MarketplaceFilterGrouped.args = {
  text: 'Professeur',
  options: GroupedOption,
  selectedOptions: [],
  onSelect: () => {},
};

export default {
  title: 'Marketplace/MarketplaceFilter',
  component: MarketplaceFilter,
  parameters: {
    docs: {
      page: null,
    },
  },
};
