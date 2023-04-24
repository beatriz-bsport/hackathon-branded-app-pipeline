// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Chip from '@material-ui/core/Chip';
import EventBusy from '@material-ui/icons/EventBusy';

import { ReplacementRequestCoachAnswer } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import ReplacementRequestCoachAnswerTableRow from '#libs/replacement-request/components/coach-answer-table/ReplacementRequestCoachAnswerTableRow.component';

type Props = {
  replacementRequestCoachAnswerList: ReplacementRequestCoachAnswer<
    Coach,
    number
  >[];
  onAttribute: (
    replacementRequestCoachAnswer: ReplacementRequestCoachAnswer<Coach, number>,
  ) => void;
};

export const ActivitiesToReplaceTable: React.FC<Props> = ({
  replacementRequestCoachAnswerList,
  onAttribute,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>
              <Typography
                align="left"
                variant="subtitle2"
                className={classes.weight500}
              >
                {t('coachAnswers.header.teacher')}
              </Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Typography
                align="left"
                variant="subtitle2"
                className={classes.weight500}
              >
                {t('coachAnswers.header.answer')}
              </Typography>
            </TableCell>
            <TableCell className={classes.tableCell} />
          </TableRow>
        </TableHead>
        {replacementRequestCoachAnswerList.length > 0 && (
          <TableBody>
            {replacementRequestCoachAnswerList.map(
              (replacementRequestCoachAnswer) => (
                <ReplacementRequestCoachAnswerTableRow
                  key={replacementRequestCoachAnswer.id}
                  replacementRequestCoachAnswer={replacementRequestCoachAnswer}
                  onAttribute={onAttribute}
                />
              ),
            )}
          </TableBody>
        )}
      </Table>
      {replacementRequestCoachAnswerList.length === 0 && (
        <div className={classes.noListItem}>
          <Chip icon={<EventBusy />} label={t('coachAnswers.noAnswers')} />
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  tableCell: {
    borderBottom: 'none',
    paddingBottom: 0,
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    },
  },
  noListItem: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  weight500: { fontWeight: 500 },
}));

export default ActivitiesToReplaceTable;
