// @ts-nocheck
import React, { useMemo } from 'react';
import { compose } from 'recompose';
import { Divider, List, makeStyles, Theme } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';

import FuzzySearch from '#components/search/FuzzySearch.component';
import { EmailTemplateSummary } from '#libs/email-editor/types';
import { FranchiseCompany } from '#libs/franchise/types';
import EmailListItem from '#libs/email-editor/components/EmailListItem.components';
import EmailVirtualizedList from '#libs/email-virtualized-editor';
import { sortCompanyListByIsAllowedAndName } from '#libs/franchise/utils';

export type OwnProps = {
  emails: EmailTemplateSummary[];
  selectedId?: number;
  companies: FranchiseCompany[];
  isGrouped: boolean;
  navigateTo: (emailId: number) => void;
  onEdit: (emailId: number) => void;
  onDuplicate: (emailId: number) => void;
  onDelete: (emailId: number) => void;
  saveFilter: (value: boolean) => void;
  useVirtualizedList: boolean;
};

type Props = OwnProps & WithTranslation;

const orderByTitle = (a: EmailTemplateSummary, b: EmailTemplateSummary) =>
  a.title.localeCompare(b.title);

const FranchiseEmailListing = (props: Props) => {
  const {
    selectedId,
    companies,
    isGrouped,
    navigateTo,
    onEdit,
    onDuplicate,
    onDelete,
    saveFilter,
    t,
    emails,
    useVirtualizedList,
  } = props;

  const franchiseEmails = [...emails]
    .filter((email) => email.company_id === null)
    .sort(orderByTitle);
  const companiesEmails = [...emails]
    .filter((email) => email.company_id !== null)
    .sort(orderByTitle);

  const classes = useStyles();

  const companyDic = useMemo(
    () =>
      companies?.reduce<Record<number, FranchiseCompany>>((dic, company) => {
        // eslint-disable-next-line no-param-reassign
        dic[company.id] = company;
        return dic;
      }, {}),
    [companies],
  );

  const companiesEmailsByCompanyId = useMemo(
    () =>
      companiesEmails.reduce<Record<number, EmailTemplateSummary[]>>(
        (byCompanyId, email) => {
          // eslint-disable-next-line no-param-reassign
          byCompanyId[email.company_id] = (
            byCompanyId?.[email.company_id] ?? []
          ).concat([email]);
          return byCompanyId;
        },
        {},
      ),
    [companiesEmails],
  );

  const handleGroupByChange = (item: { value: boolean }) => {
    saveFilter(item?.value ?? null);
  };

  return (
    <div className={classes.container}>
      <FuzzySearch
        itemRenderer={(email, search) => {
          if (franchiseEmails.some((e) => e.id === email.id)) {
            return (
              <EmailListItem
                key={`search_franchise_${email.id}`}
                virtualized
                allCompanies={
                  email?.available_for_companies.length ===
                  Object.keys(companyDic).length
                }
                companies={sortCompanyListByIsAllowedAndName(
                  email?.available_for_companies.map(
                    (comp) => companyDic?.[comp],
                  ),
                )}
                email={email}
                navigateTo={navigateTo}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onEdit={onEdit}
                search={search}
                selectedId={selectedId}
              />
            );
          }
          if (companiesEmails.some((e) => e.id === email.id)) {
            return (
              <EmailListItem
                key={`search_company_${email.id}`}
                virtualized
                companies={[companyDic?.[email.company_id]]}
                email={email}
                navigateTo={navigateTo}
                onDelete={onDelete}
                onEdit={onEdit}
                search={search}
                selectedId={selectedId}
              />
            );
          }
          return null;
        }}
        items={[...franchiseEmails, ...companiesEmails]}
        placeholder={t('emails.searchPlaceholder')}
        searchFields={['title', 'subject']}
      />

      <div className={classes.grouping}>
        <Typography variant="body1">{t('emails.groupBy')}</Typography>
        <div className={classes.dropdown}>
          <Select
            isClearable
            nullCurrentValue={!isGrouped}
            onChange={handleGroupByChange}
            options={[
              {
                value: true,
                label: t('emails.franchised'),
              },
            ]}
            placeholder={t('emails.chooseGroup')}
            value={
              isGrouped
                ? {
                    value: true,
                    label: t('emails.franchised'),
                  }
                : undefined
            }
          />
        </div>
      </div>
      {!useVirtualizedList ? (
        <div className={classes.scroll}>
          {franchiseEmails.length > 0 && (
            <div className={classes.franchisedBlock}>
              <Typography className={classes.title} variant="h5">
                {t('emails.franchiseEmails')}
              </Typography>
              <List className={classes.list}>
                {franchiseEmails.map((email) => (
                  <EmailListItem
                    key={`franchise-${email.id}`}
                    allCompanies={
                      email?.available_for_companies.length ===
                      Object.keys(companyDic).length
                    }
                    companies={sortCompanyListByIsAllowedAndName(
                      email?.available_for_companies.map(
                        (comp) => companyDic?.[comp],
                      ),
                    )}
                    email={email}
                    navigateTo={navigateTo}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onEdit={onEdit}
                    selectedId={selectedId}
                  />
                ))}
              </List>
            </div>
          )}
          {companiesEmails.length > 0 && (
            <>
              <Typography className={classes.title} variant="h5">
                {t('emails.companiesEmails')}
              </Typography>
              {isGrouped && (
                <>
                  {companiesEmailsByCompanyId &&
                    Object.keys(companiesEmailsByCompanyId).map((companyId) => (
                      <React.Fragment key={`company-${companyId}`}>
                        <Typography
                          className={classes.companyTitle}
                          variant="body1"
                        >
                          {companyDic?.[parseInt(companyId)]?.name}
                        </Typography>
                        <Divider className={classes.divider} />
                        <List className={classes.list}>
                          {companiesEmailsByCompanyId[parseInt(companyId)]?.map(
                            (email) => (
                              <EmailListItem
                                key={`group-by-${email.id}`}
                                email={email}
                                navigateTo={navigateTo}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                selectedId={selectedId}
                              />
                            ),
                          )}
                        </List>
                      </React.Fragment>
                    ))}
                </>
              )}
              {!isGrouped && (
                <List className={classes.list}>
                  {companiesEmails.map((email) => (
                    <EmailListItem
                      key={email.id}
                      companies={[companyDic?.[email.company_id]]}
                      email={email}
                      navigateTo={navigateTo}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      selectedId={selectedId}
                    />
                  ))}
                </List>
              )}
            </>
          )}
        </div>
      ) : (
        <EmailVirtualizedList
          companiesEmailsByCompanyId={companiesEmailsByCompanyId}
          companyDic={companyDic}
          emails={emails}
          isGrouped={isGrouped}
          navigateTo={navigateTo}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
          selectedId={selectedId}
          t={t}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginBottom: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  franchisedBlock: {
    marginBottom: theme.spacing(4),
  },
  list: {
    backgroundColor: 'white',
    borderRadius: 5,
    boxShadow: theme.shadows[1],
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: 'center',
  },
  scroll: {
    maxHeight: '75vh',
    paddingRight: theme.spacing(2),
    overflowY: 'auto',
  },
  companyTitle: {
    marginTop: theme.spacing(2),
    fontWeight: 500,
    fontSize: 16,
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  grouping: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  dropdown: {
    width: 300,
  },
}));

export default compose<any, OwnProps>(withTranslation(['franchise']))(
  FranchiseEmailListing,
);
