import React from 'react';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import AppBarLogo from '#src/components/css-only/Navigation/AppBar/AppBarLogo';
import AppBarRightButtons from './AppBarRightButtons';
import IconButton from '#Fabrique/IconButton';
import { Menu03 } from '#src/components/untitledui';
import classNames from 'classnames';
import type { AppBarProps } from '#src/components/css-only/Navigation/types';
import './styles.css';

const AppBar: React.FC<AppBarProps> = ({
  logo,
  isMobile,
  onClickMenuButton,
  rightButtons,
  tabs,
  webSiteUrl,
}) => {
  return (
    <div className="bs-app-bar__root">
      <div className="bs-app-bar__left-section">
        <IconButton
          className={classNames('bs-app-bar__left-section__menu-button', {
            'bs-app-bar__left-section__menu-button--hidden': !isMobile,
          })}
          color="grey"
          onClick={onClickMenuButton}
          size="md"
          variant="text"
        >
          <Menu03 />
        </IconButton>
        <AppBarLogo logo={logo} websiteURL={webSiteUrl} />
      </div>
      {/*Temporary, we'll later need to add tabs here for the Marketplace */}
      <div className="bs-app-bar__center-section">{!!tabs && <></>}</div>

      <AppBarRightButtons rightButtons={rightButtons} />
    </div>
  );
};

export const AppBarStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof AppBar>>()(AppBar);
export default React.memo(AppBar);
