// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core/styles';
import FolderIcon from '@material-ui/icons/Folder';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import moment from 'moment-timezone';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

import { Offer, Offer_FULL } from '#libs/offer/types';

type Props = {
  selectedOffer: (Offer_FULL & { redirect: string }) | null;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  getOffersListByGroup: (ids: number) => Offer[];
};

export const GroupRulePopup: React.FC<Props> = ({
  selectedOffer,
  open,
  loading,
  onClose,
  onSubmit,
  getOffersListByGroup,
}) => {
  const { t } = useTranslation(['marketplace']);
  const classes = useStyles();

  const { group } = selectedOffer;
  const { first_offer_date, allow_booking_after_start } = group;
  const offersList = getOffersListByGroup(group.id);

  const [offersForcedToBeBooked, setOffersForcedToBeBooked] = React.useState(
    [],
  );

  const anchorDate = allow_booking_after_start
    ? moment().format()
    : first_offer_date;

  React.useEffect(() => {
    if (offersList) {
      if (group.allow_booking_after_start) {
        setOffersForcedToBeBooked(
          offersList.filter((_offer) =>
            moment(_offer?.date_start).isSameOrAfter(moment(anchorDate)),
          ),
        );
      } else {
        setOffersForcedToBeBooked(offersList);
      }
    } else {
      setOffersForcedToBeBooked([]);
    }
  }, [offersList, group, anchorDate]);

  return (
    <GenericResponsiveDialog maxWidth="xs" open={open} onClose={onClose}>
      {loading && <LinearProgress />}
      <DialogContent className={classes.fullWidth}>
        <div
          className={classNames(
            classes.paddedContainer,
            classes.flexContainer,
            classes.paddingBottom2,
          )}
        >
          <FolderIcon />
          <Typography variant="h6">{group.name}</Typography>
        </div>
        <Divider className={classes.divider} />
        <div
          className={classNames(classes.paddedContainer, classes.paddingTop2)}
        >
          <Typography>
            {t(
              group.full_booking_only
                ? 'workshop.warningFullBooking'
                : 'workshop.warningPartialBooking',
              { count: offersForcedToBeBooked?.length ?? 0 },
            )}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          {t('workshop.cancel')}
        </Button>
        <Button className={classes.button} onClick={onSubmit}>
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

export default GroupRulePopup;
