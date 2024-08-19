import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';
import classNames from 'classnames';
import chroma from 'chroma-js';
import { useTheme } from '@material-ui/core';

import { getLevelColor, getLevelTranslation } from '#src/libs/level/utils';
import { Level } from '#src/libs/level/types';
import { getTextColorFromRGB } from '../../../../../utils/color';

import './MarketplaceLevelCSSOnly.css';

export type Props = {
  customLevel: Level;
  className?: string;
  hideLevel?: boolean;
};

const MarketplaceLevelCSSOnly: React.FC<Props> = ({
  customLevel,
  className,
  hideLevel,
}) => {
  const { t } = useTranslation(['offer', 'translation']);
  const theme = useTheme();

  if (hideLevel) {
    return <></>;
  }

  const levelColor = customLevel
    ? getLevelColor(customLevel.id, customLevel.color, theme)
    : '#fff';

  if (!customLevel || customLevel.id === 5) return null;

  return (
    <div
      style={
        {
          display: 'inline-block',
          '--level-background-color': levelColor,
          '--level-color': getTextColorFromRGB(chroma(levelColor).rgb()),
        } as CSSProperties
      }
    >
      <div className={classNames('bs-level', className)}>
        <p className="bs-level-content">
          {getLevelTranslation(customLevel?.id, customLevel?.name || '', t)}
        </p>
      </div>
    </div>
  );
};

export default pure(MarketplaceLevelCSSOnly);
