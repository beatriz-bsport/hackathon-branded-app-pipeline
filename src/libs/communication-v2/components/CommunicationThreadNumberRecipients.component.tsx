import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { Member } from '#libs/member/types';

const MAX_DISPLAY_COMPACT = 2;
const MAX_DISPLAY = 4;

export type Props = {
  members?: Array<Member>;
  photos?: Array<string>;
  numberRecipients?: number;
  compactText?: boolean;
  compactAvatars?: boolean;
};

const CommunicationThreadNumberRecipients = (props: Props) => {
  const { numberRecipients, compactText, compactAvatars } = props;
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
      <AvatarGroup className={classes.container} spacing="small">
        {slicedImageLinks.map((imgLink, idx) => (
          <Avatar
            src={imgLink}
            alt={imgLink}
            key={`${idx}-${imgLink}`}
            className={classes.img}
          />
        ))}
      </AvatarGroup>
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
