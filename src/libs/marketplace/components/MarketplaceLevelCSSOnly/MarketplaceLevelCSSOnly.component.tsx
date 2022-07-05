import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';
import classNames from 'classnames';
import chroma from 'chroma-js';
import { useTheme } from '@material-ui/core';

import { getTextColorFromRGB } from '../../../../utils/color';
import { getLevelColor, getLevelTrad } from '#libs/level/utils';
import './MarketplaceLevelCSSOnly.css';
import { Level } from '#libs/level/types';

export type Props = {
  customLevel: Level;
  className?: string;
};

const MarketplaceLevelCSSOnly: React.FC<Props> = ({
  customLevel,
  className,
}) => {
  const { t } = useTranslation('offer');
  const theme = useTheme();
  const levelColor = customLevel
    ? getLevelColor(customLevel.id, customLevel.color, theme)
    : '#fff';

  if (!customLevel || customLevel.id === 5) return null;

  return (
    <div
      style={
        {
          '--level-background-color': levelColor,
          '--level-color': getTextColorFromRGB(
            chroma(levelColor ?? '#fff').rgb(),
          ),
        } as CSSProperties
      }
    >
      <div className={classNames('bs-level', className)}>
        {getLevelTrad(customLevel.id, customLevel.name, t)}
      </div>
    </div>
  );
};

export default pure(MarketplaceLevelCSSOnly);
