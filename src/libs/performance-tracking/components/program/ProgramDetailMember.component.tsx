// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ListItem, Paper, Typography } from '@material-ui/core';
import moment from 'moment-timezone';
import PaginatedListBase from '../../../../components/PaginatedListBase.component';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import MemberProgramIconWithDetail from '../member-program/MemberProgramIconWithDetail.component';
import { Member } from '#libs/member/types';
import { formatAsDatetimeAdapted } from '../../../../utils/datetime';

type OwnProps = {
  program: PerformanceTrackingProgram;
  page: number;
  count: number;
  itemPerPage: number;
  loading: boolean;
  items: Array<
    PerformanceTrackingMemberProgram<number, PerformanceTrackingMetric, Member>
  >;
  onPageRequested: (page: number, pageSize: number) => void;
  onClickMember?: (member: number, memberProgramId: number) => void;
};
type Props = OwnProps & WithTranslation;
export const ProgramDetailMember = (props: Props) => {
  const {
    t,
    program,
    page,
    count,
    itemPerPage,
    loading,
    items,
    onPageRequested,
    onClickMember,
  } = props;
  const classes = useStyles();

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
          renderItem={(item: PerformanceTrackingMemberProgram) => {
            return (
              <ListItem
                key={item.id}
                dense
                divider
                button={!!onClickMember}
                className={classes.listItem}
                disabled={loading}
                onClick={() => {
                  onClickMember && props.onClickMember(item.member.id, item.id);
                }}
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
            );
          }}
        />
      </Paper>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
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
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  ProgramDetailMember,
);
