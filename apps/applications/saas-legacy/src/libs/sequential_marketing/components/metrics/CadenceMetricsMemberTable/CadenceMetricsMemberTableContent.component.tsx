import React from 'react';
import { useHistory } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import CustomChip from '#src/components/chip/CustomChip.component';
import {
  CadenceMetricsSizes,
  DestinationStatus,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';
import { formatAsDate, formatAsDatetime } from '#src/utils/datetime';

import type {
  CadenceMembersInData,
  CadenceMembersOutData,
  CadenceStep,
} from '#src/libs/sequential_marketing/types';
import { Member } from '#src/libs/member/types';
import DEFAULT_PROFILE_PICTURE_URL from '../../../../../assets/constants';

const ResponsiveTable = withStyles(() => ({
  root: {
    tableLayout: 'fixed',
  },
}))(Table);

const MUITableCell = withStyles((theme) => ({
  root: {
    borderBottom: 'none',
    padding: theme.spacing(0.5, 0, 0.5, 0),
  },
}))(TableCell);

const getChipInfoFromStatus = (
  status: DestinationStatus | null,
  t: TFunction,
) => {
  switch (status) {
    case DestinationStatus.WIN:
      return {
        label: t('cadence.form.exit.exit_success_label'),
        icon: 'CheckCircle',
        color: SequentialMarketingColors.ENTRY_TEXT_COLOR,
      };
    case DestinationStatus.FAIL:
      return {
        label: t('cadence.form.exit.exit_fail_label'),
        icon: 'Cancel',
        color: SequentialMarketingColors.LOSE_COLOR,
      };
    default:
      return { label: '', icon: '', color: '' };
  }
};

const getChipFromStatus = (status: DestinationStatus | null, t: TFunction) => {
  const { label, icon, color } = getChipInfoFromStatus(status, t);
  return (
    <CustomChip
      align="right"
      displayedValue={label}
      icon={icon}
      mainColor={color}
    />
  );
};

const MEMBER_PROFILE_REDIRECTION = (memberId: number) => `/member/${memberId}`;

type Props = {
  isHistoric: boolean;
  membersById: {
    [id: string]: Member<number, number>;
  };
  membersInData?: CadenceMembersInData[];
  membersOutData?: CadenceMembersOutData[];
  getCadenceStep: (stepId: number) => CadenceStep;
};

const CadenceMetricsMemberTableContent: React.FC<Props> = ({
  isHistoric,
  membersById,
  membersInData,
  membersOutData,
  getCadenceStep,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');
  const history = useHistory();
  const shouldDisplayTime = useSafeFlag(
    FeatureFlags.AUDIENCE_DISPLAY_TIME_IN_MEMBER_TABLE,
  );
  const allowMemberClick = useSafeFlag(
    FeatureFlags.AUDIENCE_ALLOW_CLICK_ON_MEMBER_TABLE,
  );

  const formatDate = shouldDisplayTime ? formatAsDatetime : formatAsDate;

  const handleMemberClick = (memberId: number) => (event: React.MouseEvent) => {
    // Allow native browser behavior for Ctrl/Cmd+Click to open in new tab
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    event.preventDefault();
    history.push(MEMBER_PROFILE_REDIRECTION(memberId));
  };

  const getStepName = React.useCallback(
    (stepId: number): string => {
      const step = getCadenceStep(stepId);
      if (step?.is_entrypoint) return t('cadence.triggers.start');
      return step?.name;
    },
    [getCadenceStep, t],
  );

  return (
    <ResponsiveTable>
      <TableHead>
        <TableRow className={classes.header}>
          <MUITableCell
            className={
              isHistoric
                ? classes.historicRestrictedRowWidth
                : classes.currentRestrictedRowWidth
            }
          >
            <Typography className={classes.headerWeight} variant="subtitle1">
              {t('audience.memberTable.tableColumnLabel.member')}
            </Typography>
          </MUITableCell>
          {!isHistoric && (
            <MUITableCell
              align="left"
              className={classes.currentRestrictedRowWidth}
            >
              <Typography className={classes.headerWeight} variant="subtitle1">
                {t('audience.memberTable.tableColumnLabel.currentStep')}
              </Typography>
            </MUITableCell>
          )}
          <MUITableCell align={isHistoric ? 'inherit' : 'right'}>
            <Typography className={classes.headerWeight} variant="subtitle1">
              {t('audience.memberTable.tableColumnLabel.entryDate')}
            </Typography>
          </MUITableCell>
          {isHistoric && (
            <>
              <MUITableCell>
                <Typography
                  className={classes.headerWeight}
                  variant="subtitle1"
                >
                  {t('audience.memberTable.tableColumnLabel.exitDate')}
                </Typography>
              </MUITableCell>
              <MUITableCell align="right" className={classes.statusColumn}>
                <Typography
                  className={classes.headerWeight}
                  variant="subtitle1"
                >
                  {t('audience.memberTable.tableColumnLabel.status')}
                </Typography>
              </MUITableCell>
            </>
          )}
        </TableRow>
        <TableRow className={classes.divider} />
      </TableHead>
      <TableBody>
        {!isHistoric &&
          membersInData?.map((member) => (
            <TableRow
              key={`present-member:${member.member_id}`}
              component={allowMemberClick ? 'a' : 'tr'}
              hover={allowMemberClick}
              href={
                allowMemberClick
                  ? MEMBER_PROFILE_REDIRECTION(member.member_id)
                  : undefined
              }
              onClick={
                allowMemberClick
                  ? handleMemberClick(member.member_id)
                  : undefined
              }
            >
              <MUITableCell className={classes.memberCell}>
                <Avatar
                  className={classes.avatar}
                  src={
                    membersById[member.member_id]?.photo ||
                    DEFAULT_PROFILE_PICTURE_URL
                  }
                />
                <Typography noWrap className={classes.name} variant="body2">
                  {membersById[member.member_id]?.name}
                </Typography>
              </MUITableCell>
              <MUITableCell align="left">
                <Typography noWrap className={classes.name} variant="body2">
                  {getStepName(member.current_step_id)}
                </Typography>
              </MUITableCell>
              <MUITableCell align="right">
                <Typography noWrap variant="body2">
                  {formatDate(member.entry_date)}
                </Typography>
              </MUITableCell>
            </TableRow>
          ))}
        {isHistoric &&
          membersOutData?.map((member, index) => (
            <TableRow
              key={`member-historic:${member.member_id}-${index}`}
              component={allowMemberClick ? 'a' : 'tr'}
              hover={allowMemberClick}
              href={
                allowMemberClick
                  ? MEMBER_PROFILE_REDIRECTION(member.member_id)
                  : undefined
              }
              onClick={
                allowMemberClick
                  ? handleMemberClick(member.member_id)
                  : undefined
              }
            >
              <MUITableCell className={classes.memberCell}>
                <Avatar
                  className={classes.avatar}
                  src={
                    membersById[member.member_id]?.photo ||
                    DEFAULT_PROFILE_PICTURE_URL
                  }
                />
                <Typography noWrap className={classes.name} variant="body2">
                  {membersById[member.member_id]?.name}
                </Typography>
              </MUITableCell>
              <MUITableCell align="inherit">
                <Typography noWrap variant="body2">
                  {formatDate(member.entry_date)}
                </Typography>
              </MUITableCell>
              <MUITableCell>
                <Typography noWrap variant="body2">
                  {formatDate(member.exit_date)}
                </Typography>
              </MUITableCell>
              <MUITableCell align="right" className={classes.statusColumn}>
                {getChipFromStatus(member.status, t)}
              </MUITableCell>
            </TableRow>
          ))}
      </TableBody>
    </ResponsiveTable>
  );
};

const useStyles = makeStyles((theme) => ({
  currentRestrictedRowWidth: {
    width: '40%',
  },
  historicRestrictedRowWidth: {
    width: '35%',
  },
  statusColumn: {
    width: '15%',
    whiteSpace: 'nowrap',
  },
  header: {
    height: CadenceMetricsSizes.MEMBER_TABLE_HEADER_HEIGHT,
  },
  headerWeight: {
    fontWeight: 500,
  },
  name: {
    paddingRight: theme.spacing(2),
  },
  memberCell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(2),
  },
}));

export default React.memo(CadenceMetricsMemberTableContent);
