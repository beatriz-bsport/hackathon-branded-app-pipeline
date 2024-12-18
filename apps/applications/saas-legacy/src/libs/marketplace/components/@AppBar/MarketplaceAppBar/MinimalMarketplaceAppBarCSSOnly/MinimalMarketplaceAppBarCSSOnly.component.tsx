import React, { useCallback } from 'react';

import ArrowBack from '@material-ui/icons/ArrowBack';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import ButtonBase from '#src/components/css-only/Fabrique/ButtonBase';
import AppBarProfileMenu from '#src/libs/marketplace/components/@AppBar/MarketplaceAppBar/AppBarProfileMenu.component';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

import './styles.css';

export type Props = {
  auth: any;
  disconnect?: () => void;
  photo?: string;
  requestLogin?: () => void;
};

export const MinimalMarketplaceAppBarCSSOnly: React.FC<Props> = ({
  auth,
  disconnect,
  photo,
  requestLogin,
}) => {
  const { t } = useTranslation('consumerSpace');

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);

  const handleWidgetGoBackNavigation = useCallback(() => {
    WidgetUtils.handleGoBackNavigation();
  }, []);

  const handleProfileMenuOpen = useCallback(
    (event: React.SyntheticEvent<HTMLElement>) => {
      if (auth) {
        setIsMenuOpen(true);
        const currentTarget = event.currentTarget;
        setAnchorEl(currentTarget);
      }
      requestLogin?.();
    },
    [auth, requestLogin],
  );

  return (
    <div id="bs-minimal-appbar--container">
      <div id="bs-minimal-appbar__left--container">
        <ButtonBase onClick={handleWidgetGoBackNavigation}>
          <ArrowBack />
        </ButtonBase>
      </div>

      <div id="bs-minimal-appbar__right--container">
        <ButtonBase
          classes="bs-minimal-appbar__right--container__button__base"
          onClick={handleProfileMenuOpen}
        >
          <div id="bs-minimal-appbar__right--profile__image__container">
            {photo ? (
              <Avatar
                id="bs-minimal-appbar__right--profile__image__avatar"
                src={photo}
              />
            ) : (
              <AccountCircleIcon
                aria-haspopup="true"
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                color="disabled"
                id="bs-minimal-appbar__right--profile__image__default__avatar"
              />
            )}
          </div>

          <div id="bs-minimal-appbar__right--auth__name__container">
            {!auth.authenticated && t('appbar.login')}
            {auth.authenticated &&
              (auth.name !== ' ' ? auth.name : auth.username)}
          </div>
        </ButtonBase>

        <AppBarProfileMenu
          isWidget
          anchorEl={anchorEl}
          auth={auth}
          disconnect={disconnect}
          isMenuOpen={isMenuOpen}
          photo={photo}
          popoverId="marketplace-appbar-profile-menu"
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>
    </div>
  );
};

export const MinimalMarketplaceAppBarCSSOnlyStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof MinimalMarketplaceAppBarCSSOnly>
>()(MinimalMarketplaceAppBarCSSOnly);

export default React.memo(MinimalMarketplaceAppBarCSSOnly);
