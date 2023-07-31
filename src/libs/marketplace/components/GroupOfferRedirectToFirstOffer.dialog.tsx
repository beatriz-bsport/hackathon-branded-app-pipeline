import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core/styles';
import FolderIcon from '@material-ui/icons/Folder';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { OffersGroup } from '#libs/group-offer/types';

type Props = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  group: OffersGroup;
};

export const GroupOfferRedirectToFirstOfferDialog: React.FC<Props> = ({
  open,
  loading,
  onClose,
  group,
}) => {
  const { t } = useTranslation('marketplace');
  const classes = useStyles();

  return (
    <GenericResponsiveDialog open={open}>
      <DialogContent className={classes.fullWidth}>
        <div
          className={classNames(
            classes.paddedContainer,
            classes.flexContainer,
            classes.paddingBottom2,
          )}
        >
          <FolderIcon />
          {!loading && group?.name ? (
            <Typography variant="h6">{group?.name}</Typography>
          ) : (
            <Skeleton animation="wave" width="40%" variant="text" height={40} />
          )}
        </div>
        <Divider className={classes.divider} />
        <div
          className={classNames(classes.paddedContainer, classes.paddingTop2)}
        >
          {!loading && group?.name ? (
            <Typography>
              {t('workshop.warningBookingRedirectToFirstOffer', {
                name: group.name,
              })}
            </Typography>
          ) : (
            <Skeleton
              animation="wave"
              width="100%"
              variant="text"
              height={30}
            />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          disabled={loading}
        >
          {t('workshop.confirm')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    color: theme.palette.primary.main,
  },
  divider: {
    paddingLeft: -theme.spacing(2),
  },
  fullWidth: {
    width: '100%',
    padding: 0,
  },
  paddedContainer: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  paddingTop2: {
    paddingTop: theme.spacing(2),
  },
  paddingBottom2: {
    paddingBottom: theme.spacing(2),
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export default GroupOfferRedirectToFirstOfferDialog;
