import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Chip } from '@material-ui/core';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

import { PartnershipIdentifier } from '#src/libs/partnership/types';

type Props = {
  active: boolean;
  partnershipIdentifier: PartnershipIdentifier;
};

const VenueStatusChip: React.FC<Props> = ({
  active,
  partnershipIdentifier,
}) => {
  const classes = useStyles({ active });
  const { t } = useTranslation('partnership');

  return (
    <Chip
      className={classes.statusChip}
      color="primary"
      icon={
        active ? (
          <CheckCircleOutlineOutlinedIcon fontSize="small" />
        ) : (
          <HourglassEmptyIcon fontSize="small" />
        )
      }
      label={
        active
          ? t(
              `${partnershipIdentifier}.configuration.panel.content.table.status.active`,
            )
          : t(
              `${partnershipIdentifier}.configuration.panel.content.table.status.inactive`,
            )
      }
    />
  );
};

const useStyles = makeStyles((theme) => ({
  statusChip: {
    minWidth: '70%',
    borderRadius: theme.shape.borderRadius,
    padding: '4px 3px',
    color: ({ active }: { active: boolean }) =>
      active ? 'rgb(80, 156, 48)' : 'rgb(199, 119, 0)',
    backgroundColor: ({ active }: { active: boolean }) =>
      active ? 'rgba(80, 156, 48, 0.1)' : 'rgba(199, 119, 0, 0.1)',
  },
}));

export default React.memo(VenueStatusChip);
