import React, { useCallback } from 'react';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import ButtonBase from '#src/components/css-only/Fabrique/ButtonBaseV2';
import { httpParser } from '#src/libs/marketplace/utils';

type Props = { logo?: string; websiteURL?: string };

const AppBarLogo: React.FC<Props> = ({ logo, websiteURL }) => {
  const goToWebsite = useCallback(() => {
    window.location.href = httpParser(websiteURL);
  }, [websiteURL]);

  if (!logo) return null;

  if (websiteURL)
    return (
      <ButtonBase
        className="bs-app-bar-logo__button__container"
        onClick={goToWebsite}
      >
        <img alt="bsport logo" className="bs-app-bar-logo__image" src={logo} />
      </ButtonBase>
    );

  return (
    <img alt="bsport logo" className="bs-app-bar-logo__image" src={logo} />
  );
};

export const AppBarLogoStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof AppBarLogo>>()(AppBarLogo);
export default React.memo(AppBarLogo);
