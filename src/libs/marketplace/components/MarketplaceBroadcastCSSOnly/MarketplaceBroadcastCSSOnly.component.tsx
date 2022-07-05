import React from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';
import classNames from 'classnames';

import VideocamIcon from '@material-ui/icons/Videocam';
import './MarketplaceBroadcastCSSOnly.css';

export type Props = {
  className?: string;
};

const MarketplaceBroadcastCSSOnly: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation(['marketplace']);

  return (
    <div className="bs-broadcast">
      <div className={classNames('bs-broadcast__text', className)}>
        {t('calendar.broadcast')}
      </div>
      <VideocamIcon className="bs-broadcast__videocam" />
    </div>
  );
};

export default pure(MarketplaceBroadcastCSSOnly);
