import React from 'react';
import type { WithT } from 'i18next';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';

// MUI
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

// GLOBAL
import withTitle from '#src/hocs/with-title.hoc';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import themeSelector from '#src/libs/theme/selectors';
import type { RootState } from '#src/reducers';
import type {
  OptionCallback,
  ReworkedPaginationResponse,
} from '#src/state/types';

// UPSELL
import { getCompanyFeatureList } from '#src/libs/company/selectors';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_MY_CLUBS,
  UPSELL_IDENTIFIER_WELLHUB,
  UPSELL_IDENTIFIER_WELLPASS,
} from '#src/libs/platform-billing/upsell-identifiers';
import type { FeatureList } from '#src/libs/company/types';

// CLASSPASS
import type {
  PartnershipCompany,
  PartnershipEstablishmentMerge,
} from '#src/libs/classpass/types';
import {
  getMergedEstablishmentsWithAssociation,
  getPartnershipByIdentifier,
  getPartnershipEstablishmentMergeList,
} from '#src/libs/classpass/selectors';
import {
  fetchPartnershipEstablishmentMergeList,
  fetchPartnershipList,
  requestPartnership as requestPartnershipAction,
  updatePartnership,
} from '#src/libs/classpass/actions';
import PartnershipConfigurationForm from '#src/libs/classpass/components/PartnershipConfigurationForm.component';

import {
  getAllAssociatedEstablishment,
  getAllPageEstablishments,
} from '#src/libs/establishment/selectors';
import {
  fetchAssociatedEstablishments,
  fetchEstablishments,
} from '#src/libs/establishment/actions';
import type {
  AssociatedEstablishment,
  Establishment,
} from '#src/libs/establishment/types';
import { CLASSPASS_INTEGRATION_IDENTIFIER } from '#src/libs/classpass/constants';

// Wellhub
import WellhubConfiguration from '#src/libs/wellhub/components/WellhubConfiguration';
import WellhubProductSelectionDrawer from '#src/libs/wellhub/components/WellhubProductSelectionDrawer';

import { fetchOffersMissingWellhubProduct as fetchOffersMissingWellhubProductAction } from '#src/libs/wellhub/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachListAction } from '#src/libs/associated-coach/actions';
import {
  updateWellhubProductId as updateWellhubProductIdAction,
  fetchSimilarOffers as fetchSimilarOffersAction,
} from '#src/libs/offer/actions';

import { getActiveCoaches } from '#src/libs/associated-coach/selectors';
import {
  getSimilars as getSimilarsOffers,
  withCoach,
  withEstablishment,
} from '#src/libs/offer/selectors';
import {
  getOffersMissingWellhubProductLoading,
  getOffersMissingWellhubProductPaginatedData,
} from '#src/libs/wellhub/selectors';

import type { Coach } from '#src/libs/associated-coach/types';
import type {
  Offer,
  OfferSaas,
  UpdateWellhubProductIdPayload,
} from '#src/libs/offer/types';
import type { PaginationFilterParams } from '#src/libs/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import PartnershipConfiguration from '#src/libs/classpass/components/PartnershipConfiguration.component';
import MyClubsConfiguration from '#src/libs/partnership/myclubs/MyClubsConfiguration';
import WellpassConfiguration from '#src/libs/partnership/wellpass/WellpassConfiguration';
import { PartnershipIdentifier } from '#src/libs/partnership/types';
import {
  FeatureFlagProps,
  withFeatureFlags,
} from '#src/utils/feature-flag/withFeatureFlags';

type StateProps = {
  hasRequested: boolean;
  isWellhubProductSelectionDrawerOpen: boolean;
  setHasRequested: (b: boolean) => void;
  setIsWellhubProductSelectionDrawerOpen: (b: boolean) => void;
  isPartnershipConfigurationFormOpen: boolean;
  setIsPartnershipConfigurationFormOpen: (open: boolean) => void;
};

type ConnectorProps = {
  associatedEstablishmentList: AssociatedEstablishment[];
  classpass: PartnershipCompany | null;
  myClubsPartnershipCompany: PartnershipCompany | null;
  wellhubPartnershipCompany: PartnershipCompany | null;
  wellpassPartnershipCompany: PartnershipCompany | null;
  company: number;
  establishmentList: Establishment[];
  featureList: FeatureList;
  isSubmitting: boolean;
  loading: boolean;
  partnershipEstablishmentMergeList: PartnershipEstablishmentMerge[];

  fetchEstablishments: () => void;
  fetchPartnershipEstablishmentMergeList: () => void;
  fetchAssociatedEstablishments: (
    params?: { company: number },
    options?: OptionCallback<AssociatedEstablishment[]>,
  ) => void;
  fetchPartnershipList: () => void;
  requestPartnership: (identifier: string, options: OptionCallback) => void;
  updatePartnership: (
    id: number,
    data: PartnershipCompany,
    options?: OptionCallback,
  ) => void;

  // Wellhub
  coaches: Coach[];
  offersMissingWellhubProductLoading: boolean;
  offersMissingWellhubProductPaginatedData: ReworkedPaginationResponse<OfferSaas>;
  similarOfferLoading: boolean;
  similarOffersWithCoachAndEstablishment: Offer<Coach, Establishment>[];
  updateWellhubProductId: (
    offerId: number,
    payload: UpdateWellhubProductIdPayload,
    options?: OptionCallback,
  ) => void;
  fetchAssociatedCoachList: () => void;
  fetchOffersMissingWellhubProduct: (params: PaginationFilterParams) => void;
  fetchSimilarOffers: (offerId: number) => void;
  mergedEstablishmentWithAssociation: {
    venueId: number;
    referenceEstablishment: string;
    associatedEstablishments: string[];
  }[];
};

type Props = StateProps &
  ConnectorProps &
  WithT &
  WithStyles &
  FeatureFlagProps;

export class Partnership extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPartnershipList();
    this.props.fetchPartnershipEstablishmentMergeList();
    this.props.fetchEstablishments();
    this.props.fetchAssociatedEstablishments({ company: this.props.company });
    // Wellhub
    if (hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_WELLHUB)) {
      this.props.fetchOffersMissingWellhubProduct({});
      this.props.fetchAssociatedCoachList();
    }
  }

  updatePartnership = (data: PartnershipCompany) => {
    this.props.classpass?.id &&
      this.props.updatePartnership(this.props.classpass.id, data, {
        onSuccess: () => {
          this.props.fetchAssociatedEstablishments({
            company: this.props.company,
          });
          this.props.fetchPartnershipEstablishmentMergeList();
          this.closePartnershipConfigurationForm();
        },
      });
  };

  openWellhubProductSelectionDrawer = () =>
    this.props.setIsWellhubProductSelectionDrawerOpen(true);

  closeWellhubProductSelectionDrawer = () =>
    this.props.setIsWellhubProductSelectionDrawerOpen(false);

  fetchMissingProductOffersSpecificPage = (page: number) =>
    this.props.fetchOffersMissingWellhubProduct({ page });

  updateWellhubProductId = (data: {
    offerId: number;
    data: UpdateWellhubProductIdPayload;
  }) => {
    this.props.updateWellhubProductId(data.offerId, data.data, {
      onSuccess: () => {
        this.props.fetchOffersMissingWellhubProduct({});
      },
    });
  };

  getActivitiesVenueEstablishmentList = () => {
    const classpass = this.props.classpass;

    if (!this.props.establishmentList) return [];
    if (classpass?.override_establishment_pk) {
      return [
        {
          venueId: classpass.override_establishment_pk,
          establishmentNames: this.props.establishmentList.map(
            (establishment) => establishment.title,
          ),
        },
      ];
    }

    if (this.props.mergedEstablishmentWithAssociation.length) {
      return this.props.mergedEstablishmentWithAssociation.map(
        (establishmentGroup) => ({
          venueId: establishmentGroup.venueId,
          establishmentNames: [
            establishmentGroup.referenceEstablishment,
            ...establishmentGroup.associatedEstablishments,
          ],
        }),
      );
    }
    const classpassAssociatedEstablishmentIds =
      classpass?.associated_establishment_ids ?? [];

    const filteredEstablishments = classpassAssociatedEstablishmentIds.length
      ? this.props.establishmentList?.filter((establishment) =>
          classpassAssociatedEstablishmentIds.includes(
            establishment.associatedestablishment_set[0],
          ),
        )
      : this.props.establishmentList ?? [];

    return filteredEstablishments.map((establishment) => ({
      venueId: establishment.associatedestablishment_set[0],
      establishmentNames: [establishment.title],
    }));
  };

  openPartnershipConfigurationForm = () => {
    this.props.setIsPartnershipConfigurationFormOpen(true);
  };

  closePartnershipConfigurationForm = () => {
    this.props.setIsPartnershipConfigurationFormOpen(false);
  };

  requestClasspassPartnership = () => {
    this.props.requestPartnership(CLASSPASS_INTEGRATION_IDENTIFIER, {
      onSuccess: () => this.props.setHasRequested(true),
    });
  };

  render() {
    const { classpass, myClubsPartnershipCompany, company, featureList } =
      this.props;

    const hasWellhubUpsell = hasUpsell(featureList, UPSELL_IDENTIFIER_WELLHUB);
    const hasMyClubsUpsell = hasUpsell(featureList, UPSELL_IDENTIFIER_MY_CLUBS);
    const hasWellpassUpsell = hasUpsell(
      featureList,
      UPSELL_IDENTIFIER_WELLPASS,
    );
    const { wellpassPartnershipCompany } = this.props;
    // TODO(BOO-2812): Remove once this is fully launched
    const { isNewWellpassConfigurationEnabled } = this.props;

    return (
      <div className={this.props.classes.container}>
        {this.props.hasRequested ? (
          <Dialog open>
            <DialogContent>
              {this.props.t('requestDialog.explain')}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.props.setHasRequested(false)}>
                {this.props.t('requestDialog.close')}
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
        {this.props.isSubmitting ? <LinearProgress /> : null}
        {hasMyClubsUpsell && !!myClubsPartnershipCompany && (
          <MyClubsConfiguration
            establishments={this.props.establishmentList}
            myClubsPartnershipId={myClubsPartnershipCompany.partnership}
          />
        )}
        {hasWellpassUpsell &&
          !!wellpassPartnershipCompany &&
          isNewWellpassConfigurationEnabled && (
            <WellpassConfiguration
              establishments={this.props.establishmentList}
              wellpassPartnershipId={wellpassPartnershipCompany.partnership}
            />
          )}
        {hasWellhubUpsell && !this.props.loading && (
          <WellhubConfiguration
            establishments={this.props.establishmentList}
            offersMissingWellhubProductCount={
              this.props.offersMissingWellhubProductPaginatedData.total_count
            }
            openWellhubProductSelectionDrawer={
              this.openWellhubProductSelectionDrawer
            }
            wellhubPartnershipId={
              this.props.wellhubPartnershipCompany?.partnership ?? null
            }
          />
        )}
        {hasWellhubUpsell && (
          <WellhubProductSelectionDrawer
            coaches={this.props.coaches}
            fetchMissingProductOffersSpecificPage={
              this.fetchMissingProductOffersSpecificPage
            }
            fetchSimilarOffers={this.props.fetchSimilarOffers}
            isLoading={this.props.offersMissingWellhubProductLoading}
            isOpen={this.props.isWellhubProductSelectionDrawerOpen}
            offersData={this.props.offersMissingWellhubProductPaginatedData}
            onClose={this.closeWellhubProductSelectionDrawer}
            onConfirm={this.updateWellhubProductId}
            similarOffers={this.props.similarOffersWithCoachAndEstablishment}
            similarOffersLoading={this.props.similarOfferLoading}
            wellhubPartnershipId={
              this.props.wellhubPartnershipCompany?.partnership ?? null
            }
          />
        )}
        <div className={this.props.classes.classpassContainer}>
          <PartnershipConfiguration
            activitiesVenueEstablishmentList={this.getActivitiesVenueEstablishmentList()}
            companyId={company}
            isLoading={this.props.loading}
            openPartnershipConfigurationForm={
              this.openPartnershipConfigurationForm
            }
            requestClasspassPartnership={this.requestClasspassPartnership}
            shouldRequestClassPassPartnership={!classpass}
          />
          <GenericResponsiveDrawer
            onClose={this.closePartnershipConfigurationForm}
            open={!!classpass && this.props.isPartnershipConfigurationFormOpen}
            title={this.props.t('parameters.drawerTitle')}
          >
            {classpass && (
              <PartnershipConfigurationForm
                associatedEstablishmentList={
                  this.props.associatedEstablishmentList
                }
                establishmentList={this.props.establishmentList}
                initial={classpass}
                isSubmitting={this.props.isSubmitting}
                onSubmit={this.updatePartnership}
                partnershipEstablishmentMergeList={
                  this.props.partnershipEstablishmentMergeList
                }
              />
            )}
          </GenericResponsiveDrawer>
        </div>
      </div>
    );
  }
}

const styles = createStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    margin: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  requestButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  classpassContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default compose(
  withTranslation(['partnership']),
  withTitle(({ t }) => t('pageTitle')),
  withStyles(styles),
  withFeatureFlags,
  withState('hasRequested', 'setHasRequested', false),
  withState(
    'isWellhubProductSelectionDrawerOpen',
    'setIsWellhubProductSelectionDrawerOpen',
    false,
  ),
  withState(
    'isPartnershipConfigurationFormOpen',
    'setIsPartnershipConfigurationFormOpen',
    false,
  ),

  connect(
    (state: RootState) => ({
      associatedEstablishmentList: getAllAssociatedEstablishment(state),
      classpass: getPartnershipByIdentifier(
        state,
        CLASSPASS_INTEGRATION_IDENTIFIER,
      ),
      myClubsPartnershipCompany: getPartnershipByIdentifier(
        state,
        PartnershipIdentifier.MYCLUBS,
      ),
      wellhubPartnershipCompany: getPartnershipByIdentifier(
        state,
        PartnershipIdentifier.WELLHUB,
      ),
      wellpassPartnershipCompany: getPartnershipByIdentifier(
        state,
        PartnershipIdentifier.WELLPASS,
      ),
      company: themeSelector.getTheme(state).company,
      establishmentList: getAllPageEstablishments(state),
      featureList: getCompanyFeatureList(state),
      isSubmitting: state.partnership.createOrUpdate.loading,
      loading:
        state.partnership.loading ||
        state.partnership.partnershipEstablishmentMerge.loading ||
        state.establishment.loading ||
        state.establishment.associatedEstablishment.loading,
      partnershipEstablishmentMergeList:
        getPartnershipEstablishmentMergeList(state),
      // Wellhub
      coaches: getActiveCoaches(state),
      offersMissingWellhubProductLoading:
        getOffersMissingWellhubProductLoading(state),
      offersMissingWellhubProductPaginatedData:
        getOffersMissingWellhubProductPaginatedData(state),
      similarOfferLoading: state.offer.similarOffers.loading,
      similarOffersWithCoachAndEstablishment: (withEstablishment as any)(
        withCoach(getSimilarsOffers),
      )(state) as Offer<Coach, Establishment>[],
      mergedEstablishmentWithAssociation:
        getMergedEstablishmentsWithAssociation(state),
    }),
    {
      fetchAssociatedEstablishments,
      fetchEstablishments,
      fetchPartnershipEstablishmentMergeList,
      fetchPartnershipList,
      requestPartnership: requestPartnershipAction,
      updatePartnership,
      // Wellhub
      updateWellhubProductId: updateWellhubProductIdAction,
      fetchAssociatedCoachList: fetchAssociatedCoachListAction,
      fetchOffersMissingWellhubProduct: fetchOffersMissingWellhubProductAction,
      fetchSimilarOffers: fetchSimilarOffersAction,
    },
  ),
)(Partnership as any);
