// @flow
import React from 'react';
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { WithTranslation, useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import { compose } from 'recompose';
import Divider from '@material-ui/core/Divider';

import CompanyListItem from '../../membership/components/CompanyListItem.component';
import { OptionCallback } from '../../../state/types';

import { FranchiseCompany, CompanyGroup } from '../types';
import HighlightedText from '../../../components/HighlightedText/HighlightedText.component';
import FuzzySearch from '../../../components/search/FuzzySearch.component';
import CompanyGroupFormDialog from './CompanyGroupFormDialog.component';

export type OwnProps = {
  companies: FranchiseCompany[];
  selectedCompanyId?: number;
  handleCompanySelected: (company: number) => () => void;
  createOrUpdateCompanyGroup: (
    data: any,
    options: OptionCallback<CompanyGroup>,
  ) => void;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

const FranchiseCompanySearchList = (props: Props) => {
  const { selectedCompanyId, companies, classes, handleCompanySelected } =
    props;

  const [groupToEdit, setGroupToEdit] = React.useState<CompanyGroup | null>(
    null,
  );
  const [createGroupOpen, setCreateGroupOpen] = React.useState<boolean>(false);
  const { t } = useTranslation(['franchise']);

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
      <Button
        variant="outlined"
        color="primary"
        className={classes.categoryButton}
        onClick={() => setCreateGroupOpen(true)}
      >
        <AddIcon className={classes.iconLeft} />
        {t('companyGroup.actions.add')}
      </Button>
      {props.companyGroupList
        .filter((g) => (g.companies || []).length)
        .map((g) => (
          <div className={classes.companiesContainer}>
            <div className={classes.rowLarge}>
              <Typography variant="h4">{g.name}</Typography>
              <IconButton onClick={() => setGroupToEdit(g)} color="primary">
                <EditIcon />
              </IconButton>
            </div>
            <Divider className={classes.divider} />
            <Paper>
              {companies
                .filter((c) => c.company_group === g.id)
                .map((c) => (
                  <CompanyListItem
                    company={c}
                    key={c.id}
                    onClick={handleCompanySelected(c.id)}
                  />
                ))}
            </Paper>
          </div>
        ))}
      <div className={classes.companiesContainer}>
        <Paper>
          {companies
            .filter((c) => !c.company_group)
            .map((company) => (
              <CompanyListItem
                company={company}
                key={company.id}
                onClick={handleCompanySelected(company.id)}
              />
            ))}
        </Paper>
      </div>
      {!!groupToEdit && (
        <CompanyGroupFormDialog
          onClose={() => setGroupToEdit(null)}
          open={!!groupToEdit}
          initial={groupToEdit}
          companyList={companies}
          onSubmit={(data) =>
            props.createOrUpdateCompanyGroup(data, {
              onSuccess: () => setGroupToEdit(null),
            })
          }
        />
      )}
      {!!createGroupOpen && (
        <CompanyGroupFormDialog
          onClose={() => setCreateGroupOpen(false)}
          open={!!createGroupOpen}
          companyList={companies}
          onSubmit={(data) =>
            props.createOrUpdateCompanyGroup(data, {
              onSuccess: () => setCreateGroupOpen(false),
            })
          }
        />
      )}
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
      marginBottom: theme.spacing(4),
    },
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
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
    iconLeft: {
      marginRight: theme.spacing(1),
    },
    categoryButton: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(2),
    },
    rowLarge: {
      width: '100%',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });

export default compose<any, OwnProps>(withStyles(styles, { withTheme: true }))(
  FranchiseCompanySearchList,
);
