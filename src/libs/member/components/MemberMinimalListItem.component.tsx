// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import OfflineBolt from '@material-ui/icons/OfflineBolt';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/';

import moment from 'moment-timezone';
import { Cake } from '@material-ui/icons';

import type { Tag, TagGroup } from '#libs/tag/types';
import type { Member } from '#libs/member/types';
import type { PerformanceTrackingProgram } from '#libs/performance-tracking/types';
import VaccinationBadge from './VaccinationBadge.component';
import AvatarWithBadge from './AvatarWithBadge.component';
import MemberProgramDetailDialog from '../../performance-tracking/components/member-program/MemberProgramDetail.dialog';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

type Props = {
  member: Member<Tag<TagGroup>>;
  onEdit?: () => void;
  onClick?: (memberId: number) => void;
  firstBooking?: boolean;
  anonimize?: boolean;
  showVaccinationStatus: boolean;
  createMemberProgram?: (data: any, options?: any) => void;
  programList: Array<PerformanceTrackingProgram>;
  updateMemberMetricValue: (data: any, options?: any) => void;

  fetchPerformanceTrackingData: (member: number) => void;
  firstPrivateBooking: boolean;
  programDataLoading: boolean;
  bottomCredit?: boolean;
  isPreventUpdateMetricValue?: boolean;
};
export const MemberMinimalListItem: React.FC<Props> = ({
  member,
  onEdit,
  onClick,
  firstBooking,
  anonimize,
  showVaccinationStatus,
  createMemberProgram,
  programList,
  updateMemberMetricValue,
  fetchPerformanceTrackingData,
  firstPrivateBooking,
  programDataLoading,
  bottomCredit,
  isPreventUpdateMetricValue,
}) => {
  const classes = useStyles();
  const [isMemberProgramDetailDialogOpen, setIsMemberProgramDetailDialogOpen] =
    React.useState(false);
  const { t } = useTranslation('member');
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
        ? `${member.phone || ''} ${member.email}` || ''
        : '';
  }
  let Wrapper = (p) => <div>{p.children}</div>;
  if (showVaccinationStatus)
    Wrapper = (p) => (
      <VaccinationBadge topRightIcon status={member.vaccination_status}>
        {p.children}
      </VaccinationBadge>
    );

  const isBirthday = member?.birthday
    ? moment().format('MM-DD') === moment(member.birthday).format('MM-DD')
    : false;

  return (
    <>
      <ListItem
        button={!!onClick}
        className={classes.listItem}
        onClick={onClick ? () => onClick(member.id) : null}
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
        <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
          {(hasMemberProfileAccessPermission: boolean) => (
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
          )}
        </ObjectLevelPermissionProvider>
        <ListItemSecondaryAction>
          {fetchPerformanceTrackingData && !!programList?.length && (
            <Tooltip title={t('performanceTracking:metric.statistic')}>
              <IconButton
                onClick={() => {
                  fetchPerformanceTrackingData(member.id);
                  setIsMemberProgramDetailDialogOpen(true);
                }}
              >
                <OfflineBolt />
              </IconButton>
            </Tooltip>
          )}
          {onEdit ? (
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
          ) : null}
        </ListItemSecondaryAction>
      </ListItem>

      <MemberProgramDetailDialog
        closeDialog={() => setIsMemberProgramDetailDialogOpen(false)}
        createMemberProgram={(id: number) =>
          createMemberProgram({
            program: id,
            member: member.id,
          })
        }
        isPreventUpdateMetricValue={isPreventUpdateMetricValue}
        loading={programDataLoading}
        memberName={member.name + (firstPrivateBooking ? ' ★' : '')}
        memberProgramList={member.memberProgramList}
        open={isMemberProgramDetailDialogOpen}
        programList={programList}
        updateMemberMetricValue={updateMemberMetricValue}
      />
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
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

export default MemberMinimalListItem;
