import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';
import classNames from 'classnames';
import chroma from 'chroma-js';
import { useTheme } from '@material-ui/core';

import { lighten } from '@material-ui/core/styles/colorManipulator';
import { getTextColorFromRGB } from '../../../../utils/color';
import { getLevelColor, getLevelTrad } from '#libs/level/utils';
import './MarketplaceLevelCSSOnly.css';
import { Level } from '#libs/level/types';

export type Props = {
  customLevel: Level;
  className?: string;
  activityDialog?: boolean;
  hideLevel?: boolean;
};

const MarketplaceLevelCSSOnly: React.FC<Props> = ({
  customLevel,
  className,
  activityDialog,
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
          '--level-background-color': activityDialog
            ? levelColor
            : lighten(levelColor, 0.8),
          '--level-color': activityDialog
            ? getTextColorFromRGB(chroma(levelColor).rgb())
            : levelColor,
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
