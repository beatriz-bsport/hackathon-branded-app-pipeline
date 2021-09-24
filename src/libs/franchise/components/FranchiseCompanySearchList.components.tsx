// @flow
import React, { useState } from 'react';
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
  Paper,
  Collapse,
  List,
  ListItem,
} from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Fuse, { FuseOptions } from 'fuse.js';

import { FranchiseCompany } from '../types';
import HighlightedText from '../../../components/HighlightedText/HighlightedText.component';
import FuzeSearch from '../../../components/FuzeSearch.component';

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

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<FranchiseCompany[]>([]);

  const changeSearch = (
    fuse: Fuse<FranchiseCompany, FuseOptions<FranchiseCompany>>,
  ) => (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearch(ev.target.value);
    const result = fuse.search(ev.target.value) as FranchiseCompany[];
    setSearchResult(result);
  };

  return (
    <div>
      <FuzeSearch
        searchText={search}
        clearSearch={() => {
          setSearch('');
        }}
        changeSearch={changeSearch}
        items={companies}
        placeholder={t('companies.searchPlaceholder')}
        searchFields={['name']}
      />
      <Paper
        className={
          searchResult.length > 0 &&
          search !== '' &&
          classes.searchPaperDisplayed
        }
      >
        <Collapse in={searchResult.length > 0 && search !== ''}>
          <List component="nav" disablePadding className={classes.list}>
            {searchResult.map((company) => (
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
            ))}
          </List>
        </Collapse>
      </Paper>
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

export default compose(
  withTranslation(['franchise']),
  withStyles(styles, { withTheme: true }),
)(FranchiseCompanySearchList);
