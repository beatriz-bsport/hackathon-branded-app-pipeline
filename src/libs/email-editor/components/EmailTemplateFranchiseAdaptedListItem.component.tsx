import React from 'react';

import Immutable from 'seamless-immutable';

import EmailListItem from '#src/libs/email-editor/components/EmailListItem.components';

import { sortCompanyListByIsAllowedAndName } from '#src/libs/franchise/utils';

import { FranchisorEmailDesignTabs } from '#src/pages/franchise/email-template/constants';

import type { FranchiseCompany } from '#src/libs/franchise/types';
import type { EmailTemplateSummary } from '#src/libs/email-editor/types';

const EmailTemplateFranchiseAdaptedListItem: React.FC<{
  companies: Immutable.ImmutableArray<FranchiseCompany>;
  context: FranchisorEmailDesignTabs;
  emailTemplate: EmailTemplateSummary;
  navigateTo: (id: number) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
  onEdit: (id: number) => void;
  selectedId: number;
}> = ({
  companies,
  context,
  emailTemplate,
  navigateTo,
  onDelete,
  onDuplicate,
  onEdit,
  selectedId,
}) => {
  const emailCompaniesDisplay = React.useMemo<
    Immutable.ImmutableArray<FranchiseCompany>
  >(() => {
    switch (context) {
      // When the context is FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR, this block displays
      // only the chips (UI elements) for companies that are allowed. Specifically,
      // it filters and displays companies that:
      //   - are marked as allowed (company.isAllowed),
      //   - and have IDs included in the email template's available_for_companies list.
      // After filtering, the list is sorted by the sortCompanyListByIsAllowedAndName function.
      case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR:
        return sortCompanyListByIsAllowedAndName(
          (companies ?? [])
            .filter(
              (company) =>
                company?.isAllowed &&
                emailTemplate?.available_for_companies.includes(company?.id),
            )
            .filter((_company) => !!_company),
        );

      // When the context is FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE, this block displays
      // only the chip for the company that created the email template. The assumption
      // here is that the API has already filtered out unauthorized companies, ensuring
      // that only the relevant company's chip is displayed.
      case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE:
        return Immutable(
          [
            companies?.find(
              (company) => company?.id === emailTemplate?.company_id,
            ),
          ].filter((_company) => !!_company),
        );

      // Default case returns an empty Immutable array when no specific conditions are met.
      default:
        return Immutable([]);
    }
  }, [
    context,
    emailTemplate?.available_for_companies,
    companies,
    emailTemplate?.company_id,
  ]);

  const allCompanies = React.useMemo(() => {
    switch (context) {
      case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR:
        return (
          emailTemplate?.available_for_companies.length === companies?.length
        );
      default:
        return false;
    }
  }, [context, emailTemplate?.available_for_companies, companies?.length]);

  return (
    <EmailListItem
      key={emailTemplate?.id}
      allCompanies={allCompanies}
      //@ts-expect-error Immutable structure
      companies={emailCompaniesDisplay}
      email={emailTemplate}
      navigateTo={navigateTo}
      onDelete={!emailTemplate.is_default_bsport_template && onDelete}
      onDuplicate={onDuplicate}
      onEdit={!emailTemplate.is_default_bsport_template && onEdit}
      selectedId={selectedId}
    />
  );
};

export default React.memo(EmailTemplateFranchiseAdaptedListItem);
