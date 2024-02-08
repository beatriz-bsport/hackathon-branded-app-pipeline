// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from '@material-ui/core/Avatar';
import Cake from '@material-ui/icons/Cake';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import OfflineBolt from '@material-ui/icons/OfflineBolt';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import moment from 'moment-timezone';

import type { Tag, TagGroup } from '#libs/tag/types';
import type { Member } from '#libs/member/types';
import type { PerformanceTrackingProgram } from '#libs/performance-tracking/types';
import VaccinationBadge from './VaccinationBadge.component';
import AvatarWithBadge from './AvatarWithBadge.component';
import MemberProgramDetailDialog from '../../performance-tracking/components/member-program/MemberProgramDetail.dialog';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

type Props = {
  anonimize?: boolean;
  bottomCredit?: boolean;
  firstBooking?: boolean;
  firstPrivateBooking: boolean;
  isPreventUpdateMetricValue?: boolean;
  member: Member<Tag<TagGroup>>;
  memberLoading?: boolean;
  programDataLoading: boolean;
  programList: PerformanceTrackingProgram[];
  showVaccinationStatus: boolean;
  createMemberProgram?: (data: any, options?: any) => void;
  fetchPerformanceTrackingData: (member: number) => void;
  onClick?: (memberId: number) => void;
  onEdit?: () => void;
  updateMemberMetricValue: (data: any, options?: any) => void;
};

export const MemberMinimalListItem: React.FC<Props> = ({
  anonimize,
  bottomCredit,
  firstBooking,
  firstPrivateBooking,
  isPreventUpdateMetricValue,
  member,
  memberLoading,
  programDataLoading,
  programList,
  showVaccinationStatus,
  createMemberProgram,
  fetchPerformanceTrackingData,
  onClick,
  onEdit,
  updateMemberMetricValue,
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

  let secondaryInfo = '';
  if (!anonimize) {
    secondaryInfo +=
      member.phone || member.email
        ? `${member.phone || ''} ${member.email || ''}`
        : '';
  }

  let Wrapper = (props: { children: React.ReactNode }) => (
    <div>{props.children}</div>
  );
  if (showVaccinationStatus)
    Wrapper = (props) => (
      <VaccinationBadge topRightIcon status={member.vaccination_status}>
        {props.children}
      </VaccinationBadge>
    );

  const isBirthday = member?.birthday
    ? moment().format('MM-DD') === moment(member.birthday).format('MM-DD')
    : false;

  return (
    <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
      {(hasMemberProfileAccessPermission: boolean) => (
        <>
          <ListItem
            button={(!!onClick && hasMemberProfileAccessPermission) as any}
            className={classes.listItem}
            onClick={hasMemberProfileAccessPermission ? handleOnClick : null}
          >
            <ListItemAvatar className={classes.avatar}>
              <Wrapper>
                <AvatarWithBadge
                  bottomCredit={bottomCredit}
                  classes={{ badge: 'currencyBadge' }}
                  member={member}
                />
              </Wrapper>
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
                secondary={hasMemberProfileAccessPermission && secondaryInfo}
              />
            ) : (
              memberLoading && <CircularProgress />
            )}
            <ListItemSecondaryAction>
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
            </ListItemSecondaryAction>
          </ListItem>

          <MemberProgramDetailDialog
            closeDialog={closeMemberProgramDetailDialog}
            createMemberProgram={handleCreateMemberProgram}
            isPreventUpdateMetricValue={isPreventUpdateMetricValue}
            loading={programDataLoading}
            memberName={member.name + (firstPrivateBooking ? ' ★' : '')}
            memberProgramList={member.memberProgramList}
            open={isMemberProgramDetailDialogOpen}
            programList={programList}
            updateMemberMetricValue={updateMemberMetricValue}
          />
        </>
      )}
    </ObjectLevelPermissionProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  listItem: {
    minWidth: theme.spacing(50),
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
}));

export default React.memo(MemberMinimalListItem);
