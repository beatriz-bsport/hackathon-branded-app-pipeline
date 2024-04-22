import React from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CompanyGroupFormDialog from './CompanyGroupFormDialog.component';
import CompanyListItem from '#libs/membership/components/CompanyListItem.component';
import FuzzySearch from '#components/search/FuzzySearch.component';
import HighlightedText from '#components/HighlightedText/HighlightedText.component';

import type { FranchiseCompany, CompanyGroup } from '#libs/franchise/types';
import type { OptionCallback } from '#state/types';

type Props = {
  asManager: boolean;
  companies: FranchiseCompany[];
  companyGroupList: CompanyGroup[];
  isRedirectLoading?: boolean;
  restrictedFranchisees: boolean;
  selectedCompanyId?: number;
  createOrUpdateCompanyGroup: (
    data: any,
    options: OptionCallback<CompanyGroup>,
  ) => void;
  handleCompanySelected: (company: number, name: string) => () => void;
};

const FranchiseCompanySearchList: React.FC<Props> = ({
  asManager,
  companies,
  companyGroupList,
  isRedirectLoading,
  restrictedFranchisees,
  selectedCompanyId,
  createOrUpdateCompanyGroup,
  handleCompanySelected,
}) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();

  const [groupToEdit, setGroupToEdit] = React.useState<CompanyGroup | null>(
    null,
  );

  const [createGroupOpen, setCreateGroupOpen] = React.useState<boolean>(false);

  const nonEmptyCompanyGroups = React.useMemo(
    () =>
      (companyGroupList || []).filter((group) =>
        companies.some((company) => company.company_group === group.id),
      ),
    [companies, companyGroupList],
  );

  const companiesWithoutGroup = React.useMemo(
    () => companies.filter((company) => !company.company_group),
    [companies],
  );

  const getCompaniesForGroup = React.useCallback(
    (group: CompanyGroup) =>
      companies.filter(
        (company) =>
          !!company.company_group && company.company_group === group.id,
      ),
    [companies],
  );

  return (
    <div>
      <FuzzySearch
        itemRenderer={(company, search) => (
          <ListItem
            key={company.id}
            button
            divider
            className={classes.row}
            onClick={handleCompanySelected(company.id, company.name)}
            selected={company.id === selectedCompanyId}
          >
            <div className={classes.companyRow}>
              <Avatar
                alt={company.name}
                className={classes.avatar}
                src={company.cover}
              />
              <Typography variant="body1">
                <HighlightedText highlight={search} text={company.name} />
              </Typography>
            </div>
          </ListItem>
        )}
        items={companies}
        placeholder={t('companies.searchPlaceholder')}
        searchFields={['name']}
      />
      {!!asManager && !restrictedFranchisees && (
        <Button
          className={classes.categoryButton}
          color="primary"
          onClick={() => setCreateGroupOpen(true)}
          variant="outlined"
        >
          <AddIcon className={classes.iconLeft} />
          {t('companyGroup.actions.add')}
        </Button>
      )}
      {nonEmptyCompanyGroups.map((group) => (
        <div key={group.id} className={classes.companiesContainer}>
          <div className={classes.rowLarge}>
            <Typography variant="h4">{group.name}</Typography>
            {!restrictedFranchisees && (
              <IconButton color="primary" onClick={() => setGroupToEdit(group)}>
                <EditIcon />
              </IconButton>
            )}
          </div>
          <Divider className={classes.divider} />
          <Paper>
            {getCompaniesForGroup(group).map((company) => (
              <CompanyListItem
                key={company.id}
                company={company}
                isRedirectLoading={isRedirectLoading}
                onClick={handleCompanySelected(company.id, company.name)}
                selected={company.id === selectedCompanyId}
              />
            ))}
          </Paper>
        </div>
      ))}
      <div className={classes.companiesContainer}>
        <Paper>
          {companiesWithoutGroup.map((company) => (
            <CompanyListItem
              key={company.id}
              company={company}
              isRedirectLoading={isRedirectLoading}
              onClick={handleCompanySelected(company.id, company.name)}
              selected={company.id === selectedCompanyId}
            />
          ))}
        </Paper>
      </div>
      {!!groupToEdit && (
        <CompanyGroupFormDialog
          companyList={companies}
          initial={groupToEdit}
          onClose={() => setGroupToEdit(null)}
          onSubmit={(data) =>
            createOrUpdateCompanyGroup(data, {
              onSuccess: () => setGroupToEdit(null),
            })
          }
          open={!!groupToEdit}
        />
      )}
      {!!createGroupOpen && (
        <CompanyGroupFormDialog
          companyList={companies}
          onClose={() => setCreateGroupOpen(false)}
          onSubmit={(data) =>
            createOrUpdateCompanyGroup(data, {
              onSuccess: () => setCreateGroupOpen(false),
            })
          }
          open={!!createGroupOpen}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
}));

export default React.memo(FranchiseCompanySearchList);
