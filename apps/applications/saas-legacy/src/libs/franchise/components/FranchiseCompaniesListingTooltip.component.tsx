import React from 'react';

import {
  makeStyles,
  Paper,
  Theme,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import { FranchiseCompany } from '../types';
import CompanyChip from '../../../components/franchise/CompanyChip.component';

export type OwnProps = {
  children: React.ReactElement;
  companies: FranchiseCompany[];
};

type Props = OwnProps;

const FranchiseCompaniesListingTooltip = (props: Props) => {
  const { children, companies } = props;

  const classes = useStyles();
  return (
    <HtmlTooltip
      title={
        <Paper className={classes.paper}>
          {companies.map((company) => (
            <CompanyChip company={company} />
          ))}
        </Paper>
      }
    >
      {children}
    </HtmlTooltip>
  );
};
const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: 'transparent',
    maxWidth: 400,
    border: 'none',
    boxShadow: theme.shadows[2],
    padding: 0,
  },
}))(Tooltip);

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
}));

export default FranchiseCompaniesListingTooltip;
