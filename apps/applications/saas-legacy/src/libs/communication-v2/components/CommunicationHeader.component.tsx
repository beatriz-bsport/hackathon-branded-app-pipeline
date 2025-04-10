import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { SEND_COMMUNICATION_ON_JOIN } from '@bsport/common/lib/master-data/smart-list';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';

const CommunicationHeader = () => {
  const {
    communicationTitle,
    communicationMember,
    automatedCommunicationKind,
    automatedCommunicationDraft,
    onCloseCommunicationDrawer,
  } = useCommunicationContext();
  const communicationPhoto = communicationMember?.photo;
  const classes = useStyles();
  const { t } = useTranslation('communication');

  const getTitle = useCallback(() => {
    if (automatedCommunicationDraft) {
      return automatedCommunicationKind === SEND_COMMUNICATION_ON_JOIN
        ? t('campaign.automated.form.subtitles.update.joinSmartList')
        : t('campaign.automated.form.subtitles.update.leftSmartList');
    } else if (automatedCommunicationKind !== -1) {
      return automatedCommunicationKind === SEND_COMMUNICATION_ON_JOIN
        ? t('campaign.automated.form.subtitles.create.joinSmartList')
        : t('campaign.automated.form.subtitles.create.leftSmartList');
    }
    return communicationMember ? communicationMember.name : communicationTitle;
  }, [
    communicationMember,
    communicationTitle,
    automatedCommunicationKind,
    automatedCommunicationDraft,
    t,
  ]);

  const drawerTitle = useMemo(() => getTitle(), [getTitle]);

  return (
    <div className={classes.container}>
      <div className={classes.textContainer}>
        {communicationPhoto && (
          <Avatar
            alt={communicationPhoto}
            className={classes.avatar}
            src={communicationPhoto}
          />
        )}
        <Typography className={classes.text} variant="body1">
          {drawerTitle}
        </Typography>
      </div>
      <IconButton onClick={onCloseCommunicationDrawer} size="small">
        <CloseIcon />
      </IconButton>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingBottom: theme.spacing(1.5),
      paddingTop: theme.spacing(1.5),
    },
    borderBottom: 'solid 1px',
    borderBottomColor: theme.palette.divider,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(2),
    },
  },
}));

export default React.memo(CommunicationHeader);
