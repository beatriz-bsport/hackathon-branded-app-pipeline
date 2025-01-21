import React from 'react';

import clsx from 'clsx';

import DEFAULT_PROFILE_PICTURE_URL from '../../../../../../assets/constants';

import './styles.css';

export type Props = {
  classes: { [key: string]: string };
  picture: string;
  reverse?: boolean;
};

const OfferCoachPicture: React.FC<Props> = React.memo(
  ({ classes, picture, reverse }) => {
    return (
      <img
        alt="coach-avatar"
        className={clsx('bs-card-offer__content__coach__avatar', {
          'bs-card-offer__content__coach__avatar--reverse': reverse,
          ...classes,
        })}
        src={picture || DEFAULT_PROFILE_PICTURE_URL}
      />
    );
  },
);

export default OfferCoachPicture;
