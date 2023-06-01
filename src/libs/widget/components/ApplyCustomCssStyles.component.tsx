import React from 'react';
import pure from 'recompose/pure';
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

export default pure(ApplyCustomCssStyles);
