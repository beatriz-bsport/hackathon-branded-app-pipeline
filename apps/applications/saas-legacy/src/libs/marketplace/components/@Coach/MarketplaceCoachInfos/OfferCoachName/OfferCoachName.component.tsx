import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Offer } from '#src/libs/offer/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';

export type Props = {
  offer?: Offer<Coach, Establishment, MetaActivity>;
  classes?: { [key: string]: string };
  coachNameToDisplay: string;
};

const OfferCoachName: React.FC<Props> = React.memo(
  ({ offer, classes, coachNameToDisplay }) => {
    const { t } = useTranslation('translation');
    return (
      <div
        className={classNames({
          ...classes,
        })}
      >
        {coachNameToDisplay &&
          coachNameToDisplay +
            (offer?.coach_override ? ` (${t('marketplace.substitute')})` : '')}
      </div>
    );
  },
);

export default OfferCoachName;
