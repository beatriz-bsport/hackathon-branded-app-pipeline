// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { OfflineBolt } from '@material-ui/icons';
import { makeStyles, Tooltip } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import VaccinationBadge from './VaccinationBadge.component';
import AvatarWithBadge from './AvatarWithBadge.component';
import MemberProgramDetailDialog from '../../performance-tracking/components/member-program/MemberProgramDetail.dialog';

type Props = {
  member: Member<Tags<TagGroup>>,
  onEdit?: () => void,
  onClick?: () => void,
  firstBooking?: boolean,
  anonimize?: boolean,
  showVaccinationStatus: boolean,
  createMemberProgram?: (data: any, options?: any) => void,
  programList: Array<PerformanceTrackingProgram>,
  updateMemberMetricValue: (data: any, options?: any) => void,

  fetchPerformanceTrackingData: (member: number) => void,
  firstPrivateBooking: boolean,
  programDataLoading: boolean,
};
export const MemberMinimalListItem = (props: Props) => {
  const classes = useStyles();
  const [isMemberProgramDetailDialogOpen, setIsMemberProgramDetailDialogOpen] =
    React.useState(false);
  const { t } = useTranslation('member');
  if (!props.member) {
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
  if (!props.anonimize) {
    secondaryInfo +=
      props.member.phone || props.member.email
        ? `${props.member.phone || ''} ${props.member.email}` || ''
        : '';
  }
  let Wrapper = (p) => <div>{p.children}</div>;
  if (props.showVaccinationStatus)
    Wrapper = (p) => (
      <VaccinationBadge status={props.member.vaccination_status}>
        {p.children}
      </VaccinationBadge>
    );
  return (
    <>
      <ListItem
        className={classes.listItem}
        button={!!props.onClick}
        onClick={props.onClick ? () => props.onClick(props.member.id) : null}
      >
        <ListItemAvatar>
          <Wrapper>
            <AvatarWithBadge member={props.member} />
          </Wrapper>
        </ListItemAvatar>
        <ListItemText
          primary={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography>
                {props.member.name + (props.firstBooking ? ' ★' : '')}
              </Typography>
              <Typography color="secondary" variant="caption">
                {props.member.archived ? `${'\u00A0'}(${t('archived')})` : ''}
              </Typography>
            </div>
          }
          secondary={secondaryInfo}
        />
        <ListItemSecondaryAction>
          {props.fetchPerformanceTrackingData && !!props.programList?.length && (
            <Tooltip title={t('performanceTracking:metric.statistic')}>
              <IconButton
                onClick={() => {
                  props.fetchPerformanceTrackingData(props.member.id);
                  setIsMemberProgramDetailDialogOpen(true);
                }}
              >
                <OfflineBolt />
              </IconButton>
            </Tooltip>
          )}
          {props.onEdit ? (
            <IconButton onClick={props.onEdit}>
              <EditIcon />
            </IconButton>
          ) : null}
        </ListItemSecondaryAction>
      </ListItem>

      <MemberProgramDetailDialog
        loading={props.programDataLoading}
        open={isMemberProgramDetailDialogOpen}
        closeDialog={() => setIsMemberProgramDetailDialogOpen(false)}
        memberName={props.member.name + (props.firstPrivateBooking ? ' ★' : '')}
        memberProgramList={props.member.memberProgramList}
        updateMemberMetricValue={props.updateMemberMetricValue}
        createMemberProgram={(id) =>
          props.createMemberProgram({
            program: id,
            member: props.member.id,
          })
        }
        programList={props.programList}
      />
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  listItem: {
    minWidth: theme.spacing(50),
  },
}));

export default MemberMinimalListItem;
