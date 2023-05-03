import React from 'react';

import classNames from 'classnames';

import { DEFAULT_AVATAR } from '#libs/associated-coach/utils';

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
        src={picture || DEFAULT_AVATAR}
        className={classNames('bs-card-offer__content__coach__avatar', {
          'bs-card-offer__content__coach__avatar--reverse': reverse,
          ...classes,
        })}
      />
    );
  },
);

export default OfferCoachPicture;
