import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import Avatar from '@material-ui/core/Avatar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DEFAULT_PROFILE_PICTURE_URL from '../../../../../assets/constants';
import CustomChip from '#components/chip/CustomChip.component';
import {
  CadenceMetricsSizes,
  DestinationStatus,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';
import { formatAsDate } from '#utils/datetime';

import type {
  CadenceMembersInData,
  CadenceMembersOutData,
  CadenceStep,
} from '#libs/sequential_marketing/types';
import { Member } from '#libs/member/types';

const MUITableCell = withStyles((theme) => ({
  root: {
    borderBottom: 'none',
    margin: theme.spacing(1, 0, 0, 0),
    padding: 0,
  },
}))(TableCell);

const getChipInfoFromStatus = (status: DestinationStatus, t: TFunction) => {
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

const getChipFromStatus = (status: DestinationStatus, t: TFunction) => {
  const { label, icon, color } = getChipInfoFromStatus(status, t);
  return <CustomChip displayedValue={label} icon={icon} mainColor={color} />;
};

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

  return (
    <Table>
      <TableHead>
        <TableRow className={classes.header}>
          <MUITableCell className={classes.restrictedRowWidth}>
            {t('audience.memberTable.tableColumnLabel.member')}
          </MUITableCell>
          {!isHistoric && (
            <MUITableCell align="left" className={classes.restrictedRowWidth}>
              {t('audience.memberTable.tableColumnLabel.currentStep')}
            </MUITableCell>
          )}
          <MUITableCell align={isHistoric ? 'inherit' : 'right'}>
            {t('audience.memberTable.tableColumnLabel.entryDate')}
          </MUITableCell>
          {isHistoric && (
            <>
              <MUITableCell>
                {t('audience.memberTable.tableColumnLabel.exitDate')}
              </MUITableCell>
              <MUITableCell align="right">
                {t('audience.memberTable.tableColumnLabel.status')}
              </MUITableCell>
            </>
          )}
        </TableRow>
        <TableRow className={classes.divider} />
      </TableHead>
      <TableBody>
        {!isHistoric &&
          membersInData?.map((member) => (
            <TableRow key={`present-member:${member.member_id}`}>
              <MUITableCell className={classes.twoLinesRow}>
                <Avatar
                  className={classes.avatar}
                  src={
                    membersById[member.member_id]?.photo ||
                    DEFAULT_PROFILE_PICTURE_URL
                  }
                />
                {membersById[member.member_id]?.name}
              </MUITableCell>
              <MUITableCell align="left" className={classes.oneLineRow}>
                {getCadenceStep(member.current_step_id)?.name}
              </MUITableCell>
              <MUITableCell align={isHistoric ? 'inherit' : 'right'}>
                {formatAsDate(member.entry_date)}
              </MUITableCell>
            </TableRow>
          ))}
        {isHistoric &&
          membersOutData?.map((member, index) => (
            <TableRow key={`member-historic:${member.member_id}-${index}`}>
              <MUITableCell className={classes.twoLinesRow}>
                <Avatar
                  className={classes.avatar}
                  src={
                    membersById[member.member_id]?.photo ||
                    DEFAULT_PROFILE_PICTURE_URL
                  }
                />
                {membersById[member.member_id]?.name}
              </MUITableCell>
              <MUITableCell align={isHistoric ? 'inherit' : 'right'}>
                {formatAsDate(member.entry_date)}
              </MUITableCell>
              <MUITableCell>{formatAsDate(member.exit_date)}</MUITableCell>
              <MUITableCell align="right">
                {getChipFromStatus(member.status, t)}
              </MUITableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

const useStyles = makeStyles((theme) => ({
  restrictedRowWidth: {
    width: '40%',
  },
  header: {
    height: CadenceMetricsSizes.MEMBER_TABLE_HEADER_HEIGHT,
  },
  twoLinesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    overflow: 'hidden',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  oneLineRow: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
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
