import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import type { UserPhotoUpdate } from '#libs/access-control/types';

type Props = {
  memberPhotoHistory: UserPhotoUpdate[];
  onClose: () => void;
  onValidateIdentity: () => void;
  open: boolean;
};

const MemberPhotoHistoryModal: React.FC<Props> = ({
  memberPhotoHistory,
  onClose,
  onValidateIdentity,
  open,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{t(`modals.memberPhotoHistory.title`)}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.photoContainer}>
          {memberPhotoHistory.map(({ previous_photo, datetime_created }) => (
            <div className={classes.photoBox} key={datetime_created}>
              <img
                alt={previous_photo}
                className={classes.photo}
                src={previous_photo}
              />
              <Typography className={classes.photoLabel}>
                {t('modals.memberPhotoHistory.uploadedOn', {
                  date: moment(datetime_created).format('L'),
                })}
              </Typography>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t(`common:close`)}</Button>
        {onValidateIdentity && (
          <Button autoFocus color="primary" onClick={onValidateIdentity}>
            {t(`modals.memberPhotoHistory.validateIdentity`)}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  photoContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    justifyContent: 'flex-start',
  },
  photoBox: {
    position: 'relative',
    // Necessary, to avoid an unwanted margin and ensure a good placement of the label
    lineHeight: 0,
  },
  photoLabel: {
    position: 'absolute',
    bottom: 0,
    // Reproduce the style of the MUI tooltip
    backgroundColor: 'rgba(97, 97, 97, 0.9)',
    borderRadius: 4,
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.4,
    maxWidth: 300,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    wordWrap: 'break-word',
  },
  photo: {
    borderRadius: theme.shape.borderRadius,
    height: 178,
    objectFit: 'cover',
    width: 178,
  },
}));

export default React.memo(MemberPhotoHistoryModal);
