import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import DEFAULT_PROFILE_PICTURE_URL from '../assets/constants';

type Props = {
  imgLinks: Array<string | null>;
  imgStyle?: string;
};

const CustomAvatarGroup: React.FC<Props> = ({ imgLinks, imgStyle }) => {
  const classes = useStyles();

  return (
    <AvatarGroup className={classes.container} spacing="small">
      {imgLinks.map((_imgLink, idx) => {
        const imgLink = _imgLink ?? DEFAULT_PROFILE_PICTURE_URL;
        return (
          <Avatar
            key={`${idx}-${imgLink}`}
            alt={imgLink}
            className={imgStyle ?? classes.img}
            src={imgLink}
          />
        );
      })}
    </AvatarGroup>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
}));

export default CustomAvatarGroup;
