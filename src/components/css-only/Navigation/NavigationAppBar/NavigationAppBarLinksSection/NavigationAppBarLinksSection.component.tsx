import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { useComputedAppBarLinks } from './useComputedAppBarLinks.hook';
import Submenu from '#src/components/css-only/Fabrique/Submenu';
import Tab from '#Fabrique/Tab';

import type { NavigationAppBarProps } from '#src/components/css-only/Navigation/NavigationAppBar/types';
import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';

import './styles.css';

type Props = Pick<NavigationAppBarProps, 'links'> & {
  isHidden: boolean;
};

const NavigationAppBarLinksSection: React.FC<Props> = ({ links, isHidden }) => {
  const { t } = useTranslation('common');

  const visibleLinksRef = useRef<HTMLDivElement>(null);
  const computedRef = useRef<HTMLDivElement>(null);

  /** Force re-render when refs are defined to retrigger computation */
  const [isForcedUpdate, setForcedUpdate] = useState(false);
  useEffect(() => {
    if (computedRef.current && visibleLinksRef.current && !isForcedUpdate) {
      setForcedUpdate(true);
    }
  }, [isForcedUpdate]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const { visibleAppBarLinks, hiddenAppBarLinks } = useComputedAppBarLinks({
    computedRef,
    visibleLinksRef,
    links,
  });

  const submenuLinks: SubmenuItem[] = useMemo(
    () =>
      hiddenAppBarLinks.map((link) => ({
        title: link.title,
        isSelected: link.isSelected,
        onClick: link.onClick,
      })),
    [hiddenAppBarLinks],
  );

  const handleOpenSubmenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setAnchorEl(event.currentTarget),
    [],
  );

  const handleCloseSubmenu = useCallback(() => setAnchorEl(null), []);

  return (
    <div
      className={classNames('bs-navigation-app-bar__links-section__root', {
        'bs-navigation-app-bar__links-section__root--hidden': isHidden,
      })}
    >
      <div
        ref={computedRef}
        className="bs-navigation-app-bar__links-section--computed"
      >
        {links.map((link) => (
          <Tab
            key={link.label}
            classes={{
              text: 'bs-navigation-app-bar__links-section__visible-buttons__tab__text',
            }}
            color="grey"
            onClick={link.onClick}
          >
            {link.label}
          </Tab>
        ))}
      </div>

      <div
        ref={visibleLinksRef}
        className="bs-navigation-app-bar__links-section__visible-buttons"
      >
        {visibleAppBarLinks.map((link) => (
          <Tab
            key={link.label}
            classes={{
              text: 'bs-navigation-app-bar__links-section__visible-buttons__tab__text',
            }}
            color="grey"
            isSelected={link.isSelected}
            onClick={link.onClick}
          >
            {link.label}
          </Tab>
        ))}
      </div>

      <div
        className={classNames(
          'bs-navigation-app-bar__links-section__hidden-buttons',
          {
            'bs-navigation-app-bar__links-section__hidden-buttons--hidden':
              !hiddenAppBarLinks.length,
          },
        )}
      >
        <Tab
          hasSelect
          classes={{
            text: 'bs-navigation-app-bar__links-section__more-button__tab__text',
          }}
          className="bs-navigation-app-bar__links-section__more-button"
          color="grey"
          onClick={handleOpenSubmenu}
        >
          {t('more')}
        </Tab>
      </div>

      <Submenu
        isAnchorMode
        anchorEl={anchorEl}
        anchorOriginHorizontal="right"
        anchorOriginVertical="bottom"
        items={submenuLinks}
        onClose={handleCloseSubmenu}
        transformOriginHorizontal="right"
        transformOriginVertical="top"
      />
    </div>
  );
};

export default React.memo(NavigationAppBarLinksSection);
