// @ts-nocheck
import React from 'react';
import { makeStyles, Theme, Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { TFunction } from 'i18next';
import { FranchiseCompany } from '../franchise/types';
import { EmailTemplateSummary } from '../email-editor/types';
import EmailListItem from '../email-editor/components/EmailListItem.components';
import InfoBox from '#components/box/InfoBox.component';
import { HEIGHT_ITEM } from './EmailVirtualizedList.components';
import { sortCompanyListByIsAllowedAndName } from '#libs/franchise/utils';

type RowProps = {
  index: number;
  categoriesIndex: number[];
  categoriesId: string[];
  isGrouped: boolean;
  franchiseEmails: EmailTemplateSummary[];
  companiesEmails: EmailTemplateSummary[];
  genericBsportTemplates: EmailTemplateSummary[];
  companiesEmailsByCompanyId: Array<EmailTemplateSummary[]>;
  companyDic: Record<number, FranchiseCompany>;
  t: TFunction;
  selectedId?: number;
  navigateTo: (emailId: number) => void;
  onEdit: (emailId: number) => void;
  onDelete: (emailId: number) => void;
  onDuplicate: (emailId: number) => void;
  heightItem: number;
  heightTitle: number;
  heightCategoryTitle: number;
};

function getCategoryId(index: number, categoriesIndex: number[]) {
  let rank: number;
  rank = -1;
  for (let i = 0; i < categoriesIndex.length; i += 1) {
    if (index >= categoriesIndex[i]) rank += 1;
  }
  return rank;
}

export default function VirtualRowItem(props: RowProps) {
  const {
    index,
    categoriesIndex,
    categoriesId,
    isGrouped,
    franchiseEmails,
    companiesEmails,
    genericBsportTemplates,
    companiesEmailsByCompanyId,
    companyDic,
    t,
    selectedId,
    navigateTo,
    onEdit,
    onDelete,
    onDuplicate,
    heightItem,
    heightTitle,
    heightCategoryTitle,
  } = props;

  const nbFranchiseEmails = franchiseEmails.length;
  const nbCompaniesEmails = companiesEmails.length;
  const nbGenericBsportTemplates = genericBsportTemplates.length;

  const haveFranchiseEmails = nbFranchiseEmails > 0;
  const haveCompaniesEmails = nbCompaniesEmails > 0;
  const haveGenericBsportTemplates = nbGenericBsportTemplates > 0;

  const style = useStyle();

  if (haveFranchiseEmails) {
    if (index === 0) {
      return (
        <Typography
          key="title-fanchise"
          className={style.title}
          style={{ height: heightTitle }}
          variant="h5"
        >
          {t('emails.franchiseEmails')}
        </Typography>
      );
    }
    if (index > 0 && index <= nbFranchiseEmails) {
      const email = franchiseEmails[index - 1];
      return (
        <EmailListItem
          key={`franchise-${email.id}`}
          virtualized
          allCompanies={
            email?.available_for_companies.length ===
            Object.keys(companyDic).length
          }
          companies={sortCompanyListByIsAllowedAndName(
            email?.available_for_companies.map((comp) => companyDic?.[comp]),
          )}
          email={email}
          heightItem={heightItem}
          navigateTo={navigateTo}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
          selectedId={selectedId}
        />
      );
    }
  }
  if (haveCompaniesEmails) {
    const startIndex = haveFranchiseEmails ? 1 + nbFranchiseEmails : 0;
    if (index === startIndex) {
      return (
        <Typography
          key="title-companies"
          className={style.title}
          style={{ height: heightTitle }}
          variant="h5"
        >
          {t('emails.companiesEmails')}
        </Typography>
      );
    }
    if (isGrouped) {
      if (
        index > startIndex &&
        index <= startIndex + nbCompaniesEmails + categoriesIndex.length
      ) {
        const categoryRankInList = getCategoryId(index, categoriesIndex);
        const categoryStartIndex = categoriesIndex[categoryRankInList];
        const categoryId = categoriesId[categoryRankInList];
        if (index === categoryStartIndex) {
          // We have a category title
          return (
            <div
              className={style.categoryContainer}
              style={{ height: heightCategoryTitle }}
            >
              <Typography
                key={`group-by-${categoryId}`}
                className={style.categoryTitle}
                variant="h5"
              >
                {companyDic?.[categoryId]?.name}
              </Typography>
              <Divider className={style.divider} />
            </div>
          );
        }
        const indexInCat: number = index - categoryStartIndex - 1;
        const email = companiesEmailsByCompanyId[categoryId][indexInCat];
        return (
          <EmailListItem
            key={`group-by-${email.id}`}
            virtualized
            email={email}
            heightItem={heightItem}
            navigateTo={navigateTo}
            onDelete={onDelete}
            onEdit={onEdit}
            selectedId={selectedId}
          />
        );
      }
    }
    if (!isGrouped) {
      if (index > startIndex && index <= startIndex + nbCompaniesEmails) {
        const email = companiesEmails[index - startIndex - 1];
        return (
          <EmailListItem
            key={`group-by-${email.id}`}
            virtualized
            email={email}
            navigateTo={navigateTo}
            onDelete={onDelete}
            onEdit={onEdit}
            selectedId={selectedId}
          />
        );
      }
    }
  }
  if (haveGenericBsportTemplates) {
    const startIndex =
      nbFranchiseEmails +
      (haveFranchiseEmails ? 1 : 0) +
      nbCompaniesEmails +
      (haveCompaniesEmails ? 1 : 0) +
      (isGrouped && companiesEmailsByCompanyId
        ? Object.keys(companiesEmailsByCompanyId).length
        : 0);

    if (index === startIndex) {
      return (
        <Typography
          key="title-genericBsportTemplates"
          className={style.title}
          style={{ height: heightTitle }}
          variant="h5"
        >
          {t('emailTemplate:bsportTemplateEmails')}
        </Typography>
      );
    }
    if (index === startIndex + 1) {
      return (
        <div style={{ height: HEIGHT_ITEM, overflowY: 'auto' }}>
          <InfoBox content={t('emailTemplate:infoBsportTemplateEmails')} />
        </div>
      );
    }
    if (
      index > startIndex &&
      index <= startIndex + nbGenericBsportTemplates + 1
    ) {
      const email = genericBsportTemplates[index - startIndex - 2];
      return (
        <EmailListItem
          key={`generic-template-${email.id}`}
          virtualized
          email={email}
          navigateTo={navigateTo}
          onDuplicate={onDuplicate}
          selectedId={selectedId}
        />
      );
    }
  }
  return null;
}

const useStyle = makeStyles((theme: Theme) => ({
  title: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  categoryTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 500,
    fontSize: 16,
  },
  categoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
}));
