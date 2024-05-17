import React from 'react';
import { useTranslation } from 'react-i18next';

import Chip from '@material-ui/core/Chip';
import Skeleton from '@material-ui/lab/Skeleton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import classNames from 'classnames';

import CoachChip from './CoachChip.component';
import { Coach } from '../types';

type Props = {
  hideCoach?: Boolean;
  coaches?: Array<Coach>;
  loading?: boolean;
  onDelete?: (coach: Coach) => void;
};

export const CoachGroupChip: React.FC<Props> = ({
  hideCoach,
  coaches,
  loading,
  onDelete,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('coach');

  const currentCoaches = React.useMemo(
    () =>
      [...coaches.filter((c) => !!c)].sort((a, b) => {
        if (a.disabled === false) return -1;
        if (b.disabled === true) return -1;
        return 1;
      }),
    [coaches],
  );

  if (!currentCoaches?.length || hideCoach) return null;

  const handleDelete = onDelete
    ? (coach: Coach) => () => onDelete(coach)
    : null;

  if (currentCoaches.length === 1) {
    return (
      <CoachChip
        key={currentCoaches[0].id}
        showDisabledIcon
        coach={currentCoaches[0]}
        loading={loading}
        onDelete={handleDelete(currentCoaches[0])}
      />
    );
  }

  return (
    <div className={classes.container}>
      <Chip
        className={classes.numberCoaches}
        label={
          loading ? (
            <Skeleton animation="wave" variant="text" />
          ) : (
            t('numberCoaches', { number: currentCoaches.length })
          )
        }
        variant="outlined"
      />
      {currentCoaches.map((c, index) => (
        <div>
          <div
            className={classNames(classes.superpose, 'shiftable')}
            // @ts-expect-error
            style={{ '--index': index + 1 }}
          >
            <CoachChip
              showDisabledIcon
              coach={c}
              loading={loading}
              onDelete={handleDelete && handleDelete(c)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: theme.spacing(3),
    alignItems: 'flex-end',
    '& $div.shiftable': {
      opacity: 0,
      visibility: 'hidden',
      transition: 'transform 0.5s, opacity 0.5s, visibility 0.5s',
      paddingTop: theme.spacing(1),
      marginTop: -theme.spacing(1),
    },
    '&:hover': {
      '& $div.shiftable': {
        transform: 'translateY(calc(38px * var(--index) - 8px))',
        opacity: 1,
        visibility: 'visible',
        transition: 'transform 0.5s, opacity 0.5s',
      },
    },
  },
  superpose: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 999,
  },
  numberCoaches: {
    backgroundColor: 'white',
    minHeight: theme.spacing(3),
    zIndex: 1000,
  },
}));

export default CoachGroupChip;
