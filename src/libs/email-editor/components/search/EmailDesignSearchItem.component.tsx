import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { useSelector } from 'react-redux';
import {
  getFranchiseCompanyById,
  getAllowedFranchisees,
} from '#src/libs/franchise/selectors';

import { FranchiseCompany } from '#src/libs/franchise/types';
import type { EmailTemplateSummary } from '#src/libs/email-editor/types';
import EmailListItem from '#src/libs/email-editor/components/EmailListItem.components';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

/**
@description Connected component necessary to leverage the permissions of a staff and companies.
**/
const EmailDesignSearchItem: React.ComponentType<
  OptionPropsWithData<EmailTemplateSummary> & {
    data: { emailDesign: EmailTemplateSummary };
  }
> = (props) => {
  const companyById = useSelector(getFranchiseCompanyById);
  const allowedFranchiseeIds = useSelector(getAllowedFranchisees);

  const companies = React.useMemo(
    () =>
      (allowedFranchiseeIds ?? [])
        .map((id: number) => companyById?.[id])
        .filter((company: FranchiseCompany) => !!company),
    [allowedFranchiseeIds, companyById],
  );

  return <EmailListItem {...props.data} companies={companies} />;
};

export default React.memo(EmailDesignSearchItem);
