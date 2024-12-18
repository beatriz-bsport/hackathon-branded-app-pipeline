import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import SmsIcon from '@material-ui/icons/Sms';
import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
  COMMUNICATION_KIND_SMS,
} from '@bsport/common/lib/master-data/communication-kind';

import { formatAsDatetimeAdapted } from '#src/utils/datetime';
import type {
  Communication,
  CommunicationScheduled,
} from '#src/libs/communication-v2/types';

type Props = {
  communicationScheduled: CommunicationScheduled;
  communicationSent?: Communication;
  editCommunication?: () => void;
  deleteCommunication?: () => void;
  showCommunication?: () => void;
};

type CommunicationScheduledIconProps = { communicationKind: number };

const CommunicationScheduledIcon: React.FC<CommunicationScheduledIconProps> =
  React.memo(({ communicationKind }) => {
    const classes = useStyles();

    switch (communicationKind) {
      case COMMUNICATION_KIND_EMAIL:
        return <MailIcon className={classes.leftIcon} />;
      case COMMUNICATION_KIND_SMS:
        return <SmsIcon className={classes.leftIcon} />;
      case COMMUNICATION_KIND_PUSH_NOTIFICATION:
        return <MobileScreenShareIcon className={classes.leftIcon} />;
      default:
        return <StarIcon className={classes.leftIcon} />;
    }
  });

const CommunicationScheduledItem: React.FC<Props> = ({
  communicationScheduled,
  communicationSent,
  editCommunication,
  deleteCommunication,
  showCommunication,
}) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();

  const openingRate = React.useMemo(
    () =>
      communicationSent
        ? Math.round(
            ((communicationSent?.total_read || 0) /
              communicationSent?.total_recipients || 1) * 100,
          )
        : 0,
    [communicationSent],
  );

  const clickingRate = React.useMemo(
    () =>
      communicationSent
        ? Math.round(
            ((communicationSent?.total_click || 0) /
              communicationSent?.total_recipients || 1) * 100,
          )
        : 0,
    [communicationSent],
  );

  return (
    <>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <CommunicationScheduledIcon
            communicationKind={communicationScheduled.communication_kind}
          />
          <div className={classes.textWrapper}>
            <Typography color="primary" variant="h6">
              {communicationScheduled.title ||
                t(`campaign.kind.${communicationScheduled.communication_kind}`)}
            </Typography>
            {communicationSent && (
              <Typography color="textPrimary" variant="body1">
                {t('scheduled.numberOfRecipients', {
                  count: communicationSent.total_recipients ?? 0,
                })}
              </Typography>
            )}
            <Typography color="textSecondary" variant="body1">
              {t('scheduled.scheduledFor', {
                datetime: formatAsDatetimeAdapted(
                  communicationScheduled.datetime_scheduled,
                  'DDDD t',
                ),
              })}
            </Typography>
          </div>
        </div>
        {communicationSent && (
          <div className={classes.innerContainer}>
            <div className={classes.metrics}>
              <Typography color="inherit" variant="h6">
                {openingRate} %
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {t('scheduled.opened')}
              </Typography>
            </div>
            <div className={classes.metrics}>
              <Typography color="inherit" variant="h6">
                {clickingRate} %
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {t('scheduled.clicked')}
              </Typography>
            </div>
          </div>
        )}
        {communicationSent ? (
          <div className={classes.actions}>
            <Button
              className={classes.button}
              onClick={showCommunication}
              variant="outlined"
            >
              <RemoveRedEyeIcon className={classes.iconButton} />
              {t('scheduled.show')}
            </Button>
          </div>
        ) : (
          <div className={classes.actions}>
            <Button
              className={classes.button}
              color="primary"
              onClick={editCommunication}
              variant="outlined"
            >
              <CreateIcon className={classes.iconButton} />
              {t('scheduled.edit')}
            </Button>
            <Button
              className={classes.button}
              onClick={deleteCommunication}
              variant="outlined"
            >
              <DeleteIcon className={classes.iconButton} />
              {t('scheduled.delete')}
            </Button>
          </div>
        )}
      </div>
      <Divider className={classes.divider} />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    rowGap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  leftIcon: {
    marginTop: 4,
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  innerContainer: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  metrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  actions: {
    display: 'flex',
    minWidth: '220px',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(1),
  },
  iconButton: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(CommunicationScheduledItem);
