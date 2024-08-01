import React from 'react';
import { Route, Switch, useLocation, useParams } from 'react-router';
import Immutable from 'seamless-immutable';
// @ts-expect-error
import ShopItemPage from '#src/pages/shop/ShopItem.page';
import ShopItemDetailPage from '#src/pages/shop/ShopItemDetail.page';
// @ts-expect-error
import ShopListPage from '#src/pages/shop/ShopList.page';
import ShopReworkedProductListPage from '#src/pages/shop/ShopReworkedProductList.page';
import ShopReworkedSettingsPage from '#src/pages/shop/ShopReworkedSettings.page';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '#src/reducers';
import themeSelectors from '#src/libs/theme/selectors';
import { checkRequiredPermissions } from '#src/libs/role/utils';
import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import { Button, makeStyles } from '@material-ui/core';
import { getPermissions } from '#src/libs/role/selectors';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { push as pushRouter } from 'connected-react-router';
import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
import { compose } from 'recompose';

type Props = {
  pageHeight: number;
};

const ShopRouter: React.FC<Props> = ({ pageHeight }) => {
  const displayNewWebshop = useSelector(
    (state: RootState) => themeSelectors.getTheme(state).display_new_webshop,
  );
  const permissions = useSelector((state: RootState) => getPermissions(state));
  const dispatch = useDispatch();

  const { t } = useTranslation('navigation');

  const location = useLocation();

  const classes = useStyles();

  const { tab } = useParams<{ tab: string }>();

  const tabsData = React.useMemo(
    () =>
      Immutable([
        ...(checkRequiredPermissions(
          'navigationMenu.products.shopReworked.products',
          permissions,
        )
          ? [{ label: 'tab.shop.products', value: 'products' }]
          : []),
        ...(checkRequiredPermissions(
          'navigationMenu.products.shopReworked.settings',
          permissions,
        )
          ? [{ label: 'tab.shop.settings', value: 'settings' }]
          : []),
      ]),
    [permissions],
  );

  const isProductDetailPageActive = React.useMemo(
    () => (location?.pathname ?? '').includes('/shop/products/'),
    [location?.pathname],
  );

  const push = React.useCallback(
    (path: string) => dispatch(pushRouter(path)),
    [dispatch],
  );

  const pushToTab = React.useCallback(
    (_tab: 'products' | 'settings') => push(`/shop/${_tab}`),
    [push],
  );

  const handleGoToWebshop = React.useCallback(
    () => push('/shop/products'),
    [push],
  );

  if (!displayNewWebshop) {
    return (
      <Switch>
        <Route
          key="/shop/:id"
          exact
          component={ShopItemPage}
          path="/shop/:id"
        />
        <Route key="/shop" component={ShopListPage} path="/shop" />
      </Switch>
    );
  }

  return (
    <ContentWithAppBar
      dense={isProductDetailPageActive}
      onChange={pushToTab}
      pageHeight={pageHeight}
      tab={tab}
      tabsData={tabsData}
    >
      <>
        {isProductDetailPageActive && (
          <div className={classes.backToWebshop}>
            <Button
              classes={{ label: classes.webshopBannerButtonLabel }}
              onClick={handleGoToWebshop}
              size="small"
              startIcon={<ChevronLeftIcon />}
            >
              {t('backofficeMenu.backToWebshop')}
            </Button>
          </div>
        )}

        <Switch>
          {checkRequiredPermissions(
            'navigationMenu.products.shopReworked.products',
            permissions,
          ) && (
            <Route
              exact
              component={ShopReworkedProductListPage}
              path="/shop/products"
            />
          )}
          {checkRequiredPermissions(
            'navigationMenu.products.shopReworked.products',
            permissions,
          ) && (
            <Route
              exact
              component={ShopItemDetailPage}
              path="/shop/products/:id"
            />
          )}
          {checkRequiredPermissions(
            'navigationMenu.products.shopReworked.settings',
            permissions,
          ) && (
            <Route
              exact
              component={ShopReworkedSettingsPage}
              path="/shop/settings"
            />
          )}
        </Switch>
      </>
    </ContentWithAppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  backToWebshop: {
    display: 'flex',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.background.paper,
  },
  webshopBannerButtonLabel: {
    textTransform: 'initial',
  },
}));

export default compose<any, Props>(withPageHeightHOC())(React.memo(ShopRouter));
