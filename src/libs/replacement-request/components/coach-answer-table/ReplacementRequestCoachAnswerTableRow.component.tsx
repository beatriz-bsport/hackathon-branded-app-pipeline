import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

import ReplacementRequestCoachAnswerStatusChip from '#libs/replacement-request/components/coach-answer-table/ReplacementRequestCoachAnswerStatusChip.component';
import CoachAvatar from '#libs/associated-coach/components/CoachAvatar.component';

import { ReplacementRequestCoachAnswer } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import { ReplacementRequestCoachAnswerStatus } from '#libs/replacement-request/constants';

type Props = {
  replacementRequestCoachAnswer: ReplacementRequestCoachAnswer<Coach, number>;
  onAttribute: (
    replacementRequestCoachAnswer: ReplacementRequestCoachAnswer<Coach, number>,
  ) => void;
};

export const ActivitiesToReplaceTableRow: React.FC<Props> = ({
  replacementRequestCoachAnswer,
  onAttribute,
}) => {
  const classes = useStyles();
  const { coach } = replacementRequestCoachAnswer;

  const { t } = useTranslation('replacement');

  const handleClick = () => onAttribute(replacementRequestCoachAnswer);

  return (
    <>
      <TableRow key={replacementRequestCoachAnswer.id}>
        <TableCell className={classes.tableCell}>
          <div className={classes.row}>
            <div className={classes.avatar}>
              <CoachAvatar coach={coach} />
            </div>
            <Typography>{coach.name}</Typography>
          </div>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <ReplacementRequestCoachAnswerStatusChip
            replacementRequestCoachAnswerStatus={
              replacementRequestCoachAnswer.answer
            }
          />
        </TableCell>
        <TableCell className={classes.tableCell}>
          {replacementRequestCoachAnswer.answer !==
          ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_NO ? (
            <Button onClick={handleClick} variant="outlined" color="primary">
              {t('coachAnswers.attribute')}
            </Button>
          ) : null}
        </TableCell>
      </TableRow>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  tableCell: { borderBottom: 'none' },
}));

export default ActivitiesToReplaceTableRow;
