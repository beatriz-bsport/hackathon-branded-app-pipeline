import React, { useState, useCallback, useEffect } from 'react';
import { push as pushAction } from 'connected-react-router';

import { WithTranslation, withTranslation } from 'react-i18next';

import { connect, ConnectedProps } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import { compose } from 'recompose';
import withTitle from '#src/hocs/with-title.hoc';

import { RootState } from '#src/reducers';

import {
  fetchActiveContractTemplateList as fetchActiveContractTemplateListAction,
  fetchDisabledContractTemplateList as fetchDisabledContractTemplateListAction,
  deleteContractTemplate as deleteContractTemplateAction,
  restoreContractTemplate as restoreContractTemplateAction,
  createOrUpdateContractTemplate as createOrUpdateContractTemplateAction,
} from '#src/libs/subscription/actions';
import { fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction } from '#src/libs/payment-packs/actions';
import { fetchPrivatePassTemplateList as fetchPrivatePassTemplateListAction } from '#src/libs/private-service/actions';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';

import {
  getActiveContractTemplateList,
  getDisabledContractTemplateList,
  getActiveContractTemplateById as getActiveContractTemplateByIdSelector,
} from '#src/libs/subscription/selectors';
import {
  getPaymentPackTemplateById as getPaymentPackTemplateByIdSelector,
  getPaymentPackTemplateList as getPaymentPackTemplateListSelector,
  getPaymentPackTemplateIdList,
} from '#src/libs/payment-packs/selectors';
import {
  getPrivatePassTemplateById as getPrivatePassTemplateByIdSelector,
  getPrivatePassTemplateList as getPrivatePassTemplateListSelector,
  getPrivatePassTemplateIdList,
} from '#src/libs/private-service/selectors/private-pass';
import {
  getFranchiseCompanyListById as getFranchiseCompanyListByIdSelector,
  getFranchiseCompanyNameById as getFranchiseCompanyNameByIdSelector,
  getAllFranchiseCompanyIds,
} from '#src/libs/franchise/selectors';

import ContractTemplateList from '#src/libs/subscription/franchise-components/ContractTemplateList.component';
import ContractTemplateListItem from '#src/libs/subscription/franchise-components/ContractTemplateListItem.component';
import ContractTemplateDeleteDialog from '#src/libs/subscription/franchise-components/ContractTemplateDeleteDialog.component';
import {
  CONTRACT_TEMPLATE_PAGE_SIZE,
  DEFAULT_CONTRACT_TEMPLATE_FORM_INITIAL_VALUES,
} from '#src/libs/subscription/constants';

import ObjectSearch from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import type {
  ContractTemplate,
  ContractTemplateFormValues,
  ContractAvailabilityOptionProps,
  CompanyOptionProps,
  ContractTemplatePaginatedQueryParams,
  PrivatePassTemplateOptionProps,
  PaymentPackTemplateOptionProps,
  PassTypeOptionProps,
} from '#src/libs/subscription/types';
import {
  ContractAvailabilityMapper,
  PassTypeMapper,
} from '#src/libs/subscription/enums';

import {
  initializeContractTemplateFormValues,
  mapContractTemplateFormValuesToApi,
} from '#src/libs/subscription/utils';

import ContractTemplateFilterHeaderComponent from '#src/libs/subscription/franchise-components/ContractTemplateFilterHeader.component';
import ContractTemplateFormDrawer from '#src/libs/subscription/franchise-components/form/ContractTemplateFormDrawer.component';
import BottomActionsButton from '#src/components/button/BottomActionsButton.component';

const useContractTemplateFilters = (
  fetchActiveContractTemplateList: (
    params: ContractTemplatePaginatedQueryParams,
  ) => void,
) => {
  const [selectedCompanies, setSelectedCompanies] = useState<
    CompanyOptionProps[]
  >([]);

  const [selectedPrivatePassTemplates, setSelectedPrivatePassTemplates] =
    useState<PrivatePassTemplateOptionProps[]>([]);

  const [selectedPaymentPackTemplates, setSelectedPaymentPackTemplates] =
    useState<PaymentPackTemplateOptionProps[]>([]);

  const [selectedPassType, setSelectedPassType] =
    useState<PassTypeOptionProps>(null);

  const [selectedContractAvailability, setSelectedContractAvailability] =
    useState<ContractAvailabilityOptionProps>(null);

  const fetchActiveContractTemplateListHandlerFilter = useCallback(
    (params: ContractTemplatePaginatedQueryParams) => {
      const { manager_only, is_usable_by_staff } =
        ContractAvailabilityMapper[selectedContractAvailability?.value] ?? {};

      const is_appointment_pass = PassTypeMapper[selectedPassType?.value];

      const selectedCompanyIds = selectedCompanies.map(
        (company) => company.value,
      );

      const selectedPrivatePassTemplateIds = selectedPrivatePassTemplates.map(
        (selectedPrivatePassTemplate) => selectedPrivatePassTemplate.value,
      );

      const selectedPaymentPackTemplateIds = selectedPaymentPackTemplates.map(
        (selectedPaymentPackTemplate) => selectedPaymentPackTemplate.value,
      );

      fetchActiveContractTemplateList({
        page: params.page,
        manager_only:
          typeof params.manager_only !== 'undefined'
            ? params.manager_only
            : manager_only,
        is_usable_by_staff:
          typeof params.is_usable_by_staff !== 'undefined'
            ? params.is_usable_by_staff
            : is_usable_by_staff,
        companies: params.companies ?? selectedCompanyIds,
        is_appointment_pass:
          typeof params.is_appointment_pass !== 'undefined'
            ? params.is_appointment_pass
            : is_appointment_pass,
        private_pass_templates:
          params.private_pass_templates ?? selectedPrivatePassTemplateIds,
        payment_pack_templates:
          params.payment_pack_templates ?? selectedPaymentPackTemplateIds,
      });
    },
    [
      selectedContractAvailability?.value,
      selectedPassType?.value,
      fetchActiveContractTemplateList,
      selectedCompanies,
      selectedPrivatePassTemplates,
      selectedPaymentPackTemplates,
    ],
  );

  const handleAvailabilityChange = useCallback(
    (newAvailability: ContractAvailabilityOptionProps) => {
      if (!newAvailability) {
        setSelectedContractAvailability(null);
        fetchActiveContractTemplateListHandlerFilter({
          manager_only: null,
          is_usable_by_staff: null,
        });
        return;
      }
      const availability = ContractAvailabilityMapper[newAvailability?.value];
      setSelectedContractAvailability(newAvailability);
      fetchActiveContractTemplateListHandlerFilter({
        manager_only: availability?.manager_only,
        is_usable_by_staff: availability?.is_usable_by_staff,
      });
    },
    [fetchActiveContractTemplateListHandlerFilter],
  );

  const handleSelectedCompaniesChange = useCallback(
    (newSelectedCompanies: CompanyOptionProps[]) => {
      if (!newSelectedCompanies) {
        setSelectedCompanies([]);
        fetchActiveContractTemplateListHandlerFilter({ companies: [] });
        return;
      }
      const companies = newSelectedCompanies.map((company) => company.value);
      setSelectedCompanies(newSelectedCompanies);
      fetchActiveContractTemplateListHandlerFilter({ companies });
    },
    [fetchActiveContractTemplateListHandlerFilter],
  );

  const handleProductTypeChange = useCallback(
    (newProductType: PassTypeOptionProps) => {
      setSelectedPrivatePassTemplates([]);
      setSelectedPaymentPackTemplates([]);
      if (!newProductType) {
        setSelectedPassType(null);
        fetchActiveContractTemplateListHandlerFilter({
          is_appointment_pass: null,
          private_pass_templates: [],
          payment_pack_templates: [],
        });
        return;
      }
      const newIsAppointmentPass = PassTypeMapper[newProductType?.value];
      setSelectedPassType(newProductType);
      fetchActiveContractTemplateListHandlerFilter({
        is_appointment_pass: newIsAppointmentPass,
        private_pass_templates: [],
        payment_pack_templates: [],
      });
    },
    [fetchActiveContractTemplateListHandlerFilter],
  );

  const handleSelectedPrivatePassTemplateChange = useCallback(
    (newSelectedPrivatePassTemplates: PrivatePassTemplateOptionProps[]) => {
      const privatePassTemplateIds = newSelectedPrivatePassTemplates.map(
        (template) => template.value,
      );
      setSelectedPrivatePassTemplates(newSelectedPrivatePassTemplates);
      fetchActiveContractTemplateListHandlerFilter({
        private_pass_templates: privatePassTemplateIds,
      });
    },
    [fetchActiveContractTemplateListHandlerFilter],
  );

  const handleSelectedPaymentPackTemplateChange = useCallback(
    (newSelectedPaymentPackTemplates: PaymentPackTemplateOptionProps[]) => {
      const paymentPackTemplateIds = newSelectedPaymentPackTemplates.map(
        (template) => template.value,
      );
      setSelectedPaymentPackTemplates(newSelectedPaymentPackTemplates);
      fetchActiveContractTemplateListHandlerFilter({
        payment_pack_templates: paymentPackTemplateIds,
      });
    },
    [fetchActiveContractTemplateListHandlerFilter],
  );
  return {
    selectedPassType,
    selectedContractAvailability,
    selectedCompanies,
    selectedPaymentPackTemplates,
    selectedPrivatePassTemplates,
    handleAvailabilityChange,
    handleSelectedCompaniesChange,
    handleProductTypeChange,
    handleSelectedPrivatePassTemplateChange,
    handleSelectedPaymentPackTemplateChange,
    fetchActiveContractTemplateListHandlerFilter,
  };
};

type Props = ConnectedProps<typeof connector> & WithTranslation;

type OptionProps = React.ComponentProps<typeof ContractTemplateListItem>;

const SearchOption: React.FC<OptionPropsWithData<OptionProps>> = React.memo(
  (props) => <ContractTemplateListItem {...props.data} />,
);
const FranchiseContractTemplateList: React.FC<Props> = ({
  activeContractTemplateState,
  disabledContractTemplateState,
  paymentPackTemplateIdList,
  privatePassTemplateIdList,
  companiesIdList,
  push,
  getPaymentPackTemplateList,
  getPrivatePassTemplateList,
  getPaymentPackTemplateById,
  getPrivatePassTemplateById,
  getActiveContractTemplateById,
  getFranchiseCompanyNameById,
  getFranchiseCompanyListById,
  fetchActiveContractTemplateList,
  fetchDisabledContractTemplateList,
  deleteContractTemplate,
  restoreContractTemplate,
  fetchPaymentPackTemplateList,
  fetchPrivatePassTemplateList,
  fetchFranchise,
  createOrUpdateContractTemplate,
  t,
}) => {
  const classes = useStyles();
  const [showDisabledContractList, setShowDisabledContractList] =
    useState(false);

  const [
    selectedContractTemplateIdToDelete,
    setSelectedContractTemplateIdToDelete,
  ] = React.useState<number | null>(null);

  const [editFormInitialValues, setEditFormInitialValues] = useState<
    ContractTemplateFormValues | undefined
  >(undefined);
  const {
    selectedPassType,
    selectedCompanies,
    selectedContractAvailability,
    selectedPaymentPackTemplates,
    selectedPrivatePassTemplates,
    handleAvailabilityChange,
    handleSelectedCompaniesChange,
    handleProductTypeChange,
    handleSelectedPrivatePassTemplateChange,
    handleSelectedPaymentPackTemplateChange,
    fetchActiveContractTemplateListHandlerFilter,
  } = useContractTemplateFilters(fetchActiveContractTemplateList);

  const fetchActiveContractTemplateListHandler = useCallback(
    (page?: number) => {
      fetchActiveContractTemplateListHandlerFilter({ page });
    },
    [fetchActiveContractTemplateListHandlerFilter],
  );

  const fetchDisabledContractTemplateListHandler = useCallback(
    (page?: number) => {
      fetchDisabledContractTemplateList({ page });
    },
    [fetchDisabledContractTemplateList],
  );

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  useEffect(() => {
    fetchPaymentPackTemplateList();
    fetchPrivatePassTemplateList();
  }, [fetchPaymentPackTemplateList, fetchPrivatePassTemplateList]);

  useEffect(() => {
    fetchActiveContractTemplateList();
    fetchDisabledContractTemplateList();
  }, [fetchActiveContractTemplateList, fetchDisabledContractTemplateList]);

  const handleShowDisabledContractList = useCallback(() => {
    setShowDisabledContractList(
      (previousShowDisabledContractList) => !previousShowDisabledContractList,
    );
  }, []);

  const goToContractTemplateDetailPage = useCallback(
    (id: number) => {
      push(`/f/subscription/contract-template/${id}`);
    },
    [push],
  );

  const OptionsFormatter = useCallback(
    (contractTemplateList: ContractTemplate[]) =>
      (contractTemplateList ?? []).map((contractTemplate) => ({
        label: contractTemplate.name,
        value: contractTemplate.id,
        key: contractTemplate.id,
        item: contractTemplate,
        getFranchiseCompanyListById,
        getPaymentPackTemplateById,
        getPrivatePassTemplateById,
        onClick: goToContractTemplateDetailPage,
        contractTemplate,
      })),
    [
      getFranchiseCompanyListById,
      getPaymentPackTemplateById,
      getPrivatePassTemplateById,
      goToContractTemplateDetailPage,
    ],
  );

  const handleOpenDeleteDialog = useCallback((id: number) => {
    setSelectedContractTemplateIdToDelete(id);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setSelectedContractTemplateIdToDelete(null);
  }, []);

  const handleDeleteContractTemplate = useCallback(() => {
    deleteContractTemplate(selectedContractTemplateIdToDelete, {
      onSuccess: () => {
        fetchActiveContractTemplateListHandler();
        fetchDisabledContractTemplateListHandler();
      },
    });
    setSelectedContractTemplateIdToDelete(null);
  }, [
    deleteContractTemplate,
    fetchActiveContractTemplateListHandler,
    fetchDisabledContractTemplateListHandler,
    selectedContractTemplateIdToDelete,
  ]);

  const handleRestoreContractTemplate = useCallback(
    (id: number) => {
      restoreContractTemplate(id, {
        onSuccess: () => {
          fetchActiveContractTemplateListHandler();
          fetchDisabledContractTemplateListHandler();
        },
      });
    },
    [
      fetchActiveContractTemplateListHandler,
      fetchDisabledContractTemplateListHandler,
      restoreContractTemplate,
    ],
  );

  const handleOpenEditDrawer = useCallback(
    (id: number) => {
      const contractTemplate = getActiveContractTemplateById(id);
      initializeContractTemplateFormValues(
        contractTemplate,
        setEditFormInitialValues,
      );
    },
    [getActiveContractTemplateById],
  );

  const handleOpenAddDrawer = useCallback(() => {
    setEditFormInitialValues(DEFAULT_CONTRACT_TEMPLATE_FORM_INITIAL_VALUES);
  }, []);

  const handleSubmitEditOrAddContractTemplateDrawer = useCallback(
    (formValues: ContractTemplateFormValues) => {
      const payload = mapContractTemplateFormValuesToApi(formValues);
      createOrUpdateContractTemplate(payload, {
        onSuccess: () => {
          setEditFormInitialValues(undefined);
          fetchActiveContractTemplateListHandler();
        },
      });
    },
    [createOrUpdateContractTemplate, fetchActiveContractTemplateListHandler],
  );

  const handleCloseEditOrAddDrawer = useCallback(() => {
    setEditFormInitialValues(undefined);
  }, []);

  const getPaymentPackTemplateNameById = useCallback(
    (id: number) => {
      const paymentPack = getPaymentPackTemplateById(id);
      return paymentPack?.name ?? '';
    },
    [getPaymentPackTemplateById],
  );

  const getPrivatePassTemplateNameById = useCallback(
    (id: number) => {
      const privatePass = getPrivatePassTemplateById(id);
      return privatePass?.name ?? '';
    },
    [getPrivatePassTemplateById],
  );

  return (
    <div>
      <ObjectSearch
        additionalParams={{
          page_size: CONTRACT_TEMPLATE_PAGE_SIZE,
          id__in: activeContractTemplateState.list.map(
            (contractTemplate) => contractTemplate.id,
          ),
          disabled: false,
        }}
        className={classes.searchInput}
        components={{
          Option: SearchOption,
        }}
        optionsFormatter={OptionsFormatter}
        placeholder={t('contractTemplate.filter.searchPlaceholder')}
        searchedObjectType="contract_template"
        variant="underlined"
      />
      <ContractTemplateFilterHeaderComponent
        companiesIdList={companiesIdList}
        getFranchiseCompanyNameById={getFranchiseCompanyNameById}
        getPaymentPackTemplateNameById={getPaymentPackTemplateNameById}
        getPrivatePassTemplateNameById={getPrivatePassTemplateNameById}
        onAvailabilityChange={handleAvailabilityChange}
        onCompanyChange={handleSelectedCompaniesChange}
        onPaymentPackTemplateChange={handleSelectedPaymentPackTemplateChange}
        onPrivatePassTemplateChange={handleSelectedPrivatePassTemplateChange}
        onProductTypeChange={handleProductTypeChange}
        paymentPackTemplateIdList={paymentPackTemplateIdList}
        privatePassTemplateIdList={privatePassTemplateIdList}
        selectedCompanies={selectedCompanies}
        selectedContractAvailability={selectedContractAvailability}
        selectedPassType={selectedPassType}
        selectedPaymentPackTemplates={selectedPaymentPackTemplates}
        selectedPrivatePassTemplates={selectedPrivatePassTemplates}
      />
      <ContractTemplateList
        contractTemplateList={activeContractTemplateState.list}
        contractTemplateNumberOfPages={
          activeContractTemplateState.numberOfPages
        }
        fetchNewPage={fetchActiveContractTemplateListHandler}
        getFranchiseCompanyListById={getFranchiseCompanyListById}
        getPaymentPackTemplateById={getPaymentPackTemplateById}
        getPrivatePassTemplateById={getPrivatePassTemplateById}
        loading={activeContractTemplateState.loading}
        onClick={goToContractTemplateDetailPage}
        onDelete={handleOpenDeleteDialog}
        onEdit={handleOpenEditDrawer}
        page={activeContractTemplateState.page}
      />
      <div>
        <div className={classes.row}>
          <Typography className={classes.sectionTitle} variant="h5">
            {`${t('contract.list.titleInactive')} (${
              disabledContractTemplateState.count
            })`}
          </Typography>
          <IconButton onClick={handleShowDisabledContractList}>
            {showDisabledContractList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        <Divider className={classes.divider} />
        {showDisabledContractList && (
          <ContractTemplateList
            contractTemplateList={disabledContractTemplateState.list}
            contractTemplateNumberOfPages={
              disabledContractTemplateState.numberOfPages
            }
            fetchNewPage={fetchDisabledContractTemplateListHandler}
            getFranchiseCompanyListById={getFranchiseCompanyListById}
            getPaymentPackTemplateById={getPaymentPackTemplateById}
            getPrivatePassTemplateById={getPrivatePassTemplateById}
            loading={disabledContractTemplateState.loading}
            onRestore={handleRestoreContractTemplate}
            page={disabledContractTemplateState.page}
          />
        )}
      </div>
      <BottomActionsButton
        onCreate={handleOpenAddDrawer}
        onCreateLabel={t('subscription:contract.actions.create')}
      />
      <ContractTemplateDeleteDialog
        onClose={handleCloseDeleteDialog}
        onSubmit={handleDeleteContractTemplate}
        open={!!selectedContractTemplateIdToDelete}
      />
      <ContractTemplateFormDrawer
        getPaymentPackTemplateList={getPaymentPackTemplateList}
        getPrivatePassTemplateList={getPrivatePassTemplateList}
        handleClose={handleCloseEditOrAddDrawer}
        handleSubmit={handleSubmitEditOrAddContractTemplateDrawer}
        initialValues={editFormInitialValues}
        open={!!editFormInitialValues}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  searchInput: {
    flex: 1,
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
}));

const mapStateToProps = (state: RootState) => ({
  paymentPackTemplateIdList: getPaymentPackTemplateIdList(state),
  privatePassTemplateIdList: getPrivatePassTemplateIdList(state),
  activeContractTemplateState: {
    list: getActiveContractTemplateList(state),
    page: state.subscription.contractTemplate.active.page,
    loading: state.subscription.contractTemplate.active.loading,
    numberOfPages: state.subscription.contractTemplate.active.numberOfPages,
  },
  disabledContractTemplateState: {
    list: getDisabledContractTemplateList(state),
    page: state.subscription.contractTemplate.disabled.page,
    loading: state.subscription.contractTemplate.disabled.loading,
    count: state.subscription.contractTemplate.disabled.count,
    numberOfPages: state.subscription.contractTemplate.disabled.numberOfPages,
  },
  companiesIdList: getAllFranchiseCompanyIds(state),
  getPaymentPackTemplateById: (id: number) =>
    getPaymentPackTemplateByIdSelector(state, id),
  getPrivatePassTemplateById: (id: number) =>
    getPrivatePassTemplateByIdSelector(state, id),
  getFranchiseCompanyNameById: (id: number) =>
    getFranchiseCompanyNameByIdSelector(state, id),
  getFranchiseCompanyListById: (id__in: number[]) =>
    getFranchiseCompanyListByIdSelector(state, id__in),
  getPrivatePassTemplateList: () => getPrivatePassTemplateListSelector(state),
  getPaymentPackTemplateList: () => getPaymentPackTemplateListSelector(state),
  getActiveContractTemplateById: (id: number) =>
    getActiveContractTemplateByIdSelector(state, id),
});
const mapDispatchToProps = {
  fetchActiveContractTemplateList: fetchActiveContractTemplateListAction,
  fetchDisabledContractTemplateList: fetchDisabledContractTemplateListAction,
  deleteContractTemplate: deleteContractTemplateAction,
  restoreContractTemplate: restoreContractTemplateAction,
  fetchPaymentPackTemplateList: fetchPaymentPackTemplateListAction,
  fetchPrivatePassTemplateList: fetchPrivatePassTemplateListAction,
  fetchFranchise: fetchFranchiseAction,
  createOrUpdateContractTemplate: createOrUpdateContractTemplateAction,
  push: pushAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<Props, {}>(
  connector,
  withTranslation('subscription'),
  withTitle(({ t }) =>
    t('navigation:franchiseMenu.products.contractTemplates'),
  ),
)(FranchiseContractTemplateList);
