import React, { useCallback, useEffect } from 'react';
import Immutable from 'seamless-immutable';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushAction } from 'connected-react-router';
import { Grid, makeStyles, useTheme, useMediaQuery } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withPageHeightHOC, {
  WithPageHeight,
} from '#src/hocs/with-page-height.hoc';

import {
  emailTemplateDelete as emailTemplateDeleteAction,
  emailTemplateDetail as emailTemplateDetailAction,
  resetEmailDetail as resetEmailDetailAction,
  emailTemplateDuplicate as emailTemplateDuplicateAction,
  fetchEmailTemplatesSummariesOwnedByFranchisorPaginated as fetchEmailTemplatesSummariesOwnedByFranchisorPaginatedAction,
  fetchEmailTemplatesSummariesOwnedByFranchiseePaginated as fetchEmailTemplatesSummariesOwnedByFranchiseePaginatedAction,
  fetchEmailTemplatesSummariesBsportDefaultPaginated as fetchEmailTemplatesSummariesBsportDefaultPaginatedAction,
} from '#src/libs/email-editor/actions';
import {
  getFranchiseEmailDesignOwnedByFranchisorPaginatedState,
  getFranchiseEmailDesignOwnedByFranchiseePaginatedState,
  getFranchiseEmailDesignBsportDefaultPaginatedState,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';

import { getFranchiseCompanies } from '#src/libs/franchise/selectors';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';

import ModalConfirm from '#src/components/ModalConfirm.component';
import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import EmailDesignSearchItem from '#src/libs/email-editor/components/search/EmailDesignSearchItem.component';
import PaginatedListBaseReworked from '#src/components/PaginatedListBaseReworked.component';
import EmailTemplateFranchiseAdaptedListItem from '#src/libs/email-editor/components/EmailTemplateFranchiseAdaptedListItem.component';
import BottomActionButtons from '#src/components/button/BottomActionsButton.component';
import HTMLPreview from '#src/components/html/HTMLPreview.component';
import HTMLPreviewDialog from '#src/components/html/HTMLPreviewDialog.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import FranchiseEmailTemplatePageInfo from '#src/libs/email-editor/components/FranchiseEmailTemplatePageInfo.component';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';

import { FranchisorEmailDesignTabs } from '#src/pages/franchise/email-template/constants';
import { buildUrlParams } from '#src/http/utils';

import type { FranchiseCompany } from '#src/libs/franchise/types';
import type {
  EmailTemplateSummary,
  EmailTemplate,
  EmailDesignQueryParamsPaginated,
} from '#src/libs/email-editor/types';

import type { RootState } from '#src/reducers';

type RouterParamsToProps = {
  id: number;
  queryParams: {
    tab?: FranchisorEmailDesignTabs;
  };
  setQueryParam: (queryParam: 'tab') => (value: string) => void;
};

type Props = RouterParamsToProps &
  ConnectedProps<typeof connector> &
  WithPageHeight;

const FranchiseEmailList: React.FC<Props> = ({
  companies,
  deleteTemplate,
  emailDetail,
  emailDetailLoading,
  emailTemplateDetail,
  emailTemplateDuplicate,
  fetchEmailTemplatesSummariesBsportDefaultPaginated,
  fetchEmailTemplatesSummariesOwnedByFranchiseePaginated,
  fetchEmailTemplatesSummariesOwnedByFranchisorPaginated,
  fetchFranchise,
  franchiseEmailDesignBsportDefaultPaginatedState,
  franchiseEmailDesignOwnedByFranchiseePaginatedState,
  franchiseEmailDesignOwnedByFranchisorPaginatedState,
  id,
  pageHeight,
  push,
  queryParams,
  resetEmailDetail,
  setQueryParam,
}) => {
  const { t } = useTranslation(['franchise', 'emailTemplate']);
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [currentTab, setCurrentTab] = React.useState<FranchisorEmailDesignTabs>(
    FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR,
  );

  const [emailTemplateToDelete, setEmailTemplateToDelete] = React.useState<
    number | null
  >(null);

  const [selectedCompany, setSelectedCompany] = React.useState<{
    label: string;
    value: number;
  }>(null);

  const pageFilters = React.useMemo(() => {
    if (
      currentTab === FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE &&
      selectedCompany?.value
    ) {
      return { company: selectedCompany.value };
    }
    if (
      currentTab === FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR &&
      selectedCompany?.value
    ) {
      return { available_for_companies: [selectedCompany.value] };
    }
    return {};
  }, [currentTab, selectedCompany?.value]);

  // CDM
  useEffect(() => {
    fetchFranchise();
    fetchEmailTemplatesSummariesOwnedByFranchisorPaginated({
      page: 1,
      ...pageFilters,
    });
    fetchEmailTemplatesSummariesOwnedByFranchiseePaginated({
      page: 1,
      ...pageFilters,
    });
    fetchEmailTemplatesSummariesBsportDefaultPaginated({
      page: 1,
    });
  }, [
    fetchFranchise,
    fetchEmailTemplatesSummariesOwnedByFranchisorPaginated,
    fetchEmailTemplatesSummariesOwnedByFranchiseePaginated,
    fetchEmailTemplatesSummariesBsportDefaultPaginated,
    pageFilters,
  ]);

  React.useEffect(() => {
    if (
      [
        FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR,
        FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE,
        FranchisorEmailDesignTabs.BSPORT_DEFAULT,
      ].includes(queryParams?.tab)
    ) {
      setCurrentTab(queryParams?.tab);
    } else {
      setQueryParam('tab')(FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR);
    }
  }, [queryParams?.tab, setQueryParam]);

  useEffect(() => {
    if (id === undefined) {
      return;
    }
    if (isNaN(id)) {
      push(`/f/email-template/`);
      return;
    }
    if (id) {
      emailTemplateDetail(id);
    }
  }, [push, emailTemplateDetail, id]);

  const emailTemplateActionToUse = React.useCallback(
    (params: EmailDesignQueryParamsPaginated) => {
      switch (currentTab) {
        case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR:
          return fetchEmailTemplatesSummariesOwnedByFranchisorPaginated({
            ...params,
            ...pageFilters,
          });

        case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE:
          return fetchEmailTemplatesSummariesOwnedByFranchiseePaginated({
            ...params,
            ...pageFilters,
          });

        case FranchisorEmailDesignTabs.BSPORT_DEFAULT:
          return fetchEmailTemplatesSummariesBsportDefaultPaginated({
            ...params,
          });

        default:
          return fetchEmailTemplatesSummariesOwnedByFranchisorPaginated({
            ...params,
            ...pageFilters,
          });
      }
    },
    [
      currentTab,
      fetchEmailTemplatesSummariesOwnedByFranchisorPaginated,
      fetchEmailTemplatesSummariesOwnedByFranchiseePaginated,
      fetchEmailTemplatesSummariesBsportDefaultPaginated,
      pageFilters,
    ],
  );
  React.useEffect(() => {
    if (
      currentTab === FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE &&
      selectedCompany?.value
    ) {
      emailTemplateActionToUse({ page: 1, company: selectedCompany.value });
    }
    if (
      currentTab === FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR &&
      selectedCompany?.value
    ) {
      emailTemplateActionToUse({
        page: 1,
        available_for_companies: [selectedCompany.value],
      });
    }
  }, [currentTab, selectedCompany, emailTemplateActionToUse]);

  // This ensures that the list is properly refreshed when switching tabs.
  React.useEffect(() => {
    emailTemplateActionToUse({ page: 1 });
  }, [emailTemplateActionToUse]);

  const handleOnChange = React.useCallback(
    (newTab: FranchisorEmailDesignTabs) => {
      setQueryParam('tab')(newTab);
    },
    [setQueryParam],
  );

  const refreshCurrentContext = React.useCallback(
    () => emailTemplateActionToUse({ page: 1, ...pageFilters }),
    [emailTemplateActionToUse, pageFilters],
  );

  const handleOpenDeleteModal = React.useCallback(
    (emailTemplateId: number) => setEmailTemplateToDelete(emailTemplateId),
    [],
  );

  const handleCloseDeleteModal = React.useCallback(
    () => setEmailTemplateToDelete(null),
    [],
  );

  const navigateToCreate = useCallback(() => {
    push('/f/email-template/create');
  }, [push]);

  const navigateTo = useCallback(
    (emailId: number) => {
      push(`/f/email-template/${emailId}${buildUrlParams(queryParams)}`);
    },
    [push, queryParams],
  );

  const onEdit = useCallback(
    (emailId: number) => {
      push(`/f/email-template/${emailId}/edit`);
    },
    [push],
  );

  const onDuplicate = useCallback(
    (emailId: number) => {
      emailTemplateDuplicate({
        id: emailId,
        copyTranslation: t('emails.copy'),
        options: {
          onSuccess: (templateId: number) => {
            navigateTo(templateId);
            // Duplicating EmailDesign no matter the context here will create a EmailDesign owned by the franchisor.
            handleOnChange(FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR);
          },
        },
      });
    },
    [navigateTo, emailTemplateDuplicate, t, handleOnChange],
  );

  const handleEmailTemplateDelete = useCallback(() => {
    deleteTemplate(emailTemplateToDelete, {
      onSuccess: () => {
        setEmailTemplateToDelete(null);
        refreshCurrentContext();
      },
      onError: () => {
        setEmailTemplateToDelete(null);
        refreshCurrentContext();
      },
    });
  }, [deleteTemplate, emailTemplateToDelete, refreshCurrentContext]);

  const formatSearchOptions = React.useCallback(
    (searchResults: EmailTemplate[]) => {
      return searchResults.map((result) => ({
        label: result.title,
        value: result.id,
        email: result,
        navigateTo: navigateTo,
        onEdit: onEdit,
        onDuplicate: onDuplicate,
      }));
    },
    [navigateTo, onEdit, onDuplicate],
  );

  const tabsData = Immutable([
    {
      label: t('emailTemplate:franchiseEmailsPage.tabs.ownByFranchisor'),
      value: FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR,
    },
    {
      label: t('emailTemplate:franchiseEmailsPage.tabs.ownByFranchisee'),
      value: FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE,
    },
    {
      label: t('emailTemplate:franchiseEmailsPage.tabs.bsportDefault'),
      value: FranchisorEmailDesignTabs.BSPORT_DEFAULT,
    },
  ]);

  const paginatedStateToUse = React.useMemo(() => {
    switch (currentTab) {
      case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR:
        return franchiseEmailDesignOwnedByFranchisorPaginatedState;
      case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE:
        return franchiseEmailDesignOwnedByFranchiseePaginatedState;
      case FranchisorEmailDesignTabs.BSPORT_DEFAULT:
        return franchiseEmailDesignBsportDefaultPaginatedState;
      default:
        return franchiseEmailDesignOwnedByFranchisorPaginatedState;
    }
  }, [
    currentTab,
    franchiseEmailDesignOwnedByFranchisorPaginatedState,
    franchiseEmailDesignOwnedByFranchiseePaginatedState,
    franchiseEmailDesignBsportDefaultPaginatedState,
  ]);

  const searchParams = React.useMemo(() => {
    switch (currentTab) {
      case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR:
        return {
          is_franchise: true,
          is_default_bsport_template: false,
        };
      case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE:
        return {
          is_franchise: false,
          is_default_bsport_template: false,
        };
      case FranchisorEmailDesignTabs.BSPORT_DEFAULT:
        return { is_default_bsport_template: true };
      default:
        return {
          is_franchise: true,
          is_default_bsport_template: false,
        };
    }
  }, [currentTab]);

  const allowedCompaniesOptions = React.useMemo(() => {
    return companies
      .filter((company) => !!company && company.isAllowed)
      .map((_company) => ({
        label: _company.name,
        value: _company.id,
      }));
  }, [companies]);

  const handleFilterCompanyChange = React.useCallback(
    (options: { label: string; value: number }) => {
      switch (currentTab) {
        case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISEE:
        case FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR:
          setSelectedCompany(options);
          break;
        default:
          return;
      }
    },
    [setSelectedCompany, currentTab],
  );

  const handleCloseEmailDetailModal = React.useCallback(
    () => resetEmailDetail(),
    [resetEmailDetail],
  );
  return (
    <ContentWithAppBar
      onChange={handleOnChange}
      pageHeight={pageHeight}
      tab={currentTab}
      tabsData={tabsData}
    >
      <>
        <div className={classes.container}>
          <Grid container direction="row" spacing={3}>
            <Grid item md={6} xs={12}>
              <div className={classes.filtersAndInfoContainer}>
                <ObjectSearchComponent
                  additionalParams={{ available: true, ...searchParams }}
                  components={{
                    Option: EmailDesignSearchItem,
                  }}
                  optionsFormatter={formatSearchOptions}
                  placeholder={t('emailTemplate:search')}
                  searchedObjectType="email_design"
                  variant="default"
                />

                {currentTab !== FranchisorEmailDesignTabs.BSPORT_DEFAULT && (
                  <MaterialUISelector
                    isClearable
                    onChange={handleFilterCompanyChange}
                    options={[...allowedCompaniesOptions]}
                    placeholder={t(
                      'emailTemplate:franchiseEmailsPage.filters.companySelectPlaceHolder',
                    )}
                    value={selectedCompany}
                  />
                )}
                <FranchiseEmailTemplatePageInfo context={currentTab} />
              </div>
              <PaginatedListBaseReworked
                itemPerPage={paginatedStateToUse.page_size}
                items={paginatedStateToUse.items}
                loading={paginatedStateToUse.loading}
                nbItems={paginatedStateToUse.count}
                onPageRequested={emailTemplateActionToUse}
                page={paginatedStateToUse.page}
                renderItem={(emailTemplate: EmailTemplateSummary) => (
                  <EmailTemplateFranchiseAdaptedListItem
                    companies={companies}
                    context={currentTab}
                    emailTemplate={emailTemplate}
                    navigateTo={navigateTo}
                    onDelete={handleOpenDeleteModal}
                    onDuplicate={onDuplicate}
                    onEdit={onEdit}
                    selectedId={id}
                  />
                )}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <div className={classes.scroll}>
                {isMobile && emailDetail?.[id]?.html && (
                  <HTMLPreviewDialog
                    html={emailDetail?.[id]?.html}
                    loading={emailDetailLoading}
                    onClose={handleCloseEmailDetailModal}
                    open={!!emailDetail?.[id]?.html}
                    title={t('emails.emptyStateTitle')}
                  />
                )}
                {!isMobile && (
                  <HTMLPreview
                    scrolling
                    html={emailDetail?.[id]?.html ?? null}
                    loading={emailDetailLoading}
                    title={t('emails.emptyStateTitle')}
                  />
                )}
              </div>
            </Grid>
          </Grid>
          {currentTab === FranchisorEmailDesignTabs.OWNED_BY_FRANCHISOR && (
            <BottomActionButtons
              onCreate={navigateToCreate}
              onCreateLabel={t('emails.create')}
            />
          )}
          <ModalConfirm
            handleCancel={handleCloseDeleteModal}
            handleConfirm={handleEmailTemplateDelete}
            open={!!emailTemplateToDelete}
            options={{
              title: 'emailTemplate:modal.delete.title',
              cancel: 'emailTemplate:modal.delete.cancel',
              confirm: 'emailTemplate:modal.delete.confirm',
              Content: () => <p>{t('emailTemplate:modal.delete.content')}</p>,
            }}
          />
        </div>
      </>
    </ContentWithAppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: '20vh',
  },
  loader: {
    position: 'relative',
    top: 0 - theme.spacing(2),
    left: 0 - theme.spacing(4),
    width: '100vw',
  },
  scroll: {
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowY: 'auto',
    maxHeight: '100%',
    height: '100%',
  },
  filtersAndInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const connector = connect(
  (state: RootState) => ({
    companies: getFranchiseCompanies(
      state,
    ) as Immutable.ImmutableArray<FranchiseCompany>,
    emailDetail: getEmailTemplatesDetail(state),
    emailDetailLoading: state.emailTemplate.detail.loading,
    franchiseEmailDesignBsportDefaultPaginatedState:
      getFranchiseEmailDesignBsportDefaultPaginatedState(state),
    franchiseEmailDesignOwnedByFranchiseePaginatedState:
      getFranchiseEmailDesignOwnedByFranchiseePaginatedState(state),
    franchiseEmailDesignOwnedByFranchisorPaginatedState:
      getFranchiseEmailDesignOwnedByFranchisorPaginatedState(state),
  }),
  {
    deleteTemplate: emailTemplateDeleteAction,
    emailTemplateDetail: emailTemplateDetailAction,
    resetEmailDetail: resetEmailDetailAction,
    emailTemplateDuplicate: emailTemplateDuplicateAction,
    fetchEmailTemplatesSummariesBsportDefaultPaginated:
      fetchEmailTemplatesSummariesBsportDefaultPaginatedAction,
    fetchEmailTemplatesSummariesOwnedByFranchiseePaginated:
      fetchEmailTemplatesSummariesOwnedByFranchiseePaginatedAction,
    fetchEmailTemplatesSummariesOwnedByFranchisorPaginated:
      fetchEmailTemplatesSummariesOwnedByFranchisorPaginatedAction,
    fetchFranchise: fetchFranchiseAction,
    push: pushAction,
  },
);

export default compose<Props, RouterParamsToProps>(
  withRouter,
  routerParamsToProps({ id: 'id:number' }),
  withQueryParams([['tab'], 'queryParams', 'setQueryParam']),
  connector,
  React.memo,
  withPageHeightHOC(),
)(FranchiseEmailList);
