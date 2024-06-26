import React from 'react';

import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Update from '@material-ui/icons/Update';

import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { formatAsDate } from '#src/utils/datetime';
import { ReplacementRequest } from '#src/libs/replacement-request/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Level } from '#src/libs/level/types';

type Props = {
  replacementRequest: ReplacementRequest<
    Coach,
    Establishment,
    MetaActivity,
    number,
    number,
    number,
    Level
  >;
  onClick: (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => void;
  isMobile?: boolean;
};

export const ReplacementRequestStatusChip: React.FC<Props> = ({
  replacementRequest,
  onClick,
  isMobile,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('replacement');

  const handleClick = () => onClick(replacementRequest);

  return (
    <div className={classNames({ [classes.chipContainer]: !isMobile })}>
      <div className={classes.chipStatus}>
        <Typography
          className={classNames({
            [classes.mobileSmallFont]: isMobile,
            [classes.grey]: isMobile,
          })}
        >
          {isMobile
            ? t('marketplace.until', {
                date: DateTime.fromISO(
                  replacementRequest.closing_date,
                ).toFormat('D - t'),
              })
            : formatAsDate(replacementRequest.closing_date)}
        </Typography>
        {DateTime.now() > DateTime.fromISO(replacementRequest.closing_date) && (
          <IconButton className={classes.button} onClick={handleClick}>
            <Update fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  chipContainer: {
    display: 'table',
  },
  chipStatus: {
    whiteSpace: 'nowrap',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing(0.5),
  },
  button: {
    padding: theme.spacing(1),
    color: theme.palette.warning.main,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  mobileSmallFont: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
  grey: {
    color: theme.palette.grey[600],
  },
}));

export default ReplacementRequestStatusChip;
