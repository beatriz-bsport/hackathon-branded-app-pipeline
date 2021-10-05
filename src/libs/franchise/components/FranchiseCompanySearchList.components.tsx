// @flow
import React from 'react';
import {
  WithStyles,
  Theme,
  Avatar,
  Typography,
  TableRow,
  Table,
  TableCell,
  createStyles,
  withStyles,
  ListItem,
} from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';

import { FranchiseCompany } from '../types';
import HighlightedText from '../../../components/HighlightedText/HighlightedText.component';
import FuzzySearch from '../../../components/search/FuzzySearch.component';

export type OwnProps = {
  companies: FranchiseCompany[];
  selectedCompanyId?: number;
  handleCompanySelected: (company: number) => () => void;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

const FranchiseCompanySearchList = (props: Props) => {
  const {
    selectedCompanyId,
    companies,
    classes,
    handleCompanySelected,
    t,
  } = props;

  return (
    <div>
      <FuzzySearch
        items={companies}
        placeholder={t('companies.searchPlaceholder')}
        searchFields={['name']}
        itemRenderer={(company, search) => (
          <ListItem
            key={company.id}
            button
            divider
            selected={company.id === selectedCompanyId}
            className={classes.row}
            onClick={handleCompanySelected(company.id)}
          >
            <div className={classes.companyRow}>
              <Avatar
                alt={company.name}
                src={company.cover}
                className={classes.avatar}
              />
              <Typography variant="body1">
                <HighlightedText text={company.name} highlight={search} />
              </Typography>
            </div>
          </ListItem>
        )}
      />
      <Table className={classes.companiesContainer}>
        {companies.map((company) => (
          <TableRow
            key={company.id}
            hover
            selected={company.id === selectedCompanyId}
            className={classes.row}
            onClick={handleCompanySelected(company.id)}
          >
            <TableCell>
              <div className={classes.companyRow}>
                <Avatar
                  alt={company.name}
                  src={company.cover}
                  className={classes.avatar}
                />
                <Typography variant="body1">{company.name}</Typography>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    input: {
      marginBottom: theme.spacing(2),
    },
    companiesContainer: {
      marginTop: theme.spacing(1),
      backgroundColor: theme.palette.common.white,
      borderRadius: 5,
      boxShadow: theme.shadows[2],
    },
    row: {
      cursor: 'pointer',
    },
    companyRow: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      marginRight: theme.spacing(2),
    },
    searchPaperDisplayed: {
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      borderTop: '0px',
    },
  });

export default compose<any, OwnProps>(
  withTranslation(['franchise']),
  withStyles(styles, { withTheme: true }),
)(FranchiseCompanySearchList);
