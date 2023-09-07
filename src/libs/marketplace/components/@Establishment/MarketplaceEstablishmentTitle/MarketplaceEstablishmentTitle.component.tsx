import React from 'react';

import './styles.css';

import classNames from 'classnames';

import type { Theme } from '#libs/theme/types';
import type { Establishment } from '#libs/establishment/types';

export type Props = {
  establishment: Establishment;
  theme?: Theme;
  icon?: React.ReactNode;
  classes?: { [key: string]: string };
  showEstablishmentAddress?: boolean;
};

export const MarketplaceEstablishmentTitle: React.FC<Props> = React.memo(
  ({ establishment, theme, classes, icon, showEstablishmentAddress }) => {
    if ((!theme || theme.show_establishment) && !!establishment) {
      const establishmentInformation = showEstablishmentAddress
        ? `${establishment?.title} - ${establishment?.location?.address}`
        : `${establishment?.title}`;
      return (
        <div
          className={classNames({
            ...classes,
          })}
        >
          {icon && <span className="bs-establishment-title__icon">{icon}</span>}
          {establishmentInformation}
        </div>
      );
    }
    return <></>;
  },
);

export default MarketplaceEstablishmentTitle;
