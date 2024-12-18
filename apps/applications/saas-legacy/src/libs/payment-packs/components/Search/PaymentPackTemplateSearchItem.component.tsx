import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { useSelector } from 'react-redux';
import {
  getFranchiseCompanyById,
  getAllowedFranchisees,
  withAllowedOnArray,
} from '#src/libs/franchise/selectors';
import {
  PaymentPackTemplateAPI,
  PaymentPackTemplate,
  PaymentPackTemplateInstance,
} from '#src/libs/payment-packs/types';

import PaymentPackTemplateListItem from '#src/libs/payment-packs/components/PaymentPackTemplateListItem.component';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

/**
@description Connected component necessary to leverage the permissions of a staff and companies.
**/
const PaymentPackTemplateSearchItem: React.ComponentType<
  OptionPropsWithData<PaymentPackTemplateAPI> & {
    data: { paymentPackTemplate: PaymentPackTemplate };
  }
> = (props) => {
  const companyById = useSelector(getFranchiseCompanyById);
  const allowedFranchiseIds = useSelector(getAllowedFranchisees);

  const paymentPackTemplate = React.useMemo(
    () => ({
      ...props.data.paymentPackTemplate,
      companies: withAllowedOnArray(
        props.data.paymentPackTemplate.payment_pack_template_instances
          .map(
            (ppti: PaymentPackTemplateInstance) =>
              !ppti.disabled && ppti.company,
          )
          .filter(
            (payment_pack_template_intance_id: number) =>
              !!payment_pack_template_intance_id,
          ),
        allowedFranchiseIds,
        companyById,
      )?.filter((c) => !!c),
    }),
    [props.data, companyById, allowedFranchiseIds],
  );

  return (
    <PaymentPackTemplateListItem
      {...props.data}
      paymentPackTemplate={{ ...paymentPackTemplate }}
    />
  );
};

export default React.memo(PaymentPackTemplateSearchItem);
