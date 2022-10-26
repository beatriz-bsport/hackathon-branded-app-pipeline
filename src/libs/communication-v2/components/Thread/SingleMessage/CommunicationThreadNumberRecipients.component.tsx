import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { CircularProgress } from '@material-ui/core';
import { MemberMinimal } from '#libs/member/types';
import { MAX_DISPLAY } from '#libs/communication-v2/constants';

const MAX_DISPLAY_COMPACT = 2;

export type Props = {
  members?: Array<MemberMinimal>;
  photos?: Array<string>;
  numberRecipients?: number;
  compactText?: boolean;
  compactAvatars?: boolean;
  loading?: boolean;
};

const CommunicationThreadNumberRecipients = (props: Props) => {
  const { numberRecipients, compactText, compactAvatars, loading } = props;
  const allImageLinks =
    props.members?.length > 0
      ? props.members.map((m) => m.photo)
      : props.photos || [];
  const nbImagesMax = compactAvatars ? MAX_DISPLAY_COMPACT : MAX_DISPLAY;
  const slicedImageLinks =
    allImageLinks.length > nbImagesMax
      ? allImageLinks.slice(0, nbImagesMax)
      : allImageLinks;

  const { t } = useTranslation(['communication']);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <AvatarGroup className={classes.container} spacing="small">
          {slicedImageLinks.map((_imgLink, idx) => {
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
      )}
      {numberRecipients && numberRecipients > 0 && (
        <Typography variant="body2" className={classes.text}>
          {t(
            `recipient.${
              compactText ? 'numberOfRecipientsCompact' : 'numberOfRecipients'
            }`,
            { count: numberRecipients },
          )}
        </Typography>
      )}
    </div>
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
  text: {
    paddingLeft: theme.spacing(1),
  },
}));

export default CommunicationThreadNumberRecipients;
