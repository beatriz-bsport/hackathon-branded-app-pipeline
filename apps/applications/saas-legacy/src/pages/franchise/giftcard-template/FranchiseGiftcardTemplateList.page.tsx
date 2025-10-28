import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { push as pushAction } from 'connected-react-router';

import { withTranslation, WithTranslation } from 'react-i18next';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import {
  getGiftcardTemplateData,
  getGiftcardTemplateListLoading,
  getGiftcardTemplateActiveList,
  getGiftcardTemplateInactiveList,
  getGiftcardTemplateFullList,
} from '#src/libs/giftcard/selectors';
import {
  getFranchiseCompanyById,
  getFranchiseCompanies,
} from '#src/libs/franchise/selectors';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';
import {
  deleteGiftcardTemplate as deleteGiftcardTemplateAction,
  fetchGiftcardTemplateList as fetchGiftcardTemplateListAction,
  createOrUpdateGiftcardTemplate as createOrUpdateGiftcardTemplateAction,
} from '#src/libs/giftcard/actions';
import { GiftcardFormDrawer } from '#src/libs/giftcard/components/GiftcardFormDrawer';
import FranchiseGenericProductDoubleList from '#src/libs/franchise/components/generic-product/template-list/FranchiseGenericProductDoubleList.component';
import { GiftcardTemplate, GiftcardDataAPI } from '#src/libs/giftcard/types';
import { FranchiseCompany } from '#src/libs/franchise/types';
import { WithHandlerType } from '../../../utils/types';
import { OptionCallback } from '../../../state/types';
import { RootState } from '../../../reducers';
import { buildUrlParams } from '../../../http';

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type HandlerType = {
  createOrUpdateGiftcardTemplate: (
    data: GiftcardDataAPI,
    options?: OptionCallback<any>,
  ) => void;
  onUpdateTemplate: (templateId: number) => void;
};

type Props = ConnectedProps<typeof connector> &
  WithTranslation &
  StateHandlerType &
  HandlerType;

export class FranchiseGiftcardTemplateListPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchFranchise();
    this.props.fetchGiftcardTemplateList();
  }

  getTemplatePrimaryText = (template: GiftcardTemplate) => template.name;

  getTemplateSecondaryText = (template: GiftcardTemplate) => {
    const price = getCurrencyDisplayWithPrice(template.price);
    const validity = template.expiration_days
      ? this.props.t('giftcardTemplate.template.validity', {
          count: template.expiration_days,
        })
      : this.props.t('giftcardTemplate.template.unlimited');
    return `${price} - ${validity}`;
  };

  getTemplateFranchiseCompanyList = (template: GiftcardTemplate) => {
    return template.companies
      .map((company_id) =>
        // @ts-expect-error
        this.props.allFranchiseCompaniesWithAllowed.find(
          (c: FranchiseCompany) => c.id === company_id,
        ),
      )
      .filter((c) => !!c);
  };

  getTemplateCover = (template: GiftcardTemplate) => template.cover;

  render() {
    const { t } = this.props;
    return (
      <>
        <FranchiseGenericProductDoubleList
          withFuzzySearch
          activeItemList={this.props.activeGiftcardTemplateList}
          deleteTemplateDialogContent={t(
            'giftcardTemplate.template.deleteDialogContent',
          )}
          emptyButtonLabel={t('giftcardTemplate.listPage.addButton')}
          emptyExplainLabel={t('giftcardTemplate.listPage.emptyLabel')}
          fuzzySearchItemList={this.props.allGiftcardTemplateList}
          // @ts-expect-error
          fuzzySearchPlaceholder={t(
            'giftcardTemplate.listPage.fuzzyPlaceholder',
          )}
          getItemCover={this.getTemplateCover}
          getItemFranchiseCompanies={this.getTemplateFranchiseCompanyList}
          getItemPrimaryText={this.getTemplatePrimaryText}
          getItemSecondaryText={this.getTemplateSecondaryText}
          goToItemDetailPage={this.props.goToTemplateGiftcardDetail}
          inactiveItemList={this.props.inactiveGiftcardTemplateList}
          loading={this.props.loadingTemplateGiftcardList}
          onCreateTemplate={this.props.onCreateTemplate}
          onDeleteTemplate={this.props.deleteGiftcardTemplate}
          onUpdateTemplate={this.props.onUpdateTemplate}
        />
        <GiftcardFormDrawer
          initial={this.props.templateToUpdate}
          onClose={this.props.closeCreateOrUpdateForm}
          onSubmit={this.props.createOrUpdateGiftcardTemplate}
          open={this.props.openForm}
        />
      </>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    allGiftcardTemplatesById: getGiftcardTemplateData(state),
    activeGiftcardTemplateList: getGiftcardTemplateActiveList(state),
    inactiveGiftcardTemplateList: getGiftcardTemplateInactiveList(state),
    allGiftcardTemplateList: getGiftcardTemplateFullList(state),
    loadingTemplateGiftcardList: getGiftcardTemplateListLoading(state),
    allFranchiseCompaniesById: getFranchiseCompanyById(state),
    allFranchiseCompaniesWithAllowed: getFranchiseCompanies(state),
  }),
  {
    fetchFranchise: fetchFranchiseAction,
    goToTemplateGiftcardDetail: (id: number, params: any = {}) =>
      pushAction(`/f/giftcard-template/${id}/${buildUrlParams(params)}`),
    fetchGiftcardTemplateList: fetchGiftcardTemplateListAction,
    createOrUpdateGiftcardTemplate: createOrUpdateGiftcardTemplateAction,
    deleteGiftcardTemplate: deleteGiftcardTemplateAction,
  },
);

const withStateHandlersInit: {
  openForm: boolean;
  templateToUpdate?: GiftcardTemplate;
} = {
  openForm: false,
  templateToUpdate: null,
};

const withStateHandlersSetter = {
  onCreateTemplate: () => () => ({
    openForm: true,
    // @ts-expect-error
    templateToUpdate: null,
  }),
  closeCreateOrUpdateForm: () => () => ({ openForm: false }),
  setTemplateToUpdate: () => (gt: GiftcardTemplate) => ({
    openForm: true,
    templateToUpdate: gt,
  }),
};

export default compose(
  withTranslation(['giftcard']),
  connector,
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers({
    onUpdateTemplate:
      ({ allGiftcardTemplatesById, setTemplateToUpdate }) =>
      (templateId: number) => {
        setTemplateToUpdate(allGiftcardTemplatesById[templateId]);
      },
    createOrUpdateGiftcardTemplate:
      ({
        createOrUpdateGiftcardTemplate,
        closeCreateOrUpdateForm,
        goToTemplateGiftcardDetail,
        templateToUpdate,
      }) =>
      (data: GiftcardDataAPI, options?: OptionCallback<any>) => {
        createOrUpdateGiftcardTemplate(templateToUpdate?.id || null, data, {
          onError: options && options.onError,
          onSuccess: (template: GiftcardTemplate) => {
            if (!template.companies.length) {
              goToTemplateGiftcardDetail(template.id, {
                openSelectCompaniesForm: true,
              });
            }
            closeCreateOrUpdateForm();
            if (options && options.onSuccess) {
              options.onSuccess(template);
            }
          },
        });
      },
  }),
)(FranchiseGiftcardTemplateListPage);
