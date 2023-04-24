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

import type { Tag, TagGroup } from '#libs/tag/types';
import type { Member } from '#libs/member/types';
import type { PerformanceTrackingProgram } from '#libs/performance-tracking/types';
import VaccinationBadge from './VaccinationBadge.component';
import AvatarWithBadge from './AvatarWithBadge.component';
import MemberProgramDetailDialog from '../../performance-tracking/components/member-program/MemberProgramDetail.dialog';

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
      <VaccinationBadge status={member.vaccination_status} topRightIcon>
        {p.children}
      </VaccinationBadge>
    );
  return (
    <>
      <ListItem
        className={classes.listItem}
        button={!!onClick}
        onClick={onClick ? () => onClick(member.id) : null}
      >
        <ListItemAvatar className={classes.avatar}>
          <Wrapper>
            <AvatarWithBadge
              member={member}
              classes={{ badge: 'currencyBadge' }}
              bottomCredit={bottomCredit}
            />
          </Wrapper>
        </ListItemAvatar>
        <ListItemText
          primary={
            <div className={classes.flexDiv}>
              <Typography>
                {member.name + (firstBooking ? ' ★' : '')}
              </Typography>
              <Typography color="secondary" variant="caption">
                {member.archived ? `${'\u00A0'}(${t('archived')})` : ''}
              </Typography>
            </div>
          }
          secondary={secondaryInfo}
        />
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
        loading={programDataLoading}
        open={isMemberProgramDetailDialogOpen}
        closeDialog={() => setIsMemberProgramDetailDialogOpen(false)}
        memberName={member.name + (firstPrivateBooking ? ' ★' : '')}
        memberProgramList={member.memberProgramList}
        updateMemberMetricValue={updateMemberMetricValue}
        createMemberProgram={(id: number) =>
          createMemberProgram({
            program: id,
            member: member.id,
          })
        }
        programList={programList}
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
  },
}));

export default MemberMinimalListItem;
