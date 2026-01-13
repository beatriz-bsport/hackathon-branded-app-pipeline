import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Tooltip from '@material-ui/core/Tooltip';

import PersonIcon from '@material-ui/icons/Person';
import EuroIcon from '@material-ui/icons/Euro';

import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import ConditionalWrapper from '#src/components/ConditionnalWrapper.component';

import type {
  AccessControlBookingOrPrivateBooking,
  MemberVisitREST,
} from '#src/libs/access-control/types';
import { AccessStatus } from '#src/libs/access-control/constants';
import AccessStatusChip from './AccessStatusChip.component';
import AutoCheckedInBooking from './AutoCheckedInBooking.component';
import MemberVisitDetailsCardBookingSection from './MemberVisitDetailsCardBookingSection.component';
import MemberVisitDetailsCardManualEntrySection from './MemberVisitDetailsCardManualEntrySection.component';
import MemberVisitDetailsCardSkeleton from './MemberVisitDetailsCardSkeleton.component';

export type Props = {
  handleOpenMemberPhotoHistoryModal?: () => void;
  isLoading?: boolean;
  locationInformation?: string;
  memberVisit: MemberVisitREST;
  nextBooking: AccessControlBookingOrPrivateBooking;
  onAllowManualEntry: () => void;
  onMemberBillClick: () => void;
  onMemberProfileClick: () => void;
  onRefuseManualEntry: () => void;
};

const MemberVisitDetailsCardContent: React.FC<
  Pick<Props, 'memberVisit' | 'nextBooking'>
> = ({ memberVisit, nextBooking }) => {
  const { member, access_status, access_status_data } = memberVisit;
  const { check_on_passes, automatic_check_in } = access_status_data;
  const { most_relevant_pass_data } = check_on_passes;

  const classes = useStyles({ access_status });
  const { t } = useTranslation('accessControl');

  return (
    <>
      <div className={classes.infoTable}>
        <div className={classes.infoRow}>
          <Typography
            className={classes.infoLabel}
            color="textSecondary"
            variant="body2"
          >
            {t('memberVisitDetails.firstName')}
          </Typography>
          <Typography className={classes.infoField} variant="body1">
            {member.first_name}
          </Typography>
        </div>
        <div className={classes.infoRow}>
          <Typography
            className={classes.infoLabel}
            color="textSecondary"
            variant="body2"
          >
            {t('memberVisitDetails.lastName')}
          </Typography>
          <Typography className={classes.infoField} variant="body1">
            {member.last_name}
          </Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.infoTable}>
        <div className={classes.infoRow}>
          <Typography
            className={classes.infoLabel}
            color="textSecondary"
            variant="body2"
          >
            {automatic_check_in
              ? t('memberVisitDetails.checkedInTo')
              : t('memberVisitDetails.nextBooking')}
          </Typography>
          {automatic_check_in ? (
            <AutoCheckedInBooking
              bookingId={automatic_check_in.booking_id}
              bookingName={automatic_check_in.booking_name}
              memberId={member.id}
            />
          ) : (
            <MemberVisitDetailsCardBookingSection nextBooking={nextBooking} />
          )}
        </div>
        <div className={classes.infoRow}>
          <Typography
            className={classes.infoLabel}
            color="textSecondary"
            variant="body2"
          >
            {t('memberVisitDetails.pass')}
          </Typography>
          {most_relevant_pass_data ? (
            <div className={classes.passInfo}>
              <Typography className={classes.infoField} variant="body1">
                {most_relevant_pass_data?.pass_name}
              </Typography>
              <Typography color="textSecondary" variant="caption">
                {most_relevant_pass_data?.expiration_date
                  ? t('memberVisitDetails.passExpiration', {
                      expirationDate: DateTime.fromISO(
                        most_relevant_pass_data.expiration_date,
                      )
                        .startOf('day')
                        .toLocaleString(DateTime.DATE_SHORT),
                    })
                  : null}
              </Typography>
            </div>
          ) : (
            <Typography color="textSecondary">{t('common:None')}</Typography>
          )}
        </div>
      </div>
    </>
  );
};

const MemberVisitDetailsCard: React.FC<Props> = ({
  handleOpenMemberPhotoHistoryModal,
  isLoading,
  locationInformation,
  memberVisit,
  nextBooking,
  onAllowManualEntry,
  onMemberBillClick,
  onMemberProfileClick,
  onRefuseManualEntry,
}) => {
  const { member, access_status, initial_access_status } = memberVisit ?? {};

  const { t } = useTranslation('accessControl');

  const classes = useStyles({
    access_status,
    isPhotoClickable: !!handleOpenMemberPhotoHistoryModal,
  });

  if (isLoading) {
    return <MemberVisitDetailsCardSkeleton />;
  }
  if (!memberVisit) {
    return null;
  }
  return (
    <Card className={classes.root} variant="outlined">
      <div className={classes.titleContainer}>
        <div className={classes.titleAndChips}>
          <Typography variant="h6">{t('memberVisitDetails.title')}</Typography>
          <div className={classes.chipsContainer}>
            <AccessStatusChip
              accessStatus={access_status}
              initialAccessStatus={initial_access_status}
            />
          </div>
        </div>
        {locationInformation && (
          <Typography
            noWrap
            className={classes.locationInformation}
            color="textSecondary"
            variant="subtitle2"
          >
            {locationInformation}
          </Typography>
        )}
      </div>
      <div className={classes.content}>
        <div className={classes.photoContainer}>
          <ConditionalWrapper
            condition={!handleOpenMemberPhotoHistoryModal}
            wrapper={(children) => (
              <Tooltip
                placement="right"
                title={t('memberVisitDetails.noPreviousPhoto')}
              >
                {children}
              </Tooltip>
            )}
          >
            <img
              alt={member.name}
              aria-hidden="true"
              className={classes.photo}
              onClick={handleOpenMemberPhotoHistoryModal}
              src={member.photo}
            />
          </ConditionalWrapper>
          <div className={classes.ctaButtonsContainer}>
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="member.allowed_actions.accessProfile"
            >
              <Button
                className={clsx(classes.memberCtaButton, classes.profileButton)}
                onClick={onMemberProfileClick}
                size="small"
                startIcon={<PersonIcon />}
                variant="outlined"
              >
                {t('memberVisitDetails.actions.goToProfile')}
              </Button>
            </ObjectLevelPermissionWrapper>
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="billing.allowed_actions.createInvoice"
            >
              <Button
                className={classes.memberCtaButton}
                color="primary"
                onClick={onMemberBillClick}
                size="small"
                startIcon={<EuroIcon />}
                variant="outlined"
              >
                {t('memberVisitDetails.actions.billMember')}
              </Button>
            </ObjectLevelPermissionWrapper>
          </div>
        </div>
        <div className={classes.infoContainer}>
          {memberVisit.access_status_data.check_on_member_account
            .last_photo_update_is_not_approved && (
            <Alert
              action={
                <Button
                  color="inherit"
                  onClick={handleOpenMemberPhotoHistoryModal}
                  size="small"
                >
                  {t('memberVisitDetails.actions.seePreviousImages')}
                </Button>
              }
              className={classes.alert}
              severity="warning"
              variant="outlined"
            >
              <Typography className={classes.alertTitle}>
                {t('memberVisitDetails.photoHasChanged')}
              </Typography>
            </Alert>
          )}
          <MemberVisitDetailsCardContent
            memberVisit={memberVisit}
            nextBooking={nextBooking}
          />
        </div>
      </div>
      <MemberVisitDetailsCardManualEntrySection
        memberVisit={memberVisit}
        onAllowManualEntry={onAllowManualEntry}
        onRefuseManualEntry={onRefuseManualEntry}
      />
    </Card>
  );
};

const useStyles = makeStyles<
  Theme,
  { access_status?: AccessStatus; isPhotoClickable?: boolean }
>((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    borderColor: ({ access_status }) => {
      switch (access_status) {
        case AccessStatus.GREEN:
          return theme.palette.success.main;
        case AccessStatus.ORANGE:
          return theme.palette.warning.main;
        case AccessStatus.RED:
          return theme.palette.error.main;
        default:
          return theme.palette.grey[300];
      }
    },
    borderWidth: 2,
    borderRadius: theme.spacing(1),
  },
  titleAndChips: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipsContainer: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  content: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  photo: {
    borderRadius: theme.spacing(1),
    objectFit: 'cover',
    height: 280,
    cursor: ({ isPhotoClickable }) =>
      isPhotoClickable ? 'pointer' : 'default',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    flexGrow: 1,
  },
  infoTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  infoRow: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  infoLabel: {
    width: 120,
  },
  infoField: {
    fontWeight: 500,
  },
  passInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  alert: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  alertTitle: {
    fontWeight: 500,
  },
  photoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: 280,
  },
  ctaButtonsContainer: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  memberCtaButton: {
    flex: 1,
  },
  profileButton: {
    color: theme.palette.grey[600],
  },
  skeleton: {
    borderRadius: theme.spacing(1),
  },
  locationInformation: {
    fontWeight: 500,
  },
}));

export default React.memo(MemberVisitDetailsCard);
