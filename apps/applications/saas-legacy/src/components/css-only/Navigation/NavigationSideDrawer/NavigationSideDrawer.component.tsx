import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import Submenu from '#Fabrique/Submenu';
import Alert from '#Fabrique/Alert';
import { PortalContainer } from '#Fabrique/PortalContainer';
import Title from '#Fabrique/Title';
import IconButton from '#Fabrique/IconButton';
import { WidgetUtils } from '#src/libs/widget/WidgetUtils';

import type { SubmenuItem } from '#Fabrique/Submenu/types';

import './styles.css';

type StackNavigationState = SubmenuItem[][];

type Props = {
  isOpen: boolean;
  /** If true  */
  isRelationshipAuth?: boolean;
  /** The element of the untitled icon shown in the header */
  leftIcon?: React.ReactElement;
  /** The title displayed in the drawer header */
  title?: string;
  /** The subtitle displayed in the drawer header */
  subtitle?: string;
  /** The list of submenu items provided to the drawer content */
  submenuItems: SubmenuItem[];
  /** @see {@link [useNavigationSideDrawerData](useNavigationSideDrawerData.hook.ts)} */
  stackNavigationState: StackNavigationState;
  /** @see {@link [useNavigationSideDrawerData](useNavigationSideDrawerData.hook.ts)} */
  handleBackArrowClick?: () => void;
  /** @see {@link [useNavigationSideDrawerData](useNavigationSideDrawerData.hook.ts)} */
  handleSetStackNavigationState: (items: SubmenuItem[]) => void;
};

const NavigationSideDrawer: React.FC<Props> = ({
  isOpen,
  isRelationshipAuth,
  leftIcon,
  submenuItems,
  stackNavigationState,
  title,
  subtitle,
  handleBackArrowClick,
  handleSetStackNavigationState,
}) => {
  const isWidget = WidgetUtils.isWidget();
  const { t } = useTranslation(['common', 'consumerSpace']);

  const headerTitle =
    stackNavigationState?.length > 0 ? t('common:back') : title;

  const headerSubtitle = stackNavigationState?.length > 0 ? null : subtitle;

  const currentSubmenuItems = stackNavigationState?.length
    ? stackNavigationState[stackNavigationState?.length - 1]
    : submenuItems;

  return (
    <PortalContainer wrapperId="bs-navigation-side-drawer-portal-container">
      <div
        className={classNames('bs-navigation-side-drawer__root', {
          'bs-navigation-side-drawer__root--widget': isWidget,
          'bs-navigation-side-drawer__root--hidden': !isOpen,
        })}
      >
        <Alert
          hideLeftIcon
          className={classNames(
            'bs-navigation-side-drawer__relationship-alert',
            {
              'bs-navigation-side-drawer__relationship-alert--hidden':
                !isRelationshipAuth,
            },
          )}
          color="info"
          variant="strong"
        >
          {t('consumerSpace:reworked.navigation.loggedInAs')}
        </Alert>
        <div
          className={classNames('bs-navigation-side-drawer__header', {
            'bs-navigation-side-drawer__header--hidden':
              !headerTitle && !headerSubtitle,
          })}
        >
          <IconButton
            className={classNames('bs-navigation-side-drawer__header__icon', {
              'bs-navigation-side-drawer__header__icon--hidden': !leftIcon,
            })}
            color="grey"
            onClick={handleBackArrowClick}
            variant="text"
          >
            {leftIcon}
          </IconButton>

          <Title
            classes={{
              title: classNames(
                'bs-navigation-side-drawer__header__text__title',
                {
                  'bs-navigatiotn-side-drawer__header__text__title--hidden':
                    !headerTitle,
                },
              ),
              subTitle: classNames(
                'bs-navigation-side-drawer__header__text__subtitle',
                {
                  'bs-navigatiotn-side-drawer__header__text__subtitle--hidden':
                    !headerSubtitle,
                },
              ),
            }}
            className="bs-navigation-side-drawer__header__text"
            subtitle={headerSubtitle}
            title={headerTitle}
            variant="sm"
          />
        </div>

        <div className="bs-navigation-side-drawer__content">
          <Submenu
            handleSetRecursiveItems={handleSetStackNavigationState}
            items={currentSubmenuItems}
          />
        </div>
      </div>
    </PortalContainer>
  );
};

export default React.memo(NavigationSideDrawer);
