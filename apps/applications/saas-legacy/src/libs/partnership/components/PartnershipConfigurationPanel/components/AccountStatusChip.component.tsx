import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import CancelIcon from '@material-ui/icons/Cancel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Chip } from '@material-ui/core';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

import { PartnershipIdentifier } from '#src/libs/partnership/types';

enum Status {
  ACTIVE = 'active',
  PENDING = 'pending',
  DEACTIVATED = 'deactivated',
}

type Props = {
  active: boolean;
  activatedAt?: Date;
  partnershipIdentifier: PartnershipIdentifier;
};

const computeStatus = (active: boolean, activatedAt?: Date): Status => {
  if (active) {
    return Status.ACTIVE;
  }
  if (activatedAt) {
    return Status.DEACTIVATED;
  }

  return Status.PENDING;
};

const AccountStatusChip: React.FC<Props> = ({
  active,
  activatedAt,
  partnershipIdentifier,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('partnership');

  const status = useMemo(
    () => computeStatus(active, activatedAt),
    [active, activatedAt],
  );

  const icon = useMemo(() => {
    switch (status) {
      case Status.ACTIVE:
        return <CheckCircleOutlineOutlinedIcon fontSize="small" />;
      case Status.PENDING:
        return <HourglassEmptyIcon fontSize="small" />;
      case Status.DEACTIVATED:
        return <CancelIcon fontSize="small" />;
    }
  }, [status]);

  const className = useMemo(() => {
    switch (status) {
      case Status.ACTIVE:
        return classes.activeChip;
      case Status.PENDING:
        return classes.pendingChip;
      case Status.DEACTIVATED:
        return classes.deactivatedChip;
    }
  }, [status, classes]);

  return (
    <Chip
      className={className}
      color="primary"
      icon={icon}
      label={t(
        `${partnershipIdentifier}.configuration.panel.content.table.status.${status}`,
      )}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  activeChip: {
    minWidth: '70%',
    borderRadius: theme.shape.borderRadius,
    padding: '4px 3px',
    color: 'rgb(80, 156, 48)',
    backgroundColor: 'rgba(80, 156, 48, 0.1)',
  },
  pendingChip: {
    minWidth: '70%',
    borderRadius: theme.shape.borderRadius,
    padding: '4px 3px',
    color: 'rgb(199, 119, 0)',
    backgroundColor: 'rgba(199, 119, 0, 0.1)',
  },
  deactivatedChip: {
    minWidth: '70%',
    borderRadius: theme.shape.borderRadius,
    padding: '4px 3px',
    color: 'rgb(220, 53, 69)',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
  },
}));

export default React.memo(AccountStatusChip);
