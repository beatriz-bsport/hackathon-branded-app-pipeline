import React from 'react';

import TabPanel from '@material-ui/lab/TabPanel';

import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';

const ShopItemDetailInventoryTab: React.FC = () => {
  return (
    <TabPanel value={ShopItemDetailTab.INVENTORY}>
      <p>inventory</p>
    </TabPanel>
  );
};

export default React.memo(ShopItemDetailInventoryTab);
