import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import { MemberVisitREST } from '#libs/access-control/types';
import { AccessStatus } from '#libs/access-control/constants';
import { getMemberVisitWarnings } from '#libs/access-control/utils';

export type Props = {
  isLoading: boolean;
  memberVisit: MemberVisitREST;
};

const MemberVisitWarnings: React.FC<Props> = ({ memberVisit, isLoading }) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const { warnings, checkOnPassesIsValid, numberOfCheckedPasses } =
    getMemberVisitWarnings(memberVisit, t);

  if (isLoading) {
    return (
      <Skeleton
        className={classes.root}
        height={56}
        variant="rect"
        width="100%"
      />
    );
  }

  if (!warnings.length) {
    return null;
  }

  return (
    <Card className={classes.root} variant="outlined">
      {warnings.map((warning, index) => (
        <Alert
          key={index}
          severity={
            memberVisit?.access_status === AccessStatus.RED
              ? 'error'
              : 'warning'
          }
        >
          <Typography className={classes.alertLabel} variant="body1">
            {warning}
          </Typography>
        </Alert>
      ))}
      {!checkOnPassesIsValid && numberOfCheckedPasses > 0 && (
        <Typography color="textSecondary" variant="caption">
          {t('memberVisit.warnings.numberOfCheckedPasses', {
            count: numberOfCheckedPasses,
          })}
        </Typography>
      )}
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  alertLabel: {
    fontWeight: 500,
  },
}));

export default React.memo(MemberVisitWarnings);
