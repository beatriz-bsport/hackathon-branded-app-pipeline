import React, { useMemo } from 'react';

import { compose } from 'recompose';
import { Divider, List, makeStyles, Theme } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';

import FuzzySearch from '../../../components/search/FuzzySearch.component';
import { EmailTemplateSummary } from '../../email-editor/types';
import { FranchiseCompany } from '../types';
import EmailListItem from '../../email-editor/components/EmailListItem.components';

export type OwnProps = {
  franchiseEmails: EmailTemplateSummary[];
  companiesEmails: EmailTemplateSummary[];
  selectedId?: number;
  companyDic: Record<number, FranchiseCompany>;
  isGrouped: boolean;
  navigateTo: (emailId: number) => () => void;
  onEdit: (emailId: number) => () => void;
  onDuplicate: (emailId: number) => () => void;
  onDelete: (emailId: number) => () => void;
  saveFilter: (value: boolean) => void;
};

type Props = OwnProps & WithTranslation;

const FranchiseEmailListing = (props: Props) => {
  const {
    selectedId,
    companyDic,
    companiesEmails,
    franchiseEmails,
    isGrouped,
    navigateTo,
    onEdit,
    onDuplicate,
    onDelete,
    saveFilter,
    t,
  } = props;

  const classes = useStyles();

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
    <div>
      <FuzzySearch
        items={[...franchiseEmails, ...companiesEmails]}
        placeholder={t('emails.searchPlaceholder')}
        searchFields={['title', 'subject']}
        itemRenderer={(email, search) => {
          if (franchiseEmails.some((e) => e.id === email.id)) {
            return (
              <EmailListItem
                key={`search_franchise_${email.id}`}
                email={email}
                selectedId={selectedId}
                navigateTo={navigateTo(email.id)}
                onEdit={onEdit(email.id)}
                onDuplicate={onDuplicate(email.id)}
                onDelete={onDelete(email.id)}
                search={search}
                companies={email?.available_for_companies.map(
                  (comp) => companyDic?.[comp],
                )}
                allCompanies={
                  email?.available_for_companies.length ===
                  Object.keys(companyDic).length
                }
              />
            );
          }
          if (companiesEmails.some((e) => e.id === email.id)) {
            return (
              <EmailListItem
                key={`search_company_${email.id}`}
                email={email}
                selectedId={selectedId}
                navigateTo={navigateTo(email.id)}
                onEdit={onEdit(email.id)}
                onDelete={onDelete(email.id)}
                search={search}
                companies={[companyDic?.[email.company_id]]}
              />
            );
          }
          return null;
        }}
      />

      <div className={classes.grouping}>
        <Typography variant="body1">{t('emails.groupBy')}</Typography>
        <div className={classes.dropdown}>
          <Select
            options={[
              {
                value: true,
                label: t('emails.franchised'),
              },
            ]}
            value={
              isGrouped
                ? {
                    value: true,
                    label: t('emails.franchised'),
                  }
                : undefined
            }
            nullCurrentValue={!isGrouped}
            placeholder={t('emails.chooseGroup')}
            onChange={handleGroupByChange}
            isClearable
          />
        </div>
      </div>
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
                  email={email}
                  selectedId={selectedId}
                  navigateTo={navigateTo(email.id)}
                  onEdit={onEdit(email.id)}
                  onDuplicate={onDuplicate(email.id)}
                  onDelete={onDelete(email.id)}
                  companies={email?.available_for_companies.map(
                    (comp) => companyDic?.[comp],
                  )}
                  allCompanies={
                    email?.available_for_companies.length ===
                    Object.keys(companyDic).length
                  }
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
                              selectedId={selectedId}
                              navigateTo={navigateTo(email.id)}
                              onEdit={onEdit(email.id)}
                              onDelete={onDelete(email.id)}
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
                    email={email}
                    selectedId={selectedId}
                    navigateTo={navigateTo(email.id)}
                    onEdit={onEdit(email.id)}
                    onDelete={onDelete(email.id)}
                    companies={[companyDic?.[email.company_id]]}
                  />
                ))}
              </List>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  franchisedBlock: {
    marginBottom: theme.spacing(4),
  },
  list: {
    backgroundColor: 'white',
    marginBottom: theme.spacing(2),
    borderRadius: 5,
    boxShadow: theme.shadows[1],
    paddingTop: 0,
    paddingBottom: 0,
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
