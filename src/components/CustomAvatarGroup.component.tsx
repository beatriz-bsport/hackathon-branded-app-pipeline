import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

type Props = {
  imgLinks: Array<string | null>;
};

const CustomAvatarGroup: React.FC<Props> = ({ imgLinks }) => {
  const classes = useStyles();

  return (
    <AvatarGroup className={classes.container} spacing="small">
      {imgLinks.map((_imgLink, idx) => {
        const imgLink =
          _imgLink ??
          'https://bsport-django-asset-prod.s3.amazonaws.com/gymnast-male.png';
        return (
          <Avatar
            src={imgLink}
            alt={imgLink}
            key={`${idx}-${imgLink}`}
            className={classes.img}
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
