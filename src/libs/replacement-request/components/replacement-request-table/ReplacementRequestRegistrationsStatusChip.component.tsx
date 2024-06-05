import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import brown from '@material-ui/core/colors/brown';

import { ReplacementRequestStatus } from '#src/libs/replacement-request/constants';

type Props = {
  areClosed: boolean;
  nbAnswers?: number;
  floatChip?: boolean;
  isMobile?: boolean;
};

export const ReplacementRequestRegistrationsStatusChip: React.FC<Props> = ({
  areClosed,
  floatChip,
  nbAnswers,
  isMobile,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  return (
    <div
      className={classnames({
        [classes.chipContainer]: !floatChip,
        [classes.floatChip]: floatChip,
      })}
    >
      <div
        className={classnames(classes.chipStatus, {
          [classes.errorChip]: areClosed,
          [classes.successChip]: !areClosed,
        })}
      >
        {areClosed ? (
          ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS && (
            <>
              <CancelIcon
                classes={{ root: classes.error }}
                fontSize={isMobile ? 'small' : 'medium'}
              />
              <Typography
                className={classnames({ [classes.smallFont]: isMobile })}
              >
                {`${t(`registrationsStatus.areClosed`)}${
                  nbAnswers === undefined ? '' : ` (${nbAnswers})`
                }`}
              </Typography>
            </>
          )
        ) : (
          <>
            <CheckCircle
              classes={{ root: classes.success }}
              fontSize={isMobile ? 'small' : 'medium'}
            />
            <Typography
              className={classnames({ [classes.smallFont]: isMobile })}
            >
              {`${t(`registrationsStatus.areNotClosed`)}${
                nbAnswers === undefined ? '' : ` (${nbAnswers})`
              }`}
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(0.5),
  },
  error: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(0.5),
  },
  chipContainer: {
    display: 'table',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  chipStatus: {
    whiteSpace: 'nowrap',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.palette.error.light,
    padding: `${theme.spacing(0.25)}px ${theme.spacing(0.75)}px`,
    borderRadius: theme.spacing(0.5),
  },
  successChip: {
    backgroundColor: green[50],
    color: green[900],
  },
  errorChip: {
    backgroundColor: red[50],
    color: brown[800],
  },
  floatChip: {
    float: 'left',
    marginRight: theme.spacing(0.5),
  },
  smallFont: {
    [theme.breakpoints.down('xs')]: { fontSize: '12px' },
  },
}));

export default ReplacementRequestRegistrationsStatusChip;
