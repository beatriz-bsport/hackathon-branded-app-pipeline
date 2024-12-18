import React from 'react';
import classNames from 'classnames';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';

import type { Theme } from '#src/libs/theme/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { Offer } from '#src/libs/offer/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import OfferCoachPicture from './OfferCoachPicture';
import OfferCoachName from './OfferCoachName';

export type Props = {
  theme: Theme;
  hideCoach?: boolean;
  coach: Coach;
  offer?: Offer<Coach, Establishment, MetaActivity>;
  classes?: { [key: string]: string };
  coachPictureClasses?: { [key: string]: string };
  coachNameClasses?: { [key: string]: string };
  reverse?: boolean;
};

const MarketplaceCoachInfos: React.FC<Props> = React.memo(
  ({
    theme,
    coach,
    classes,
    hideCoach,
    offer,
    coachPictureClasses,
    coachNameClasses,
    reverse,
  }) => {
    if (!hideCoach && !!coach) {
      switch (theme?.coach_display) {
        case MarketPlaceCoachDisplay.ONLY_FIRST_NAME:
          return (
            <OfferCoachName
              classes={classes}
              coachNameToDisplay={coach?.firstname}
              offer={offer}
            />
          );

        case MarketPlaceCoachDisplay.FIRST_NAME_WITH_PICTURE:
          return (
            <div
              className={classNames({
                ...classes,
              })}
            >
              {coach?.photo && (
                <OfferCoachPicture
                  classes={coachPictureClasses}
                  picture={coach?.photo}
                  reverse={reverse}
                />
              )}
              <OfferCoachName
                classes={coachNameClasses}
                coachNameToDisplay={coach?.firstname}
                offer={offer}
              />
            </div>
          );

        case MarketPlaceCoachDisplay.FULL_NAME_WITHOUT_PICTURE:
          return (
            <OfferCoachName
              classes={classes}
              coachNameToDisplay={coach?.name}
              offer={offer}
            />
          );

        default:
          return (
            <div
              className={classNames({
                ...classes,
              })}
            >
              {coach?.photo && (
                <OfferCoachPicture
                  classes={coachPictureClasses}
                  picture={coach?.photo}
                  reverse={reverse}
                />
              )}
              <OfferCoachName
                classes={classes}
                coachNameToDisplay={coach?.name}
                offer={offer}
              />
            </div>
          );
      }
    }
    return <></>;
  },
);

export default MarketplaceCoachInfos;
