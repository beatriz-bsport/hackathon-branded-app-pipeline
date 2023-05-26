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
              coachNameToDisplay={coach?.firstname}
              offer={offer}
              classes={classes}
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
                  picture={coach?.photo}
                  reverse={reverse}
                  classes={coachPictureClasses}
                />
              )}
              <OfferCoachName
                coachNameToDisplay={coach?.firstname}
                offer={offer}
                classes={coachNameClasses}
              />
            </div>
          );

        case MarketPlaceCoachDisplay.FULL_NAME_WITHOUT_PICTURE:
          return (
            <OfferCoachName
              coachNameToDisplay={coach?.name}
              offer={offer}
              classes={classes}
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
                  picture={coach?.photo}
                  reverse={reverse}
                  classes={coachPictureClasses}
                />
              )}
              <OfferCoachName
                coachNameToDisplay={coach?.name}
                offer={offer}
                classes={classes}
              />
            </div>
          );
      }
    }
    return <></>;
  },
);

export default MarketplaceCoachInfos;
