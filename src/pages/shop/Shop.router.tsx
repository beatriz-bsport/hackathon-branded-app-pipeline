import React from 'react';
import { Route, Switch } from 'react-router';
// @ts-expect-error
import ShopItem from '#src/pages/shop/ShopItem.page';
import ShopItemDetail from '#src/pages/shop/ShopItemDetail.page';
// @ts-expect-error
import ShopList from '#src/pages/shop/ShopList.page';
import ShopListReworkedPage from '#src/pages/shop/ShopListReworked.page';
import { useSelector } from 'react-redux';
import { RootState } from '#src/reducers';
import themeSelectors from '#src/libs/theme/selectors';

const ShopRouter: React.FC = () => {
  const displayNewWebshop = useSelector(
    (state: RootState) => themeSelectors.getTheme(state).display_new_webshop,
  );

  return (
    <Switch>
      <Route
        key="/shop/:id"
        exact
        component={displayNewWebshop ? ShopItemDetail : ShopItem}
        path="/shop/:id/"
      />
      ,
      <Route
        key="/shop"
        component={displayNewWebshop ? ShopListReworkedPage : ShopList}
        path="/shop"
      />
      ,
    </Switch>
  );
};

export default React.memo(ShopRouter);
