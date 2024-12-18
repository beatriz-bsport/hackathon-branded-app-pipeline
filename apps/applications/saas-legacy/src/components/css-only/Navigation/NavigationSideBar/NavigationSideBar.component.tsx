import React from 'react';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Submenu from '#Fabrique/Submenu';
import Title from '#Fabrique/Title';

import type { SubmenuItem } from '#Fabrique/Submenu/types';

import './styles.css';

type Props = {
  items?: SubmenuItem[];
  memberName?: string;
};

const NavigationSideBar: React.FC<Props> = ({ items, memberName }) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <aside className="bs-consumer-navigation__layout__sidebar__root">
      <div className="bs-consumer-navigation__layout__sidebar-container">
        <Title
          classes={{
            title: 'bs-consumer-navigation__layout__sidebar__title',
            subTitle: 'bs-consumer-navigation__layout__sidebar__subtitle',
          }}
          className="bs-consumer-navigation__layout__sidebar__text"
          subtitle={t('reworked.navigation.exploreYourProfile')}
          title={memberName && `${memberName},`}
          variant="sm"
        />

        <nav className="bs-consumer-navigation__layout__sidebar__navigation">
          <Submenu
            className="bs-consumer-navigation__layout__sidebar__navigation__submenu"
            items={items}
          />
        </nav>
      </div>
    </aside>
  );
};

export const NavigationSideBarStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof NavigationSideBar>>()(
    NavigationSideBar,
  );

export default React.memo(NavigationSideBar);
