import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';
import classNames from 'classnames';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { useTheme } from '@material-ui/styles';

import VideocamIcon from '@material-ui/icons/Videocam';

import './MarketplaceBroadcastCSSOnly.css';

export type Props = {
  className?: string;
  activityDialog?: boolean;
  cardVariant?: boolean;
};

const MarketplaceBroadcastCSSOnly: React.FC<Props> = ({
  className,
  activityDialog,
  cardVariant,
}) => {
  const { t } = useTranslation(['marketplace']);
  const theme = useTheme();

  return (
    <div
      style={
        {
          '--broadcast-background-color': activityDialog
            ? // @ts-expect-error
              theme.palette.primary.main
            : // @ts-expect-error
              lighten(theme.palette.primary.light, 0.8),
          '--broadcast-color': activityDialog
            ? // @ts-expect-error
              theme.palette.primary.contrastText
            : // @ts-expect-error
              theme.palette.primary.main,
        } as CSSProperties
      }
    >
      <div
        className={classNames('bs-broadcast', {
          'bs-broadcast--cardVariant': cardVariant,
        })}
      >
        <div className={classNames('bs-broadcast__text', className)}>
          {t('marketplace:calendar.broadcast')}
        </div>
        <VideocamIcon className="bs-broadcast__videocam" />
      </div>
    </div>
  );
};

export default pure(MarketplaceBroadcastCSSOnly);
