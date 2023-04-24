// @ts-nocheck
import React, { useMemo, useCallback } from 'react';
import { TFunction } from 'i18next';
import memoize from 'memoize-one';
import { FranchiseCompany } from '../franchise/types';
import { EmailTemplateSummary } from '../email-editor/types';
import VirtualizedVariableList from './VirtualizedVariableList.component';
import VirtualRowItem from './VirtualRowItem.component';

type Props = {
  emails: EmailTemplateSummary[];
  isGrouped: boolean;
  selectedId?: number;
  companyDic: Record<number, FranchiseCompany>;
  navigateTo: (emailId: number) => void;
  onEdit: (emailId: number) => void;
  onDuplicate: (emailId: number) => void;
  onDelete: (emailId: number) => void;
  companiesEmailsByCompanyId: Array<EmailTemplateSummary[]>;
  t: TFunction;
};

const orderByTitle = (a: EmailTemplateSummary, b: EmailTemplateSummary) =>
  a.title.localeCompare(b.title);

export const HEIGHT_ITEM = 130;
const HEIGHT_TITLE = 100;
const HEIGHT_CATEGORY_TITLE = 80;

const getMaps = memoize(
  (
    nbFranchiseEmails: number,
    nbCompaniesEmails: number,
    companiesById: Array<EmailTemplateSummary[]>,
    grouping: boolean,
    nbGenericBsportTemplates: number,
  ) => {
    const mapTitles = []; // Index in the list of the titles of the sections
    const mapCategoryTitles = []; // Index in the list of the titles of the categories
    const mapCategoryId = [];

    if (nbFranchiseEmails > 0) mapTitles.push(0);
    if (nbCompaniesEmails > 0) mapTitles.push(nbFranchiseEmails + 1);

    let startIndex = nbFranchiseEmails > 0 ? nbFranchiseEmails + 1 : 0;
    if (grouping && companiesById) {
      for (const key in companiesById) {
        if (companiesById[key]) {
          mapCategoryTitles.push(startIndex + 1);
          mapCategoryId.push(key);
          startIndex += 1 + companiesById[key].length;
        }
      }
    }
    if (nbGenericBsportTemplates > 0)
      mapTitles.push(
        nbFranchiseEmails +
          nbCompaniesEmails +
          (grouping ? Object.keys(companiesById).length : 0) +
          2,
      );
    return { mapTitles, mapCategoryTitles, mapCategoryId };
  },
);

export default function EmailVirtualizedList(props: Props) {
  const {
    emails,
    isGrouped,
    onEdit,
    navigateTo,
    onDuplicate,
    onDelete,
    selectedId,
    companyDic,
    companiesEmailsByCompanyId,
    t,
  } = props;

  const franchiseEmails = [...(emails ?? [])]
    .filter(
      (email) => email.company_id === null && !email.is_default_bsport_template,
    )
    .sort(orderByTitle);
  const companiesEmails = [...(emails ?? [])]
    .filter((email) => email.company_id !== null)
    .sort(orderByTitle);
  const genericBsportTemplates = [...(emails ?? [])]
    .filter((email) => email.is_default_bsport_template)
    .sort(orderByTitle);

  const nbFranchiseEmails = franchiseEmails.length;
  const nbCompaniesEmails = companiesEmails.length;
  const nbGenericBsportTemplates = genericBsportTemplates.length;

  const haveFranchiseEmails = nbFranchiseEmails > 0;
  const haveCompaniesEmails = nbCompaniesEmails > 0;
  const haveGenericBsportTemplates = nbGenericBsportTemplates > 0;

  const itemCount: number =
    nbFranchiseEmails +
    (haveFranchiseEmails ? 1 : 0) + // for titles before fanchises emails
    nbCompaniesEmails +
    (haveCompaniesEmails ? 1 : 0) + // for titles before companies emails
    (isGrouped && companiesEmailsByCompanyId
      ? Object.keys(companiesEmailsByCompanyId).length
      : 0) + // for category titles
    nbGenericBsportTemplates +
    (haveGenericBsportTemplates ? 2 : 0); // for titles before generic emails

  const { mapTitles, mapCategoryTitles, mapCategoryId } = useMemo(
    () =>
      getMaps(
        nbFranchiseEmails,
        nbCompaniesEmails,
        companiesEmailsByCompanyId,
        isGrouped,
        nbGenericBsportTemplates,
      ),
    [
      nbFranchiseEmails,
      nbCompaniesEmails,
      companiesEmailsByCompanyId,
      isGrouped,
      nbGenericBsportTemplates,
    ],
  );

  const getItemSize = useCallback(
    (index: number) => {
      if (mapTitles.includes(index)) {
        return HEIGHT_TITLE;
      }
      if (mapCategoryTitles.includes(index)) {
        return HEIGHT_CATEGORY_TITLE;
      }
      return HEIGHT_ITEM;
    },
    [mapTitles, mapCategoryTitles],
  );

  return (
    <VirtualizedVariableList
      itemCount={itemCount}
      itemSize={HEIGHT_ITEM}
      variableItemSize={(index) => getItemSize(index)}
      renderRow={(index) => {
        return (
          <VirtualRowItem
            index={index}
            key={index}
            categoriesIndex={mapCategoryTitles}
            categoriesId={mapCategoryId}
            isGrouped={isGrouped}
            franchiseEmails={franchiseEmails}
            companiesEmails={companiesEmails}
            genericBsportTemplates={genericBsportTemplates}
            companiesEmailsByCompanyId={companiesEmailsByCompanyId}
            companyDic={companyDic}
            t={t}
            selectedId={selectedId}
            navigateTo={navigateTo}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            heightItem={HEIGHT_ITEM}
            heightTitle={HEIGHT_TITLE}
            heightCategoryTitle={HEIGHT_CATEGORY_TITLE}
          />
        );
      }}
      minItemsDisplaid={3}
    />
  );
}
