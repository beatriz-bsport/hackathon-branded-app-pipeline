import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import CustomChip from '#components/chip/CustomChip.component';
import {
  DestinationStatus,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';

const MUITableCell = withStyles((theme) => ({
  root: {
    borderBottom: 'none',
    margin: theme.spacing(0, 0, 1, 0),
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

type Props = { historic: boolean; membersData: any };

const CadenceMetricsMemberTableContent: React.FC<Props> = ({
  historic,
  membersData,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  return (
    <Table>
      <TableHead>
        <TableRow>
          <MUITableCell className={classes.restrictedRowWidth}>
            {t('audience.memberTable.tableColumnLabel.member')}
          </MUITableCell>
          {!historic && (
            <MUITableCell align="left" className={classes.restrictedRowWidth}>
              {t('audience.memberTable.tableColumnLabel.currentStep')}
            </MUITableCell>
          )}
          <MUITableCell align={historic ? 'inherit' : 'right'}>
            {t('audience.memberTable.tableColumnLabel.entryDate')}
          </MUITableCell>
          {historic && (
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
      </TableHead>
      <TableBody>
        {membersData.map((member: any) => (
          <TableRow key={member.id}>
            <MUITableCell className={classes.twoLinesRow}>
              {member.photo}
              {member.name}
            </MUITableCell>
            {!historic && (
              <MUITableCell align="left" className={classes.oneLineRow}>
                {member.currentStepName}
              </MUITableCell>
            )}
            <MUITableCell align={historic ? 'inherit' : 'right'}>
              {member.entryDate}
            </MUITableCell>
            {historic && (
              <>
                <MUITableCell>{member.exitDate}</MUITableCell>
                <MUITableCell align="right">
                  {getChipFromStatus(member.status, t)}
                </MUITableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const useStyles = makeStyles(() => ({
  restrictedRowWidth: { width: '40%' },
  twoLinesRow: {
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  oneLineRow: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

export default React.memo(CadenceMetricsMemberTableContent);
