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
import { WithHandlerType } from '../../../utils/types';
import GiftcardFormDrawer from '#libs/giftcard/components/GiftcardFormDrawer.component';
import withTitle from '../../../hocs/with-title.hoc';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#libs/member/actions';
import PaginatedListBase from '#components/PaginatedListBase.component';
import { OptionCallback } from '../../../state/types';

import BackofficeLinearProgressComponent from '#components/navigation/BackofficeLinearProgress.component';
import { RootState } from '../../../reducers';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { getPaymentMethodsConcatenatedString } from '#libs/payment/utils';

// --------- GIFTCARD ---------
import {
  GiftcardTemplate,
  ConsumerGiftcard,
  GiftcardDataAPI,
  WithSender,
  WithReceiver,
} from '#libs/giftcard/types';
import ConsumerGiftcardListItem from '#libs/giftcard/components/ConsumerGiftcardListItem.component';
import {
  withSender,
  withReceiver,
  getConsumerGiftcardList,
  getGiftcardTemplateDetail,
} from '#libs/giftcard/selectors';
import {
  deleteGiftcardTemplateInstance as deleteGiftcardTemplateInstanceAction,
  createGiftcardTemplateInstances as createGiftcardTemplateInstancesAction,
  deleteGiftcardTemplate as deleteGiftcardTemplateAction,
  createOrUpdateGiftcardTemplate as createOrUpdateGiftcardTemplateAction,
  retrieveGiftcardTemplate as retrieveGiftcardTemplateAction,
  fetchConsumerGiftcardList as fetchConsumerGiftcardListAction,
} from '#libs/giftcard/actions';
// --------- FRANCHISE ---------
import FranchiseGenericProductTemplateCard from '#libs/franchise/components/generic-product/template-card/GenericTemplateCard.component';
import { fetchFranchise as fetchFranchiseAction } from '#libs/franchise/actions';
import {
  getFranchiseCompanies,
  withAllowedFranchisees,
} from '#libs/franchise/selectors';
import {
  WithFranchiseCompanies,
  FranchiseCompany,
} from '#libs/franchise/types';
import { navigateAsCompanyAdmin } from '../../../actions/auth.actions';

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
    const { description, price, companies, name } = this.props.giftcardTemplate;

    const categories = {
      validity: this.props.t('giftcardTemplate.template.validityDetail', {
        count: this.props.giftcardTemplate.expiration_days,
      }),
      paymentMethods: getPaymentMethodsConcatenatedString(
        this.props.giftcardTemplate?.available_payment_method_identifiers,
        this.props.t,
      ),
    };

    return {
      headerLeftPrimary: name,
      headerRightPrimary: getCurrencyDisplayWithPrice(price),
      headerRightSecondary: `${getCurrencyDisplayWithPrice(
        price,
      )} ${this.props.t('giftcardTemplate.template.withoutTax')}`,
      categories,
      description,
      deleteTemplateContent: this.props.t(
        'giftcardTemplate.template.deleteTemplateContent',
      ),
      companiesInTemplate: companies,
      deleteTemplateInstanceContents: [
        this.props.t('giftcardTemplate.template.deleteInstanceContent1'),
        this.props.t('giftcardTemplate.template.deleteInstanceContent2'),
      ],
    };
  };

  render() {
    const { classes, t } = this.props;
    if (!this.props.giftcardTemplate) {
      return <BackofficeLinearProgressComponent />;
    }
    const { cover, name } = this.props.giftcardTemplate;
    return (
      <Grid container spacing={2}>
        <Grid item sm={12} md={6}>
          {cover && <img alt={name} className={classes.cover} src={cover} />}
          <FranchiseGenericProductTemplateCard
            onDeleteTemplate={this.props.onDeleteGiftcardTemplate}
            onCreateTemplateInstances={
              this.props.onCreateGiftcardTemplateInstances
            }
            onDeleteTemplateInstance={
              this.props.onDeleteGiftcardTemplateInstanceByCompanyId
            }
            onUpdateTemplate={this.props.onOpenTemplateForm}
            templateId={
              this.props.giftcardTemplate?.id || this.props.giftcardTemplateId
            }
            {...this.getGiftcardTemplateCardProps()}
            allCompanies={this.props.allFranchisedCompanies}
          />
        </Grid>
        <Grid item sm={12} md={6} style={{ width: '100%' }}>
          <Paper>
            <PaginatedListBase
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              items={this.props.consumerGiftcardList}
              nbItems={this.props.consumerGiftcardCount}
              loading={this.props.consumerGiftcardLoading}
              page={this.props.consumerGiftcardPage}
              itemPerPage={PAGE_SIZE}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerGiftcardList(page, pageSize)
              }
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography variant="caption" color="textSecondary">
                    {t('giftcard:consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(cgc: WithSender<WithReceiver<ConsumerGiftcard>>) => (
                <ConsumerGiftcardListItem
                  key={cgc.id}
                  consumerGiftcard={cgc}
                  memberSender={cgc.src_member}
                  memberReceiver={cgc.dst_member}
                  giftcard={this.props.giftcardTemplate}
                  showSender
                  showReceiver
                  onClickSender={(
                    consumerGiftcardId: number,
                    memberId: number,
                  ) =>
                    this.props.goToMemberGiftcard(
                      cgc.giftcard_company,
                      consumerGiftcardId,
                      memberId,
                    )
                  }
                  divider
                  onClickReceiver={
                    cgc.dst_member &&
                    ((consumerGiftcardId: number, memberId: number) =>
                      this.props.goToMemberGiftcard(
                        cgc.giftcard_company,
                        consumerGiftcardId,
                        memberId,
                      ))
                  }
                  disableItemIfNoMember
                />
              )}
            />
          </Paper>
        </Grid>
        <GiftcardFormDrawer
          open={!!this.props.openTemplateForm}
          onSubmit={this.props.onUpdateGiftcardTemplate}
          onClose={this.props.onCloseTemplateForm}
          initial={this.props.giftcardTemplate}
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
      giftcardTemplateId,
    ),
    allFranchisedCompanies: getFranchiseCompanies(state),
  }),
  {
    fetchMemberBulkById: fetchMemberBulkByIdAction,
    goToMemberGiftcard: (
      companyId: number,
      consumerGiftcardId: number,
      memberId: number,
    ) =>
      navigateAsCompanyAdmin(
        companyId,
        `/member/${memberId}/giftcard/${consumerGiftcardId}`,
      ),
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
  withTranslation(['giftcard', 'payment']),
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
