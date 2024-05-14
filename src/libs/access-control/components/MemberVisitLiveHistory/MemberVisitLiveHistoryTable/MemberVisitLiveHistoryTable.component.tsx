import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Pagination from '@material-ui/lab/Pagination';

import AccessStatusChip from '#libs/access-control/components/MemberVisit/MemberVisitDetailsCard/AccessStatusChip.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import MemberVisitLiveHistoryTableSkeleton from './MemberVisitLiveHistoryTableSkeleton.component';

import {
  EntryStatus,
  FETCH_MEMBER_VISIT_PAGE_SIZE,
} from '#libs/access-control/constants';
import type { OptionCallback } from 'src/state/types';
import type {
  AccessControlState,
  MemberVisitQueryParams,
  MemberVisitREST,
} from '#libs/access-control/types';
import classNames from 'classnames';

export type Props = {
  getMemberVisitList: (
    params: MemberVisitQueryParams,
    options?: OptionCallback<MemberVisitREST[]>,
  ) => void;
  handleMemberProfileClick: (memberId: number) => void;
  handleSelectMemberVisit: (memberVisit: MemberVisitREST) => void;
  isLoading: boolean;
  memberVisitList: MemberVisitREST[];
  memberVisitState: AccessControlState['memberVisit'];
};

type RowProps = {
  divider: boolean;
  handleMemberProfileClick: (memberId: number) => void;
  handleSelectMemberVisit: (memberVisit: MemberVisitREST) => void;
  memberVisit: MemberVisitREST;
};

const MemberVisitLiveHistoryRow: React.FC<RowProps> = ({
  divider,
  handleMemberProfileClick,
  handleSelectMemberVisit,
  memberVisit,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const handleMemberNameClick = useCallback(() => {
    handleMemberProfileClick(memberVisit.member.id);
  }, [handleMemberProfileClick, memberVisit.member.id]);

  const handleOpenMemberVisitDetails = useCallback(() => {
    handleSelectMemberVisit(memberVisit);
  }, [handleSelectMemberVisit, memberVisit]);

  const entryStatusText = useMemo<string | JSX.Element>(() => {
    switch (memberVisit.entry_status) {
      case EntryStatus.ENTERED:
        return t('liveHistory.table.entered');
      case EntryStatus.NOT_ENTERED:
        return t('liveHistory.table.refusedEntry');
      case EntryStatus.UNKNOWN:
        return (
          <span
            onClick={handleOpenMemberVisitDetails}
            className={classes.clickableViewDetails}
          >
            {t('liveHistory.table.entryUnknown')}
          </span>
        );
      default:
        return '';
    }
  }, [t, memberVisit.entry_status]);

  const visitReasonElement = useMemo(() => {
    if (
      memberVisit.access_status_data.check_on_bookings
        .most_relevant_booking_data?.booking_name
    ) {
      return (
        <ListItemText
          primary={
            memberVisit.access_status_data.check_on_bookings
              .most_relevant_booking_data.booking_name
          }
          className={classes.flex1}
        />
      );
    }
    return (
      <ListItemText
        primary={t('common:none')}
        className={classNames(classes.flex1, classes.textSecondary)}
      />
    );
  }, [
    memberVisit.access_status_data.check_on_bookings.most_relevant_booking_data
      ?.booking_name,
    t,
  ]);

  return (
    <ListItem divider={divider} className={classes.listItem}>
      <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
        {(hasMemberProfileAccessPermission: boolean) => (
          <ListItemText
            className={classes.flex1}
            primary={
              hasMemberProfileAccessPermission ? (
                <span
                  className={classes.clickableMemberName}
                  onClick={handleMemberNameClick}
                >
                  {memberVisit.member.name}
                </span>
              ) : (
                memberVisit.member.name
              )
            }
            primaryTypographyProps={{ noWrap: true }}
            secondary={entryStatusText}
            secondaryTypographyProps={{
              color:
                memberVisit.entry_status === EntryStatus.UNKNOWN
                  ? 'error'
                  : 'textSecondary',
            }}
          />
        )}
      </ObjectLevelPermissionProvider>

      {visitReasonElement}

      <ListItemText
        className={classes.flex1}
        primary={DateTime.fromISO(memberVisit.datetime_created).toLocaleString(
          DateTime.TIME_SIMPLE,
        )}
        secondary={DateTime.fromISO(
          memberVisit.datetime_created,
        ).toLocaleString(DateTime.DATE_SHORT)}
      />

      <div className={classes.accessStatusChips}>
        <AccessStatusChip
          initialAccessStatus={memberVisit.initial_access_status}
          accessStatus={memberVisit.access_status}
        />
      </div>

      <Button
        onClick={handleOpenMemberVisitDetails}
        variant="outlined"
        className={classes.button}
      >
        <ChevronRight />
      </Button>
    </ListItem>
  );
};

const MemberVisitLiveHistoryTable: React.FC<Props> = ({
  getMemberVisitList,
  handleMemberProfileClick,
  handleSelectMemberVisit,
  isLoading,
  memberVisitList,
  memberVisitState,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const { count, page } = memberVisitState;

  const handlePaginationClick = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      getMemberVisitList({ page });
    },
    [],
  );

  if (isLoading) {
    return <MemberVisitLiveHistoryTableSkeleton />;
  }

  if (!memberVisitList?.length) {
    return null;
  }

  return (
    <Card className={classes.root} variant="outlined">
      <List>
        <ListItem dense className={classes.listItem} divider>
          <ListItemText
            className={classes.flex1}
            secondary={t('liveHistory.table.member')}
          />
          <ListItemText
            className={classes.flex1}
            secondary={t('liveHistory.table.session')}
          />
          <ListItemText
            className={classes.flex1}
            secondary={t('liveHistory.table.time')}
          />
          <ListItemText
            secondary={t('liveHistory.table.accessStatus')}
            className={classes.accessStatusChips}
          />
          <div className={classes.button} />
        </ListItem>
        {memberVisitList.map((memberVisit, index) => (
          <MemberVisitLiveHistoryRow
            divider={index !== memberVisitList.length - 1}
            key={memberVisit.id}
            memberVisit={memberVisit}
            handleMemberProfileClick={handleMemberProfileClick}
            handleSelectMemberVisit={handleSelectMemberVisit}
          />
        ))}
      </List>
      <Pagination
        page={page}
        count={Math.ceil(count / FETCH_MEMBER_VISIT_PAGE_SIZE)}
        size="large"
        onChange={handlePaginationClick}
      />
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  accessStatusChips: {
    display: 'flex',
    flex: 'inherit',
    justifyContent: 'flex-end',
    width: 200,
  },
  button: {
    alignItems: 'center',
    color: theme.palette.grey[600],
    display: 'inline-flex',
    height: 36,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    width: 36,
  },
  clickableMemberName: {
    color: theme.palette.info.dark,
    cursor: 'pointer',
    fontWeight: 500,
  },
  clickableViewDetails: {
    cursor: 'pointer',
  },
  flex1: {
    flex: 1,
  },
  listItem: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(2),
  },
  root: {
    borderColor: theme.palette.grey[300],
    borderRadius: 2 * theme.shape.borderRadius,
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
}));

export default React.memo(MemberVisitLiveHistoryTable);
