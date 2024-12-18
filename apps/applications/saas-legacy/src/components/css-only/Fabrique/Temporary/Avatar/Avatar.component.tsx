import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { Building05, User01 } from '#src/components/untitledui';
import type { AvatarSize, AvatarType } from './types';
import { AvatarSizeEnum, AvatarTypeEnum } from './constants';
import DEFAULT_PROFILE_PICTURE_URL from '#src/assets/constants';
import './styles.css';

export type AvatarProps = {
  picture?: string;
  size?: AvatarSize;
  className?: string;
  classes?: { icon: string };
  type?: AvatarType;
};

const Avatar: React.FC<AvatarProps> = ({
  picture,
  size,
  className,
  classes,
  type,
}) => {
  const avatarSizeClassName = React.useMemo(() => {
    switch (size) {
      case AvatarSizeEnum.XL:
        return 'bs-fabrique-avatar--xl';
      case AvatarSizeEnum.LG:
        return 'bs-fabrique-avatar--lg';
      case AvatarSizeEnum.SM:
        return 'bs-fabrique-avatar--sm';
      default:
        return 'bs-fabrique-avatar--md';
    }
  }, [size]);

  const avatarIconClassName = React.useMemo(() => {
    switch (size) {
      case AvatarSizeEnum.XL:
        return 'bs-fabrique-avatar__icon--xl';
      case AvatarSizeEnum.LG:
        return 'bs-fabrique-avatar__icon--lg';
      case AvatarSizeEnum.SM:
        return 'bs-fabrique-avatar__icon--sm';
      default:
        return 'bs-fabrique-avatar__icon--md';
    }
  }, [size]);

  const noPicture = !picture || picture === DEFAULT_PROFILE_PICTURE_URL;

  if (noPicture) {
    return (
      <div
        className={classNames(
          'bs-fabrique-avatar',
          avatarSizeClassName,
          className,
        )}
      >
        {type === AvatarTypeEnum.PLACE ? (
          <Building05
            className={classNames(
              'bs-fabrique-avatar__icon',
              avatarIconClassName,
              classes?.icon,
            )}
          />
        ) : (
          <User01
            className={classNames(
              'bs-fabrique-avatar__icon',
              avatarIconClassName,
              classes?.icon,
            )}
          />
        )}
      </div>
    );
  }

  return (
    <img
      alt="user"
      className={classNames(
        'bs-fabrique-avatar',
        avatarSizeClassName,
        className,
      )}
      src={picture}
    />
  );
};

export const AvatarStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Avatar>>()(Avatar);
export default React.memo(Avatar);
