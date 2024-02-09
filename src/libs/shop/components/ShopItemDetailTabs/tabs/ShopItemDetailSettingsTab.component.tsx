import React from 'react';

import TabPanel from '@material-ui/lab/TabPanel';

import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';

const ShopItemDetailSettingsTab: React.FC = () => {
  return (
    <TabPanel value={ShopItemDetailTab.SETTINGS}>
      <p>settings</p>
    </TabPanel>
  );
};

export default React.memo(ShopItemDetailSettingsTab);
