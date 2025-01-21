import React from 'react';

import Chip from '@material-ui/core/Chip';
import Skeleton from '@material-ui/lab/Skeleton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import type { Company } from '#src/libs/company/types';
import type { CompanyGroup } from '../types';

type Props = {
  loading: boolean;
  onDelete?: () => void;
  company: Company | CompanyGroup;
};

export const CompanyFilterChip: React.FC<Props> = ({
  loading,
  onDelete,
  company,
}) => {
  const classes = useStyles();

  const companyName = company.name;

  return (
    <Chip
      className={clsx(classes.background)}
      label={
        loading ? <Skeleton animation="wave" variant="text" /> : companyName
      }
      onDelete={onDelete}
      size="small"
      variant="outlined"
    />
  );
};

const useStyles = makeStyles(() => ({
  background: {
    backgroundColor: 'white',
  },
}));

export default React.memo(CompanyFilterChip);
