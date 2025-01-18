import React from 'react';

import { Divider } from '@material-ui/core';
import PaymentPackFormGeneral from './PaymentPackFormGeneral.component';
import PaymentPackFormValidity from './PaymentPackFormValidity.component';
import PaymentPackFormRestrictions from './PaymentPackFormRestrictions.component';
import UniversalPassFormPrivateserviceCompatibility from '#src/libs/universal-pass/components/UniversalPassFormPrivateserviceCompatibility.component';
import PaymentPackFormAdvancedOptions from './PaymentPackFormAdvancedOptions.component';
import { useStyles } from './styles';

import type { BookkeepingAccount } from '#src/libs/payment/types';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackFormValues,
} from '../../types';
import type {
  PrivatePass,
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
} from '#src/libs/private-service/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { SCT } from '#src/libs/category/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';

type Props = {
  initial: PaymentPack<PrivatePass>;
  isInDrawer: boolean;
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
  bookkeepingAccounts: BookkeepingAccount[];
  paymentPackCategories: PaymentPackCategory[];
  provincialTax: number;
  allowGuestMaster: boolean;
  availableEstablishmentList: Establishment[];
  categoryList: SCT[];
  metaActivityList: MetaActivity[];
  values: PaymentPackFormValues;
  compatibleServicePass: ServiceCompatibilityPass[];
  privateServices: PrivateServiceWithSlots[];
  tagList: Tag<TagGroup>[];
};

const PaymentPackFormDetailsAndRestrictionsStep = ({
  initial,
  isInDrawer,
  bookkeepingAccountById,
  bookkeepingAccounts,
  paymentPackCategories,
  provincialTax,
  allowGuestMaster,
  availableEstablishmentList,
  categoryList,
  metaActivityList,
  values,
  compatibleServicePass,
  privateServices,
  tagList,
}: Props) => {
  const [disabledUniversalPassFields, setDisableUniversalPassFields] =
    React.useState<boolean>(false);
  const classes = useStyles();
  return (
    <>
      <div
        className={
          !isInDrawer ? classes.formContainer : classes.firstFormContainer
        }
      >
        <PaymentPackFormGeneral
          bookkeepingAccountById={bookkeepingAccountById}
          bookkeepingAccounts={bookkeepingAccounts}
          disabledUniversalPassFields={disabledUniversalPassFields}
          initial={initial}
          paymentPackCategories={paymentPackCategories}
          provincialTax={provincialTax}
          setDisableUniversalPassFields={setDisableUniversalPassFields}
        />
      </div>
      <Divider className={classes.divider} />
      <div className={classes.formContainer}>
        <PaymentPackFormValidity
          disabledUniversalPassFields={disabledUniversalPassFields}
          initial={initial}
        />
      </div>
      <Divider className={classes.divider} />
      <div className={classes.formContainer}>
        <PaymentPackFormRestrictions
          allowGuestMaster={!!allowGuestMaster}
          availableEstablishmentList={availableEstablishmentList}
          categoryList={categoryList}
          disabledUniversalPassFields={disabledUniversalPassFields}
          initial={initial}
          metaActivityList={metaActivityList}
        />
      </div>
      <Divider className={classes.divider} />
      {values.is_universal_pass && (
        <>
          <div className={classes.formContainer}>
            <UniversalPassFormPrivateserviceCompatibility
              compatibleServicePass={compatibleServicePass}
              field_name="linked_private_pass_compatibility"
              initial={initial}
              privateServices={privateServices}
            />
          </div>
          <Divider className={classes.divider} />
        </>
      )}
      <div className={classes.formContainer}>
        <PaymentPackFormAdvancedOptions
          disabledUniversalPassFields={disabledUniversalPassFields}
          tagList={tagList}
        />
      </div>
      <Divider className={classes.divider} />
    </>
  );
};

export default PaymentPackFormDetailsAndRestrictionsStep;
