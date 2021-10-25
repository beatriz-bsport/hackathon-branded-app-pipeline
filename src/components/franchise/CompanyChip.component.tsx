// @flow
import React from 'react';
import { Chip, MuiThemeProvider } from '@material-ui/core';

import chroma from 'chroma-js';
import { FranchiseCompany } from '../../libs/franchise/types';
import { getTheme } from '../../theme';

export type OwnProps = {
  company: FranchiseCompany;
  onDelete?: () => void;
  className?: string;
};

type Props = OwnProps;
const CompanyChip = (props: Props) => {
  const { company, className, onDelete } = props;

  if (!company) return null;
  return (
    <MuiThemeProvider
      theme={getTheme({
        primary_color: chroma(
          company.primaryRGB[0],
          company.primaryRGB[1],
          company.primaryRGB[2],
        ).hex(),
        secondary_color: chroma(
          company.primaryRGB[0],
          company.primaryRGB[1],
          company.primaryRGB[2],
        ).hex(),
      })}
    >
      <Chip
        className={className}
        color="primary"
        label={company.name}
        onDelete={onDelete}
      />
    </MuiThemeProvider>
  );
};

export default CompanyChip;
