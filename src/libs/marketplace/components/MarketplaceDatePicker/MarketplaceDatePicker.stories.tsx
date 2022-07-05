import React, { useState } from 'react';
import { useMuiThemeToCssVars } from '../../../../hooks/useMuiThemeToCssVars';

import MarketplaceDatePicker, {
  Props,
} from './MarketplaceDatePicker.component';

const CustomTemplate = (args: Props) => {
  const { dateSelected, ...props } = args;
  const style = useMuiThemeToCssVars();
  const [date, setDate] = useState(dateSelected);

  return (
    <div style={{ ...style, height: 400 }}>
      <div style={{ display: 'flex' }}>
        <MarketplaceDatePicker
          {...props}
          dateSelected={date}
          onSelect={setDate}
        />
      </div>
    </div>
  );
};

export const MarketplaceDatePickerBasics = CustomTemplate.bind({});

MarketplaceDatePickerBasics.args = {
  dateSelected: '2022-10-06',
  onSelect: () => {},
};

export default {
  title: 'Marketplace/MarketplaceDatePicker',
  component: MarketplaceDatePicker,
  parameters: {
    docs: {
      page: null,
    },
  },
};
