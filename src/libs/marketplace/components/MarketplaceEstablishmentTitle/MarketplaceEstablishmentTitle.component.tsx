import React from 'react';

import './styles.css';

import classNames from 'classnames';

import type { Theme } from '#libs/theme/types';
import type { Establishment } from '#libs/establishment/types';

export type Props = {
  establishment: Establishment;
  theme: Theme;
  icon?: React.ReactNode;
  classes?: { [key: string]: string };
};

export const MarketplaceEstablishmentTitle: React.FC<Props> = React.memo(
  ({ establishment, theme, classes, icon }) => {
    if (theme?.show_establishment && !!establishment) {
      return (
        <div
          className={classNames({
            ...classes,
          })}
        >
          {icon && <span className="bs-establishment-title__icon">{icon}</span>}
          {establishment.title}
        </div>
      );
    }
    return <></>;
  },
);

export default MarketplaceEstablishmentTitle;
