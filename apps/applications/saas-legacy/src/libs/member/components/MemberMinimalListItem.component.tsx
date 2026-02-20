import React from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import Avatar from '@material-ui/core/Avatar';
import Cake from '@material-ui/icons/Cake';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import OfflineBolt from '@material-ui/icons/OfflineBolt';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import type { Tag, TagGroup } from '#src/libs/tag/types';
import type { Member } from '#src/libs/member/types';
import type { PerformanceTrackingProgram } from '#src/libs/performance-tracking/types';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import CheckPermission from '#src/libs/role/components/CheckPermission.component';
import CheckInButton from '#src/libs/access-control/components/CheckInButton.component';
import AvatarWithBadge from './AvatarWithBadge.component';
import MemberProgramDetailDialog from '../../performance-tracking/components/member-program/MemberProgramDetail.dialog';
import { PrivateConsumerPass } from '#src/libs/private-service/types';

type Props = {
  bottomCredit?: boolean;
  privateConsumerPass: PrivateConsumerPass | null;
  disableAccessMonitoringButton?: boolean;
  firstBooking?: boolean;
  firstPrivateBooking: boolean;
  isPreventUpdateMetricValue?: boolean;
  member: Member<Tag<TagGroup>>;
  memberLoading?: boolean;
  programDataLoading: boolean;
  programList: PerformanceTrackingProgram[];
  createMemberProgram?: (data: any, options?: any) => void;
  fetchPerformanceTrackingData: (member: number) => void;
  onClick?: (memberId: number) => void;
  onEdit?: () => void;
  updateMemberMetricValue: (data: any, options?: any) => void;
  onCheckin: () => void;
};

export const MemberMinimalListItem: React.FC<Props> = ({
  bottomCredit,
  disableAccessMonitoringButton,
  firstBooking,
  firstPrivateBooking,
  isPreventUpdateMetricValue,
  member,
  memberLoading,
  privateConsumerPass,
  programDataLoading,
  programList,
  createMemberProgram,
  fetchPerformanceTrackingData,
  onClick,
  onEdit,
  updateMemberMetricValue,
  onCheckin,
}) => {
  const classes = useStyles();
  const [isMemberProgramDetailDialogOpen, setIsMemberProgramDetailDialogOpen] =
    React.useState(false);
  const { t } = useTranslation('member');

  const handleOnClick = React.useCallback(
    () => member?.id && onClick?.(member.id),
    [member?.id, onClick],
  );

  const closeMemberProgramDetailDialog = React.useCallback(
    () => setIsMemberProgramDetailDialogOpen(false),
    [],
  );

  const openMemberProgramDetailDialog = React.useCallback(() => {
    member?.id && fetchPerformanceTrackingData(member.id);
    setIsMemberProgramDetailDialogOpen(true);
  }, [fetchPerformanceTrackingData, member?.id]);

  const handleCreateMemberProgram = React.useCallback(
    (id: number) =>
      member?.id &&
      createMemberProgram({
        program: id,
        member: member.id,
      }),
    [createMemberProgram, member?.id],
  );

  if (!member) {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText primary=" - " />
      </ListItem>
    );
  }

  const memberContactInfo = [member.phone, member.email]
    .filter(Boolean)
    .join(' ');

  const passAvailableCredits = privateConsumerPass?.private_pass?.credits
    ? privateConsumerPass.private_pass.credits -
      (privateConsumerPass.used_credits || 0)
    : null;
  const privateConsumerPassInfo = [
    privateConsumerPass?.private_pass?.name,
    passAvailableCredits !== null
      ? `${passAvailableCredits}/${privateConsumerPass?.private_pass?.credits}`
      : null,
  ]
    .filter(Boolean)
    .join(' ');

  const isBirthday = member?.birthday
    ? DateTime.now().day === DateTime.fromISO(member.birthday).day &&
      DateTime.now().month === DateTime.fromISO(member.birthday).month
    : false;

  const showVerticalDivider =
    (!!fetchPerformanceTrackingData && !!programList?.length) ||
    !!onEdit ||
    !!onCheckin;

  return (
    <ObjectLevelPermissionProvider
      requiredPermission={[
        'member.allowed_actions.accessProfile',
        'member.allowed_actions.readInfo',
      ]}
    >
      {([
        hasMemberProfileAccessPermission,
        hasMemberReadInfoPermission,
      ]: boolean[]) => (
        <div className={classes.root}>
          <ListItem
            button={(!!onClick && hasMemberProfileAccessPermission) as any}
            className={classes.listItem}
            onClick={hasMemberProfileAccessPermission ? handleOnClick : null}
          >
            <ListItemAvatar className={classes.avatar}>
              <AvatarWithBadge
                bottomCredit={bottomCredit}
                classes={{ badge: 'currencyBadge' }}
                member={member}
              />
            </ListItemAvatar>
            {member?.name ? (
              <ListItemText
                primary={
                  <div className={classes.flexDiv}>
                    <Typography>
                      {member.name + (firstBooking ? ' ★' : '')}
                    </Typography>
                    {isBirthday && (
                      <Cake color="secondary" style={{ fontSize: '14px' }} />
                    )}
                    <Typography color="secondary" variant="caption">
                      {member.archived ? `${'\u00A0'}(${t('archived')})` : ''}
                    </Typography>
                  </div>
                }
                secondary={
                  hasMemberReadInfoPermission && (
                    <>
                      {memberContactInfo && (
                        <Typography color="textSecondary" variant="body2">
                          {memberContactInfo}
                        </Typography>
                      )}
                      {privateConsumerPassInfo && (
                        <Typography color="textSecondary" variant="body2">
                          {privateConsumerPassInfo}
                        </Typography>
                      )}
                    </>
                  )
                }
                secondaryTypographyProps={{
                  noWrap: true,
                }}
              />
            ) : (
              memberLoading && <CircularProgress />
            )}
          </ListItem>
          <div className={classes.secondaryActions}>
            {showVerticalDivider && <div className={classes.verticalDivider} />}
            {!!fetchPerformanceTrackingData && !!programList?.length && (
              <Tooltip title={t('performanceTracking:metric.statistic')}>
                <IconButton onClick={openMemberProgramDetailDialog}>
                  <OfflineBolt />
                </IconButton>
              </Tooltip>
            )}
            {!!onEdit && (
              <IconButton onClick={onEdit}>
                <EditIcon />
              </IconButton>
            )}
            {!!onCheckin && (
              // @ts-expect-error
              <CheckPermission requiredPermissions="navigationMenu.accessMonitoring.perform">
                <CheckInButton
                  disabled={disableAccessMonitoringButton}
                  handleCheckIn={onCheckin}
                />
              </CheckPermission>
            )}
          </div>

          <MemberProgramDetailDialog
            closeDialog={closeMemberProgramDetailDialog}
            createMemberProgram={handleCreateMemberProgram}
            isPreventUpdateMetricValue={isPreventUpdateMetricValue}
            loading={programDataLoading}
            memberName={member.name + (firstPrivateBooking ? ' ★' : '')}
            // @ts-expect-error
            memberProgramList={member.memberProgramList}
            open={isMemberProgramDetailDialogOpen}
            programList={programList}
            updateMemberMetricValue={updateMemberMetricValue}
          />
        </div>
      )}
    </ObjectLevelPermissionProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  listItem: {
    minWidth: theme.spacing(40),
  },
  avatar: {
    margin: theme.spacing(1),
  },
  flexDiv: {
    display: 'flex',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
  },
  secondaryActions: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(2),
    width: 'max-content',
  },
  verticalDivider: {
    width: 1,
    height: theme.spacing(5),
    backgroundColor: theme.palette.divider,
    marginRight: theme.spacing(2),
  },
}));

export default React.memo(MemberMinimalListItem);
