// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import TypographyMultiline from '../../../../components/typo/TypographyMultiline.component';

type Props = {
  startUpdateCoach: (coach: CoachDetailed) => void,
  coach: CoachDetailed,
};

export const CoachInformation = (props: Props) => {
  const { startUpdateCoach, coach } = props;
  const { t } = useTranslation(['translation', 'coach']);
  const classes = useStyles();

  return (
    <Paper>
      <div className={classNames(classes.flexRow, classes.expansionTitle)}>
        <Typography variant="h5">{t('common.information')}</Typography>
        <Button
          onClick={() => startUpdateCoach(coach)}
          color="primary"
          variant="contained"
        >
          <EditIcon className={classes.leftIcon} />
          {t('common.edit')}
        </Button>
      </div>

      <div className={classes.expansionTitle}>
        <Typography variant="h6">{t('common.description')}</Typography>
      </div>
      <div className={classNames(classes.paperContent, classes.dateContainer)}>
        <TypographyMultiline>
          {coach.description || t('coach:emptyDescription')}
        </TypographyMultiline>
      </div>

      <div className={classes.expansionTitle}>
        <Typography variant="h6">{t('coach:workingDateSection')}</Typography>
      </div>
      <div className={classes.paperContent}>
        <div className={classes.row}>
          <div className={classes.column}>
            <Typography>{`${t('coach:dateJoinedCompany')}:`}</Typography>
            <Typography>{`${t('coach:dateLeftCompany')}:`}</Typography>
          </div>
          <div className={classes.column}>
            <Typography>
              {coach.date_joined_company
                ? moment(coach.date_joined_company).format('L')
                : '-'}
            </Typography>
            <Typography>
              {coach.date_left_company
                ? moment(coach.date_left_company).format('L')
                : '-'}
            </Typography>
          </div>
        </div>
      </div>

      <div className={classes.expansionTitle}>
        <Typography variant="h6">{t('common.notes')}</Typography>
      </div>
      <div className={classes.paperContent}>
        <TypographyMultiline>
          {coach.notes || t('coach:emptyNotes')}
        </TypographyMultiline>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  paperContent: {
    padding: theme.spacing(2),
  },
  expansionTitle: {
    padding: theme.spacing(2),
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing(1),
  },
}));

export default CoachInformation;
