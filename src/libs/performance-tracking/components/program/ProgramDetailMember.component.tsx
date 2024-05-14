import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';

import { formatAsDatetimeAdapted } from '#utils/datetime';
import MemberProgramIconWithDetail from '#libs/performance-tracking/components//member-program/MemberProgramIconWithDetail.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
// @ts-ignore
import PaginatedListBase from '#components/PaginatedListBase.component';

import type { Member } from '#libs/member/types';
import type {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';

type Props = {
  program: PerformanceTrackingProgram;
  page: number;
  count: number;
  itemPerPage: number;
  loading: boolean;
  items: PerformanceTrackingMemberProgram<
    number,
    PerformanceTrackingMetric,
    Member
  >[];
  onPageRequested: (page: number, pageSize: number) => void;
  onClickMember?: (member: number, memberProgramId: number) => void;
};

export const ProgramDetailMember: React.FC<Props> = ({
  program,
  page,
  count,
  itemPerPage,
  loading,
  items,
  onPageRequested,
  onClickMember,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('performanceTracking');

  const handleOnClickMember = React.useCallback(
    (item: PerformanceTrackingMemberProgram) => () =>
      item?.member?.id && item?.id && onClickMember?.(item.member.id, item.id),
    [onClickMember],
  );

  const renderPerformanceTrackingMemberItem = React.useCallback(
    (item: PerformanceTrackingMemberProgram) => (
      <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
        {(hasMemberProfileAccessPermission: boolean) => (
          <ListItem
            key={item.id}
            dense
            divider
            // @ts-ignore
            button={!!onClickMember && hasMemberProfileAccessPermission}
            className={classes.listItem}
            disabled={loading}
            onClick={
              hasMemberProfileAccessPermission
                ? handleOnClickMember(item)
                : null
            }
          >
            <div className={classes.listItemFirstPart}>
              {item?.member?.name}
            </div>
            <div className={classes.listItemSecondPart}>
              <MemberProgramIconWithDetail
                metricRecord={item?.metric_record}
                program={program}
              />
            </div>
            <div className={classes.listItemThirdPart}>
              {formatAsDatetimeAdapted(
                moment.unix(item?.metric_record?.general?.date_created),
                'LL',
              )}
            </div>
          </ListItem>
        )}
      </ObjectLevelPermissionProvider>
    ),
    [classes, handleOnClickMember, loading, onClickMember, program],
  );

  return (
    <>
      <Paper>
        <ListItem dense divider className={classes.listItem} disabled={loading}>
          <div className={classes.listItemFirstPart}>
            <Typography className={classes.header}>
              {t('program.member.name')}
            </Typography>
          </div>
          <div className={classes.listItemSecondPart}>
            <Typography className={classes.header}>
              {t('metric.statistic')}
            </Typography>
          </div>
          <div className={classes.listItemThirdPart}>
            <Typography className={classes.header}>
              {t('program.member.addDate')}
            </Typography>
          </div>
        </ListItem>
        <PaginatedListBase
          itemPerPage={itemPerPage}
          items={items}
          listProps={{ dense: true }}
          loading={loading}
          nbItems={count}
          onPageRequested={onPageRequested}
          page={page}
          renderItem={renderPerformanceTrackingMemberItem}
        />
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    fontWeight: 500,
  },
  listItemFirstPart: {
    width: '33%',
  },
  listItemSecondPart: {
    width: '33%',
    display: 'flex',
    justifyContent: 'center',
  },
  listItemThirdPart: {
    width: '33%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  listItem: {
    padding: theme.spacing(2),
  },
}));

export default React.memo(ProgramDetailMember);
