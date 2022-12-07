import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import { MemberMinimal } from '#libs/member/types';
import { MAX_DISPLAY } from '#libs/communication-v2/constants';
import CustomAvatarGroup from '#components/CustomAvatarGroup.component';

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
        <CustomAvatarGroup imgLinks={slicedImageLinks} />
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
