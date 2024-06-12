import React, { useCallback, useEffect, useState, useMemo } from 'react';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import {
  ContractTemplateFilterOpenMenu,
  PassType,
  ContractAvailability,
} from '#src/libs/subscription/enums';
import type {
  ContractAvailabilityOptionProps,
  CompanyOptionProps,
  PrivatePassTemplateOptionProps,
  PaymentPackTemplateOptionProps,
  PassTypeOptionProps,
} from '#src/libs/subscription/types';

type Props = {
  companiesIdList: number[];
  privatePassTemplateIdList: number[];
  paymentPackTemplateIdList: number[];
  selectedPassType: PassTypeOptionProps;
  onAvailabilityChange: (availability: ContractAvailabilityOptionProps) => void;
  onCompanyChange: (company: CompanyOptionProps[]) => void;
  onPrivatePassTemplateChange: (
    privatePassTemplate: PrivatePassTemplateOptionProps[],
  ) => void;
  onPaymentPackTemplateChange: (
    paymentPackTemplate: PaymentPackTemplateOptionProps[],
  ) => void;
  onProductTypeChange: (productType: PassTypeOptionProps) => void;
  getFranchiseCompanyNameById: (id: number) => string;
  getPrivatePassTemplateNameById: (id: number) => string;
  getPaymentPackTemplateNameById: (id: number) => string;
  selectedCompanies: CompanyOptionProps[];
  selectedContractAvailability: ContractAvailabilityOptionProps;
  selectedPrivatePassTemplates: PrivatePassTemplateOptionProps[];
  selectedPaymentPackTemplates: PaymentPackTemplateOptionProps[];
};

type ChipsRendererProps = {
  data:
    | CompanyOptionProps
    | PaymentPackTemplateOptionProps
    | PrivatePassTemplateOptionProps;
  onDelete: () => void;
};

const ChipsRendererComponent: React.FC<ChipsRendererProps> = ({
  data,
  onDelete,
}) => <Chip color="primary" label={data.label} onDelete={onDelete} />;

const ContractTemplateFilterHeader: React.FC<Props> = ({
  companiesIdList,
  privatePassTemplateIdList,
  paymentPackTemplateIdList,
  selectedPassType,
  onCompanyChange,
  onPaymentPackTemplateChange,
  onPrivatePassTemplateChange,
  onProductTypeChange,
  onAvailabilityChange,
  getFranchiseCompanyNameById,
  getPrivatePassTemplateNameById,
  getPaymentPackTemplateNameById,
  selectedCompanies,
  selectedContractAvailability,
  selectedPrivatePassTemplates,
  selectedPaymentPackTemplates,
}) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  const passTypeOptions = useMemo(
    () => [
      { value: PassType.PASSES, label: t('contractTemplate.filter.passes') },
      {
        value: PassType.APPOINTMENT_PASSES,
        label: t('contractTemplate.filter.appointmentPasses'),
      },
    ],
    [t],
  );

  const contractAvailabilityOptions = useMemo(
    () => [
      {
        value: ContractAvailability.FOR_EVERYONE,
        label: t('contractTemplate.filter.availableForEveryone'),
      },
      {
        value: ContractAvailability.FOR_STAFF_ONLY,
        label: t('contractTemplate.filter.staffOnly'),
      },
      {
        value: ContractAvailability.FOR_MEMBER_ONLY,
        label: t('contractTemplate.filter.memberOnly'),
      },
      {
        value: ContractAvailability.UNAVAILABLE,
        label: t('contractTemplate.filter.unavailableForEveryone'),
      },
    ],
    [t],
  );

  const ChipsRenderer = useCallback(ChipsRendererComponent, []);

  const companyOptions = useMemo(
    () =>
      companiesIdList.map((id) => ({
        value: id,
        label: getFranchiseCompanyNameById(id),
      })),
    [companiesIdList, getFranchiseCompanyNameById],
  );

  const privatePassTemplateOptions = useMemo(
    () =>
      privatePassTemplateIdList.map((id) => ({
        value: id,
        label: getPrivatePassTemplateNameById(id),
      })),
    [privatePassTemplateIdList, getPrivatePassTemplateNameById],
  );

  const paymentPackTemplateOptions = useMemo(
    () =>
      paymentPackTemplateIdList.map((id) => ({
        value: id,
        label: getPaymentPackTemplateNameById(id),
      })),
    [paymentPackTemplateIdList, getPaymentPackTemplateNameById],
  );

  const [openMenuState, setOpenMenuState] =
    useState<ContractTemplateFilterOpenMenu>(
      ContractTemplateFilterOpenMenu.NONE,
    );

  const handleOutsideClick = (event: MouseEvent) => {
    const element = event.target as Element;
    const ids = [
      '#productType',
      '#associatedPasses',
      '#availability',
      '#companies',
    ];

    for (let id of ids) {
      if (element.closest(id)) {
        return;
      }
    }

    setOpenMenuState(ContractTemplateFilterOpenMenu.NONE);
  };

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const onProductTypeChangeHandler = useCallback(
    (productType: PassTypeOptionProps) => {
      setOpenMenuState(ContractTemplateFilterOpenMenu.NONE);
      onProductTypeChange(productType);
    },
    [setOpenMenuState, onProductTypeChange],
  );

  const onPaymentPackTemplateChangeHandler = useCallback(
    (paymentPackTemplate: PaymentPackTemplateOptionProps[]) => {
      setOpenMenuState(ContractTemplateFilterOpenMenu.NONE);
      onPaymentPackTemplateChange(paymentPackTemplate);
    },
    [setOpenMenuState, onPaymentPackTemplateChange],
  );

  const onPrivatePassTemplateChangeHandler = useCallback(
    (privatePassTemplate: PrivatePassTemplateOptionProps[]) => {
      setOpenMenuState(ContractTemplateFilterOpenMenu.NONE);
      onPrivatePassTemplateChange(privatePassTemplate);
    },
    [setOpenMenuState, onPrivatePassTemplateChange],
  );

  const onAvailabilityChangeHandler = useCallback(
    (availability: ContractAvailabilityOptionProps) => {
      setOpenMenuState(ContractTemplateFilterOpenMenu.NONE);
      onAvailabilityChange(availability);
    },
    [setOpenMenuState, onAvailabilityChange],
  );

  const onCompanyChangeHandler = useCallback(
    (company: CompanyOptionProps[]) => {
      setOpenMenuState(ContractTemplateFilterOpenMenu.NONE);
      onCompanyChange(company);
    },
    [setOpenMenuState, onCompanyChange],
  );

  const openProductTypeMenu = useCallback(() => {
    setOpenMenuState(ContractTemplateFilterOpenMenu.PRODUCT_TYPE);
  }, [setOpenMenuState]);

  const openAssociatedPassesMenu = useCallback(() => {
    setOpenMenuState(ContractTemplateFilterOpenMenu.ASSOCIATED_PASSES);
  }, [setOpenMenuState]);

  const openContractAvailabilityMenu = useCallback(() => {
    setOpenMenuState(ContractTemplateFilterOpenMenu.CONTRACT_AVAIALABILITY);
  }, [setOpenMenuState]);

  const openCompaniesMenu = useCallback(() => {
    setOpenMenuState(ContractTemplateFilterOpenMenu.COMPANIES);
  }, [setOpenMenuState]);

  const stopPropagationHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
      event.stopPropagation(),
    [],
  );
  return (
    <div onClick={stopPropagationHandler}>
      <Grid
        container
        alignItems="center"
        className={classes.title}
        direction="row"
        spacing={2}
      >
        <Grid item md={3} xs={6}>
          <MaterialUISelector
            isClearable
            id="productType"
            menuIsOpen={
              openMenuState === ContractTemplateFilterOpenMenu.PRODUCT_TYPE
            }
            onChange={onProductTypeChangeHandler}
            onMenuOpen={openProductTypeMenu}
            options={passTypeOptions}
            placeholder={t('contractTemplate.filter.productType')}
            value={selectedPassType}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          {selectedPassType?.value === PassType.APPOINTMENT_PASSES ? (
            <MaterialUISelector
              isClearable
              isMulti
              chipsRenderer={ChipsRenderer}
              id="associatedPasses"
              menuIsOpen={
                openMenuState ===
                ContractTemplateFilterOpenMenu.ASSOCIATED_PASSES
              }
              onChange={onPrivatePassTemplateChangeHandler}
              onMenuOpen={openAssociatedPassesMenu}
              options={[...privatePassTemplateOptions]}
              placeholder={t('contractTemplate.filter.associatedPass')}
              value={selectedPrivatePassTemplates}
            />
          ) : (
            <MaterialUISelector
              isClearable
              isMulti
              chipsRenderer={ChipsRenderer}
              id="associatedPasses"
              isDisabled={selectedPassType === null}
              menuIsOpen={
                openMenuState ===
                ContractTemplateFilterOpenMenu.ASSOCIATED_PASSES
              }
              onChange={onPaymentPackTemplateChangeHandler}
              onMenuOpen={openAssociatedPassesMenu}
              options={[...paymentPackTemplateOptions]}
              placeholder={t('contractTemplate.filter.associatedPass')}
              value={selectedPaymentPackTemplates}
            />
          )}
        </Grid>
        <Grid item md={3} xs={6}>
          <MaterialUISelector
            isClearable
            id="availability"
            menuIsOpen={
              openMenuState ===
              ContractTemplateFilterOpenMenu.CONTRACT_AVAIALABILITY
            }
            onChange={onAvailabilityChangeHandler}
            onMenuOpen={openContractAvailabilityMenu}
            options={contractAvailabilityOptions}
            placeholder={t('contractTemplate.filter.availability')}
            value={selectedContractAvailability}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <MaterialUISelector
            isClearable
            isMulti
            chipsRenderer={ChipsRenderer}
            id="companies"
            menuIsOpen={
              openMenuState === ContractTemplateFilterOpenMenu.COMPANIES
            }
            onChange={onCompanyChangeHandler}
            onMenuOpen={openCompaniesMenu}
            options={[...companyOptions]}
            placeholder={t('contractTemplate.filter.studios')}
            value={selectedCompanies}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    alignItems: 'flex-start',
    alignSelf: 'strech',
    marginBottom: theme.spacing(3),
  },
}));

export default React.memo(ContractTemplateFilterHeader);
