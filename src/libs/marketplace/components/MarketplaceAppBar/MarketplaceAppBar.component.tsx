// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';

import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { getTextColorFromRGB } from '../../../../utils/color';

import { Basket } from '#libs/checkout/types';
import { Member } from '#libs/member/types';
import { MarketplaceSettings } from '#libs/marketplace/types';

import AppBarMenu from './AppBarMenu.component';
import AppBarLogo from './AppBarLogo.component';
import AppBarBasket from './AppBarBasket.component';
import AppBarProfile from './AppBarProfile.component';
import AppBarProfileMenu from './AppBarProfileMenu.component';

type Props = {
  auth?: Object;
  logo?: string;

  currentBasket?: Basket;
  openCurrentBasket?: () => void;

  disconnect?: () => void;
  goToUserSpace?: () => void;
  requestLogin?: () => void;
  websiteURL?: string;
  isWidget?: boolean;

  controlableMemberList?: Array<Member>;
  navigateToRelationAccount?: (memberId: number) => void;
  isRelationNavigation?: boolean;
  navigateBackToMasterRelation?: () => void;

  withNavigation?: boolean;
  onlyNavigation?: boolean;
  hideAppBar?: boolean;
  handleTabChange?: (
    event: React.SyntheticEvent<HTMLElement>,
    value: number,
  ) => void;
  tabSelected?: string;
  settings?: MarketplaceSettings;
  theme?: any;
  photo?: string;
};

export const MarketplaceAppBar: React.FC<Props> = ({
  auth,
  logo,
  currentBasket,
  openCurrentBasket,
  disconnect,
  goToUserSpace,
  requestLogin,
  websiteURL,
  isWidget,
  controlableMemberList,
  navigateBackToMasterRelation,
  isRelationNavigation,
  navigateToRelationAccount,
  withNavigation,
  onlyNavigation,
  hideAppBar,
  handleTabChange,
  tabSelected,
  settings,
  theme,
  franchisor,
  onCompanySelected,
  photo,
}) => {
  const classes = useStyles();

  const { t } = useTranslation(['translation', 'consumerSpace']);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.SyntheticEvent<HTMLElement>) => {
    if (auth.authenticated) {
      setIsMenuOpen(true);
      setAnchorEl(event.currentTarget);
      return;
    }
    requestLogin();
  };

  if (!theme) {
    return null;
  }

  if (onlyNavigation) {
    return (
      <AppBarMenu
        hideAppBar={hideAppBar}
        onlyNavigation={onlyNavigation}
        handleTabChange={handleTabChange}
        tabSelected={tabSelected}
        settings={settings}
        theme={theme}
      />
    );
  }

  return (
    <>
      <div className={classes.container}>
        <div className={classes.logo}>
          <AppBarLogo
            isWidget={isWidget}
            logo={logo}
            websiteURL={websiteURL}
            title={theme.company_name}
            franchisor={franchisor}
            onCompanySelected={onCompanySelected}
            currentTheme={theme}
          />
        </div>
        {withNavigation && (
          <AppBarMenu
            hideAppBar={hideAppBar}
            onlyNavigation={onlyNavigation}
            handleTabChange={handleTabChange}
            tabSelected={tabSelected}
            settings={settings}
            theme={theme}
          />
        )}
        <div className={classes.basketAndProfile}>
          <div className={classes.shoppingBox}>
            <AppBarBasket
              openCurrentBasket={openCurrentBasket}
              currentBasket={currentBasket}
            />
          </div>
          <AppBarProfile
            photo={photo}
            isWidget={isWidget}
            isMenuOpen={isMenuOpen}
            handleProfileMenuOpen={handleProfileMenuOpen}
            auth={auth}
          />
          <AppBarProfileMenu
            auth={auth}
            anchorEl={anchorEl}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            photo={photo}
            isWidget={isWidget}
            goToUserSpace={goToUserSpace}
            disconnect={disconnect}
            controlableMemberList={controlableMemberList}
            navigateBackToMasterRelation={navigateBackToMasterRelation}
            isRelationNavigation={isRelationNavigation}
            navigateToRelationAccount={navigateToRelationAccount}
          />
        </div>
      </div>
      {isRelationNavigation && (
        <div className={classes.relationBanner}>
          <Typography>
            {t('consumerSpace:navigation.relationConnectedAs', {
              name: auth?.name,
            })}
          </Typography>
          <ButtonBase
            className={classes.buttonRelation}
            onClick={navigateBackToMasterRelation}
          >
            {t(
              'consumerSpace:navigation.backToRelationMasterSpace',
            )?.toUpperCase()}
          </ButtonBase>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
    boxShadow: theme.shadows[2],
    zIndex: 999,
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
    },
  },
  basketAndProfile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  logo: {
    flex: 1,
    justifySelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  shoppingBox: {
    padding: theme.spacing(1),
    alignSelf: 'center',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
    },
  },
  relationBanner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,

    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
    zIndex: 1000,
  },
  buttonRelation: {
    textDecoration: 'underline',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(0.25),
  },
}));

export default MarketplaceAppBar;
