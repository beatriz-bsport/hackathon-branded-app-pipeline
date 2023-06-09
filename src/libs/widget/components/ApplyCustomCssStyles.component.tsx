import React from 'react';
import { MarketplaceCSSConfiguration } from '#libs/exportable-components/types';

const ApplyCustomCssStyles: React.FC<{
  customConfiguration: MarketplaceCSSConfiguration;
  fromWidget?: boolean;
}> = ({ customConfiguration, fromWidget }) => {
  const inlineStyle = Object.values(
    customConfiguration?.components_css ?? {},
  ).join(' ');

  const cssIdentifierRegex = /(\.bs-[^,{]*)+(\s*{|,)/gm;
  const cssPropertyRegex = /^(\s)*(\w|-)*: ([^;}$])*/gm;

  /*
  The widget contains elements wrapped in a "cleanslate" wrapper. 
  This wrapper helps reset any CSS styles coming from Material-UI or the website itself.
  
  The following code applies the same logic below.
  */
  const styleToApply = fromWidget
    ? `${inlineStyle}`
        .replace(
          cssIdentifierRegex,
          (correpondance) =>
            `[id*="bsport-widget"] .cleanslate ${correpondance}`,
        )
        .replace(
          cssPropertyRegex,
          (correpondance) => `${correpondance} !important`,
        )
    : inlineStyle;

  return <style>{styleToApply}</style>;
};

export default React.memo(ApplyCustomCssStyles);
