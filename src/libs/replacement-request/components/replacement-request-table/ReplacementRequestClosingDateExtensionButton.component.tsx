// @ts-nocheck
import React from 'react';
import moment from 'moment-timezone';

import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Update from '@material-ui/icons/Update';

import { useTranslation } from 'react-i18next';
import { ReplacementRequest } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level } from '#libs/level/types';

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
                date: moment(replacementRequest.closing_date).format('L - LT'),
              })
            : moment(replacementRequest.closing_date).format('L - LT')}
        </Typography>
        {moment().isAfter(replacementRequest.closing_date) && (
          <IconButton onClick={handleClick} className={classes.button}>
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
