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
        <div className={classes.responsiveChipContainer}>
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
              <Chip
                className={classes.chip}
                color="primary"
                label={`${t('seeAll')} (${
                  props.companies?.length - nbChips || 0
                })`}
                variant="outlined"
              />
            </FranchiseCompaniesListingTooltip>
          )}
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    margin: theme.spacing(0.5),
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 0, // trick to ellipsis chip
  },
  responsiveChipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 0, // trick to ellipsis chip
  },
}));

export default FranchiseCompanyChipList;
