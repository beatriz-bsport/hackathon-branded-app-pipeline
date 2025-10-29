import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { WithStyles, withStyles, Theme, createStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import uniq from 'lodash/uniq';

import { withTranslation, WithTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { push } from 'connected-react-router';
import { GiftcardFormDrawer } from '#src/libs/giftcard/components/GiftcardFormDrawer';

import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';

import BackofficeLinearProgressComponent from '#src/components/navigation/BackofficeLinearProgress.component';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getPaymentMethodsConcatenatedString } from '#src/libs/payment/utils';

// --------- GIFTCARD ---------
import type {
  GiftcardTemplate,
  ConsumerGiftcard,
  GiftcardDataAPI,
  WithSender,
  WithReceiver,
} from '#src/libs/giftcard/types';
import ConsumerGiftcardListItem from '#src/libs/giftcard/components/ConsumerGiftcardListItem.component';
import {
  withSender,
  withReceiver,
  getConsumerGiftcardList,
  getGiftcardTemplateDetail,
} from '#src/libs/giftcard/selectors';
import {
  deleteGiftcardTemplateInstance as deleteGiftcardTemplateInstanceAction,
  createGiftcardTemplateInstances as createGiftcardTemplateInstancesAction,
  deleteGiftcardTemplate as deleteGiftcardTemplateAction,
  createOrUpdateGiftcardTemplate as createOrUpdateGiftcardTemplateAction,
  retrieveGiftcardTemplate as retrieveGiftcardTemplateAction,
  fetchConsumerGiftcardList as fetchConsumerGiftcardListAction,
} from '#src/libs/giftcard/actions';
// --------- FRANCHISE ---------
import FranchiseGenericProductTemplateCard from '#src/libs/franchise/components/generic-product/template-card/GenericTemplateCard.component';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';
import {
  getFranchiseCompanies,
  withAllowedFranchisees,
} from '#src/libs/franchise/selectors';
import {
  WithFranchiseCompanies,
  FranchiseCompany,
} from '#src/libs/franchise/types';
import { RootState } from '../../../reducers';
import { OptionCallback } from '../../../state/types';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import withTitle from '../../../hocs/with-title.hoc';
import { WithHandlerType } from '../../../utils/types';
import { openNewWindowToImpersonate } from '#src/utils/windows';
import { GIFTCARD_TYPES } from '#src/libs/giftcard/constants';

type OwnProps = {
  giftcardTemplateId: number;
  giftcardTemplate: WithFranchiseCompanies<GiftcardTemplate>;
  consumerGiftcardLoading: boolean;
  consumerGiftcardList: Array<WithSender<WithReceiver<ConsumerGiftcard>>>;
  consumerGiftcardCount: number;
  fetchConsumerGiftcardList: (params: any) => void;
};

type HandlersProps = {
  onDeleteGiftcardTemplate: () => void;
  onUpdateGiftcardTemplate: (
    data: GiftcardDataAPI,
    options?: OptionCallback<GiftcardTemplate>,
  ) => void;
  onCreateGiftcardTemplateInstances: (companyIds: number[]) => void;
  onDeleteGiftcardTemplateInstanceByCompanyId: (companyId: number) => void;
  fetchConsumerGiftcardList: (page: number, page_size: number) => void;
};

type StateHandlersProps = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  HandlersProps &
  StateHandlersProps &
  WithStyles &
  WithTranslation;

const PAGE_SIZE = 15;

export class GiftcardDetailPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchFranchise();
    this.props.retrieveGiftcardTemplate(this.props.giftcardTemplateId);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.giftcardTemplateId !== prevProps.giftcardTemplateId) {
      this.props.retrieveGiftcardTemplate(this.props.giftcardTemplateId);
    }
  }

  getGiftcardTemplateCardProps = (): {
    headerLeftPrimary: string;
    headerRightPrimary: string;
    headerRightSecondary: string;
    categories: any;
    description: string;
    deleteTemplateContent: string;
    deleteTemplateInstanceContents: string[];
    companiesInTemplate: FranchiseCompany[];
  } => {
    const t = this.props.t;
    const { description, price, card_type, companies, name } =
      this.props.giftcardTemplate;

    const categories = {
      validity: t('giftcardTemplate.template.validityDetail', {
        count: this.props.giftcardTemplate.expiration_days,
        ns: 'giftcard',
      }),
      paymentMethods: getPaymentMethodsConcatenatedString(
        this.props.giftcardTemplate?.available_payment_method_identifiers,
        t,
      ),
    };

    const { displayedPrice, displayedTaxFreePrice } =
      card_type === GIFTCARD_TYPES.CUSTOM || !price
        ? {
            displayedPrice: t('giftcardFreeAmount.customAmount', {
              ns: 'b2b_giftcard',
            }),
            displayedTaxFreePrice: '',
          }
        : {
            displayedPrice: getCurrencyDisplayWithPrice(price),
            displayedTaxFreePrice: `${getCurrencyDisplayWithPrice(price)} ${t(
              'giftcardTemplate.template.withoutTax',
              { ns: 'giftcard' },
            )}`,
          };

    return {
      headerLeftPrimary: name,
      headerRightPrimary: displayedPrice,
      headerRightSecondary: displayedTaxFreePrice,
      categories,
      description,
      deleteTemplateContent: t(
        'giftcardTemplate.template.deleteTemplateContent',
        { ns: 'giftcard' },
      ),
      companiesInTemplate: companies,
      deleteTemplateInstanceContents: [
        t('giftcardTemplate.template.deleteInstanceContent1', {
          ns: 'giftcard',
        }),
        t('giftcardTemplate.template.deleteInstanceContent2', {
          ns: 'giftcard',
        }),
      ],
    };
  };

  goToMemberGiftcard = (
    companyId: number,
    memberId: number,
    consumerGiftcardId: number,
  ) => {
    openNewWindowToImpersonate(
      companyId,
      `/member/${memberId}/giftcard/${consumerGiftcardId}`,
    );
  };

  render() {
    const { classes, t } = this.props;
    if (!this.props.giftcardTemplate) {
      return <BackofficeLinearProgressComponent />;
    }
    const { cover, name } = this.props.giftcardTemplate;
    return (
      <Grid container spacing={2}>
        <Grid item md={6} sm={12}>
          {cover && <img alt={name} className={classes.cover} src={cover} />}
          <FranchiseGenericProductTemplateCard
            onCreateTemplateInstances={
              this.props.onCreateGiftcardTemplateInstances
            }
            onDeleteTemplate={this.props.onDeleteGiftcardTemplate}
            onDeleteTemplateInstance={
              this.props.onDeleteGiftcardTemplateInstanceByCompanyId
            }
            onUpdateTemplate={this.props.onOpenTemplateForm}
            templateId={
              this.props.giftcardTemplate?.id || this.props.giftcardTemplateId
            }
            {...this.getGiftcardTemplateCardProps()}
            // @ts-expect-error
            allCompanies={this.props.allFranchisedCompanies}
          />
        </Grid>
        <Grid item md={6} sm={12} style={{ width: '100%' }}>
          <Paper>
            <PaginatedListBase
              itemPerPage={PAGE_SIZE}
              items={this.props.consumerGiftcardList}
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              loading={this.props.consumerGiftcardLoading}
              nbItems={this.props.consumerGiftcardCount}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerGiftcardList(page, pageSize)
              }
              page={this.props.consumerGiftcardPage}
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography color="textSecondary" variant="caption">
                    {t('giftcard:consumerGiftcard.isEmpty', { ns: 'giftcard' })}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(cgc: WithSender<WithReceiver<ConsumerGiftcard>>) => (
                <ConsumerGiftcardListItem
                  key={cgc.id}
                  disableItemIfNoMember
                  divider
                  showReceiver
                  showSender
                  consumerGiftcard={cgc}
                  giftcard={this.props.giftcardTemplate}
                  memberReceiver={cgc.dst_member}
                  memberSender={cgc.src_member}
                  onClickReceiver={
                    cgc.dst_member &&
                    ((consumerGiftcardId: number, memberId: number) =>
                      this.goToMemberGiftcard(
                        cgc.giftcard_company,
                        memberId,
                        consumerGiftcardId,
                      ))
                  }
                  onClickSender={(
                    consumerGiftcardId: number,
                    memberId: number,
                  ) =>
                    this.goToMemberGiftcard(
                      cgc.giftcard_company,
                      memberId,
                      consumerGiftcardId,
                    )
                  }
                />
              )}
            />
          </Paper>
        </Grid>
        <GiftcardFormDrawer
          initial={this.props.giftcardTemplate}
          onClose={this.props.onCloseTemplateForm}
          onSubmit={this.props.onUpdateGiftcardTemplate}
          open={!!this.props.openTemplateForm}
        />
      </Grid>
    );
  }
}

const connector = connect(
  (
    state: RootState,
    { giftcardTemplateId }: { giftcardTemplateId: number },
  ) => ({
    consumerGiftcardCount: state.giftcard.consumerGiftcard.count,
    consumerGiftcardLoading: state.giftcard.consumerGiftcard.loading,
    consumerGiftcardPage: state.giftcard.consumerGiftcard.page,
    consumerGiftcardList: withSender(withReceiver(getConsumerGiftcardList))(
      state,
    ),
    giftcardTemplate: withAllowedFranchisees(getGiftcardTemplateDetail)(
      state,
      // @ts-expect-error
      giftcardTemplateId,
    ),
    allFranchisedCompanies: getFranchiseCompanies(state),
  }),
  {
    fetchMemberBulkById: fetchMemberBulkByIdAction,
    fetchConsumerGiftcardList: fetchConsumerGiftcardListAction,
    fetchFranchise: fetchFranchiseAction,
    goToGiftcardTemplateList: () => push('/f/giftcard-template'),
    deleteGiftcardTemplateInstance: deleteGiftcardTemplateInstanceAction,
    createGiftcardTemplateInstances: createGiftcardTemplateInstancesAction,
    deleteGiftcardTemplate: deleteGiftcardTemplateAction,
    createOrUpdateGiftcardTemplate: createOrUpdateGiftcardTemplateAction,
    retrieveGiftcardTemplate: retrieveGiftcardTemplateAction,
  },
);

const styles = (theme: Theme) =>
  createStyles({
    cover: {
      width: '100%',
      maxHeight: 300,
      borderRadius: theme.spacing(1.5),
      objectFit: 'cover',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', // same settings as in GiftcardCardDetail
    },
    emptyContainer: {
      padding: theme.spacing(2),
    },
  });

const withStateHandlersInit: {
  openTemplateForm: boolean;
} = {
  openTemplateForm: false,
};

const withStateHandlersSetter = {
  onOpenTemplateForm: () => () => ({ openTemplateForm: true }),
  onCloseTemplateForm: () => () => ({ openTemplateForm: false }),
};

export default compose(
  withTranslation(['giftcard', 'b2b_giftcard', 'payment']),
  routerParamsToProps({ giftcardTemplateId: 'giftcardTemplateId:number' }),
  connector,
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers({
    onDeleteGiftcardTemplate:
      ({
        deleteGiftcardTemplate,
        goToGiftcardTemplateList,
        giftcardTemplateId,
      }) =>
      () => {
        deleteGiftcardTemplate(giftcardTemplateId, {
          onSuccess: goToGiftcardTemplateList,
        });
      },
    onUpdateGiftcardTemplate:
      ({
        onCloseTemplateForm,
        createOrUpdateGiftcardTemplate,
        giftcardTemplateId,
      }) =>
      (data: GiftcardDataAPI, options: OptionCallback<GiftcardTemplate>) => {
        createOrUpdateGiftcardTemplate(giftcardTemplateId, data, {
          onSuccess: () => {
            onCloseTemplateForm();
            options?.onSuccess();
          },
          onError: options?.onError,
        });
      },
    onCreateGiftcardTemplateInstances:
      ({ createGiftcardTemplateInstances, giftcardTemplateId }) =>
      (companyIds: number[]) => {
        createGiftcardTemplateInstances({
          giftcard_template: giftcardTemplateId,
          companies: companyIds,
        });
      },
    onDeleteGiftcardTemplateInstanceByCompanyId:
      ({ giftcardTemplateId, deleteGiftcardTemplateInstance }) =>
      (companyId: number) => {
        deleteGiftcardTemplateInstance(giftcardTemplateId, companyId);
      },
    fetchConsumerGiftcardList:
      ({
        fetchConsumerGiftcardList,
        giftcardTemplateId,
        fetchMemberBulkById,
      }) =>
      (page: number, page_size: number) => {
        fetchConsumerGiftcardList(
          { page, page_size, giftcard_template: giftcardTemplateId },
          {
            onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
              fetchMemberBulkById(
                uniq([
                  ...consumerGiftcardList.map((cg) => cg.src_member),
                  ...consumerGiftcardList.map((cg) => cg.dst_member),
                ]),
              );
            },
          },
        );
      },
  }),
  withTitle(({ giftcardTemplate }: { giftcardTemplate: GiftcardTemplate }) =>
    giftcardTemplate ? giftcardTemplate.name : '',
  ),
  withStyles(styles),
)(GiftcardDetailPage);
