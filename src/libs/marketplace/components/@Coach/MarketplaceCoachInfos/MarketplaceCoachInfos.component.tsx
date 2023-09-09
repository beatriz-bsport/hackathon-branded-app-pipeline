import React from 'react';
import classNames from 'classnames';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';

import OfferCoachName from './OfferCoachName';
import OfferCoachPicture from './OfferCoachPicture';

import type { Theme } from '#libs/theme/types';
import type { Coach } from '#libs/associated-coach/types';
import type { Offer } from '#libs/offer/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';

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
