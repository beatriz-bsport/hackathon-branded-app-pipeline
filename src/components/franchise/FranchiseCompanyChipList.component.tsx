import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import CompanyChip from './CompanyChip.component';
import FranchiseCompaniesListingTooltip from '#libs/franchise/components/FranchiseCompaniesListingTooltip.component';
import type { FranchiseCompany } from '#libs/franchise/types';

type Props = {
  nbCompanyChips?: number;
  companies: Array<FranchiseCompany>;
};

const FranchiseCompanyChipList = (props: Props) => {
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();
  const nbChips = props.nbCompanyChips ? props.nbCompanyChips : 2;

  return (
    <>
      {props.companies.length > 0 && (
        <>
          {props.companies
            .slice(0, nbChips)
            .map(
              (company) =>
                company && (
                  <CompanyChip
                    key={company.id}
                    className={classes.chip}
                    company={company}
                  />
                ),
            )}
          {props.companies.length > nbChips && (
            <FranchiseCompaniesListingTooltip
              companies={props.companies.slice(nbChips)}
            >
              <Chip variant="outlined" color="primary" label={t('seeAll')} />
            </FranchiseCompaniesListingTooltip>
          )}
        </>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
}));

export default FranchiseCompanyChipList;
