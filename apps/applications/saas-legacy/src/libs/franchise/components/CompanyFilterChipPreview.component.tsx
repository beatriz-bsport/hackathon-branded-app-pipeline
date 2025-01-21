import React from 'react';
import { useTranslation } from 'react-i18next';

import Chip from '@material-ui/core/Chip';
import Skeleton from '@material-ui/lab/Skeleton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import CompanyFilterChip from './CompanyFilterChip.component';
import type { CompanyGroup } from '../types';
import type { Company } from '#src/libs/company/types';

type Props = {
  companies?: Company[] | CompanyGroup[];
  loading?: boolean;
  onDelete?: (company: Company | CompanyGroup) => void;
};

/**
 * Type guard to check if the given object is of type Company.
 *
 * This function helps TypeScript narrow down the type of the provided object to Company
 * by checking for the presence of a property specific to this type: `email`
 *
 * @param company - The object to check, which can be either a Company or a CompanyGroup.
 * @returns A boolean indicating whether the object is of type Company.
 */
function isCompany(company: Company | CompanyGroup): company is Company {
  return (company as any)?.email !== undefined;
}

export const CompanyFilterChipPreview: React.FC<Props> = ({
  companies,
  loading,
  onDelete,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('franchise');

  const translationKey = React.useMemo(
    () =>
      isCompany(companies[0])
        ? 'userProfile.numberStudios'
        : 'userProfile.numberBrands',
    [companies],
  );

  const handleDelete = React.useCallback(
    (company: Company | CompanyGroup) => () => onDelete?.(company),
    [onDelete],
  );

  if (!companies?.length) return null;

  if (companies.length === 1) {
    return (
      <CompanyFilterChip
        key={companies[0].id}
        company={companies[0]}
        loading={loading}
        onDelete={onDelete ? handleDelete(companies[0]) : null}
      />
    );
  }

  return (
    <div className={classes.container}>
      <Chip
        className={classes.numberCompanies}
        label={
          loading ? (
            <Skeleton animation="wave" variant="text" />
          ) : (
            t(translationKey, { number: companies.length })
          )
        }
        variant="outlined"
      />
      {companies.map((company, index) => (
        <div
          className={clsx(classes.superpose, 'shiftable')}
          // @ts-expect-error: unrecognized because it's a variable
          style={{ '--index': index + 1 }}
        >
          <CompanyFilterChip
            company={company}
            loading={loading}
            onDelete={onDelete ? handleDelete(company) : null}
          />
        </div>
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
  numberCompanies: {
    backgroundColor: 'white',
    minHeight: theme.spacing(3),
    zIndex: 1000,
  },
}));

export default React.memo(CompanyFilterChipPreview);
