import React from 'react';
import type { WithT } from 'i18next';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import flatten from 'lodash/flatten';

// MUI
import {
  withStyles,
  WithStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// GLOBAL
import withTitle from '#src/hocs/with-title.hoc';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import themeSelector from '#src/libs/theme/selectors';
import type { RootState } from '#src/reducers';
import type {
  OptionBackgroundCallback,
  OptionCallback,
  ReworkedPaginationResponse,
} from '#src/state/types';

// UPSELL
import { getCompanyFeatureList } from '#src/libs/company/selectors';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { UPSELL_IDENTIFIER_WELLHUB } from '#src/libs/platform-billing/upsell-identifiers';
import type { FeatureList } from '#src/libs/company/types';

// CLASSPASS
import type {
  PartnershipCompany,
  PartnershipEstablishmentMerge,
} from '#src/libs/partnership/types';
import {
  getMergedEstablishmentsWithAssociation,
  getPartnershipByIdentifier,
  getPartnershipEstablishmentMergeList,
} from '#src/libs/partnership/selectors';
import {
  fetchPartnershipList,
  requestPartnership as requestPartnershipAction,
  updatePartnership,
  fetchPartnershipEstablishmentMergeList,
} from '#src/libs/partnership/actions';
import PartnershipConfigurationForm from '#src/libs/partnership/components/PartnershipConfigurationForm.component';

import {
  getAllPageEstablishments,
  getAllAssociatedEstablishment,
} from '#src/libs/establishment/selectors';
import {
  fetchEstablishments,
  fetchAssociatedEstablishments,
} from '#src/libs/establishment/actions';
import type {
  Establishment,
  AssociatedEstablishment,
} from '#src/libs/establishment/types';
import {
  APPOINTMENT_VENUE_ID_PREFIX,
  CLASSPASS_INTEGRATION_IDENTIFIER,
} from '#src/libs/partnership/constants';

// Wellhub
import WellhubConfiguration from '#src/libs/wellhub/components/WellhubConfiguration';
import WellhubProductSelectionDrawer from '#src/libs/wellhub/components/WellhubProductSelectionDrawer';

import {
  configureWellhubGymWebhooks as configureWellhubGymWebhooksAction,
  createWellhubGym as createWellhubGymAction,
  deleteWellhubGym as deleteWellhubGymAction,
  fetchOffersMissingWellhubProduct as fetchOffersMissingWellhubProductAction,
  fetchWellhubGyms as fetchWellhubGymsAction,
  getGymAvailability as getGymAvailabilityAction,
  updateWellhubGym as updateWellhubGymAction,
} from '#src/libs/wellhub/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachListAction } from '#src/libs/associated-coach/actions';
import {
  editOffers as editOffersAction,
  fetchSimilarOffers as fetchSimilarOffersAction,
} from '#src/libs/offer/actions';

import { GymAvailabilityReasonCode } from '#src/libs/wellhub/constants';

import { getActiveCoaches } from '#src/libs/associated-coach/selectors';
import {
  getSimilars as getSimilarsOffers,
  withCoach,
  withEstablishment,
} from '#src/libs/offer/selectors';
import {
  getOffersMissingWellhubProductLoading,
  getOffersMissingWellhubProductPaginatedData,
  getWellhubGymAvailability,
  getWellhubGymAvailabilityError,
  getWellhubGymAvailabilityLoading,
  getWellhubGyms,
  getWellhubLoading,
} from '#src/libs/wellhub/selectors';

import type { Coach } from '#src/libs/associated-coach/types';
import type { Offer, OfferEdit, OfferSaas } from '#src/libs/offer/types';
import type { PaginationFilterParams } from '#src/libs/types';
import type {
  GymAvailabilityResponse,
  WellhubGym,
  WellhubGymUpsert,
} from '#src/libs/wellhub/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';

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
  // eslint-disable-next-line react/no-unused-prop-types
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
  wellhubGymAvailabilityError: Error | null;
  wellhubGymAvailabilityLoading: boolean;
  wellhubGyms: WellhubGym[];
  wellhubLoading: boolean;
  getWellhubGymAvailability: (gymID: number) => GymAvailabilityResponse;

  // eslint-disable-next-line react/no-unused-prop-types
  configureWellhubGymWebhooks: (
    wellhubGymUUID: string,
    options?: OptionCallback<WellhubGym>,
  ) => Promise<void>;
  // eslint-disable-next-line react/no-unused-prop-types
  createWellhubGymAction: (
    gymID: number,
    establishmentIDs: number[],
    options?: OptionCallback<WellhubGymUpsert>,
  ) => Promise<void>;
  // eslint-disable-next-line react/no-unused-prop-types
  updateWellhubGymAction: (
    wellhubGymUUID: string,
    wellhubGymID: number,
    establishmentIDs: number[],
    options?: OptionCallback<WellhubGymUpsert>,
  ) => void;

  checkAvailability: (gymID: number) => void;
  deleteWellhubGym: (wellhubGymUUID: string, options?: OptionCallback) => void;
  editOffers: (
    offerId: number,
    offer: Partial<OfferEdit>,
    options?: OptionBackgroundCallback,
  ) => void;
  fetchAssociatedCoachList: () => void;
  fetchOffersMissingWellhubProduct: (params: PaginationFilterParams) => void;
  fetchSimilarOffers: (offerId: number) => void;
  fetchWellhubGyms: () => void;
  mergedEstablishmentWithAssociation: {
    venueId: number;
    referenceEstablishment: string;
    associatedEstablishments: string[];
  }[];
};

type HandlerProps = {
  requestClasspassPartnership: () => void;
  createWellhubGym: (gymID: number, establishmentIDs: number[]) => void;
  updateWellhubGym: (
    wellhubGym: WellhubGym,
    establishmentIDs: number[],
  ) => void;
};

type Props = StateProps & ConnectorProps & HandlerProps & WithT & WithStyles;

export class Partnership extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPartnershipList();
    this.props.fetchPartnershipEstablishmentMergeList();
    this.props.fetchEstablishments();
    this.props.fetchAssociatedEstablishments({ company: this.props.company });
    // Wellhub
    if (hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_WELLHUB)) {
      this.props.fetchWellhubGyms();
      this.props.fetchOffersMissingWellhubProduct({});
      this.props.fetchAssociatedCoachList();
    }
  }

  updatePartnership = (data: PartnershipCompany) => {
    !!this.props.classpass.id &&
      this.props.updatePartnership(this.props.classpass.id, data, {
        onSuccess: () => {
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

  onEditOffer = (data: { offerId: number; data: Partial<OfferEdit> }) => {
    this.props.editOffers(data.offerId, data.data, {
      onBackgroundSuccess: () => {
        this.props.fetchOffersMissingWellhubProduct({});
      },
    });
  };

  getAppointmentsVenueEstablishmentList = () => {
    if (!this.props.establishmentList) return [];
    return this.props.establishmentList.map((establishment) => ({
      venueId: `${APPOINTMENT_VENUE_ID_PREFIX}${establishment.associatedestablishment_set[0]}`,
      establishmentNames: [establishment.title],
    }));
  };

  getActivitiesVenueEstablishmentList = () => {
    if (!this.props.establishmentList) return [];
    if (this.props.classpass?.override_establishment_pk) {
      return [
        {
          venueId: this.props.classpass.override_establishment_pk,
          establishmentNames: this.props.establishmentList.map(
            (establishment) => establishment.title,
          ),
        },
      ];
    }

    if (this.props.mergedEstablishmentWithAssociation) {
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
    return this.props.establishmentList.map((establishment) => ({
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

  render() {
    const { classpass, company, establishmentList } = this.props;
    let establishmentIdList: number[] = [];
    if (establishmentList && establishmentList.length) {
      if (classpass && classpass.associated_establishment_ids.length) {
        establishmentIdList = classpass.associated_establishment_ids;
      } else {
        establishmentIdList = flatten(
          establishmentList.map((e) => e.associatedestablishment_set),
        );
      }
    }

    let venueIds = establishmentIdList.join(', ');

    if (this.props.partnershipEstablishmentMergeList?.length) {
      venueIds = this.props.partnershipEstablishmentMergeList
        .map((pem) => pem.reference_establishment)
        .join(', ');
    }
    if (this.props.classpass?.override_establishment_pk) {
      venueIds = `${this.props.classpass?.override_establishment_pk}`;
    }

    const hasWellhubUpsell = hasUpsell(
      this.props.featureList,
      UPSELL_IDENTIFIER_WELLHUB,
    );

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
        {hasWellhubUpsell && (
          <WellhubConfiguration
            checkAvailability={this.props.checkAvailability}
            createWellhubGym={this.props.createWellhubGym}
            deleteWellhubGym={this.props.deleteWellhubGym}
            establishments={this.props.establishmentList}
            getWellhubGymAvailability={this.props.getWellhubGymAvailability}
            offersMissingWellhubProductCount={
              this.props.offersMissingWellhubProductPaginatedData.total_count
            }
            openWellhubProductSelectionDrawer={
              this.openWellhubProductSelectionDrawer
            }
            updateWellhubGym={this.props.updateWellhubGym}
            wellhubGymAvailabilityError={this.props.wellhubGymAvailabilityError}
            wellhubGymAvailabilityLoading={
              this.props.wellhubGymAvailabilityLoading
            }
            wellhubGyms={this.props.wellhubGyms}
            wellhubLoading={this.props.wellhubLoading}
          />
        )}
        {hasWellhubUpsell && (
          <WellhubProductSelectionDrawer
            availableEstablishments={this.props.establishmentList}
            coaches={this.props.coaches}
            fetchMissingProductOffersSpecificPage={
              this.fetchMissingProductOffersSpecificPage
            }
            fetchSimilarOffers={this.props.fetchSimilarOffers}
            isLoading={this.props.offersMissingWellhubProductLoading}
            isOpen={this.props.isWellhubProductSelectionDrawerOpen}
            offersData={this.props.offersMissingWellhubProductPaginatedData}
            onClose={this.closeWellhubProductSelectionDrawer}
            onConfirm={this.onEditOffer}
            similarOffers={this.props.similarOffersWithCoachAndEstablishment}
            similarOffersLoading={this.props.similarOfferLoading}
          />
        )}
        <div className={this.props.classes.classpassContainer}>
          <div
            style={{ display: 'flex', alignItems: 'row', flexDirection: 'row' }}
          ></div>
          <Paper className={this.props.classes.paper}>
            {this.props.loading || this.props.establishmentList.length === 0 ? (
              <CircularProgress />
            ) : (
              <div className={this.props.classes.column}>
                <Typography variant="h6">
                  {this.props.t('parameters.partnerId', { company })}
                </Typography>
                <Typography variant="h6">
                  {this.props.t('parameters.venueIds', {
                    establishmentIdList: venueIds,
                  })}
                </Typography>
                <Button
                  className={this.props.classes.requestButton}
                  color="primary"
                  onClick={this.openPartnershipConfigurationForm}
                  variant="outlined"
                >
                  {this.props.t('parameters.editButton')}
                </Button>
                <GenericResponsiveDrawer
                  onClose={this.closePartnershipConfigurationForm}
                  open={
                    !!this.props.classpass &&
                    this.props.isPartnershipConfigurationFormOpen
                  }
                  title={this.props.t('parameters.drawerTitle')}
                >
                  <PartnershipConfigurationForm
                    associatedEstablishmentList={
                      this.props.associatedEstablishmentList
                    }
                    establishmentList={this.props.establishmentList}
                    initial={this.props.classpass}
                    // @ts-expect-error
                    iSubmitting={this.props.isSubmitting}
                    onSubmit={this.updatePartnership}
                    partnershipEstablishmentMergeList={
                      this.props.partnershipEstablishmentMergeList
                    }
                  />
                </GenericResponsiveDrawer>
                {!this.props.classpass && (
                  <Button
                    className={this.props.classes.requestButton}
                    color="primary"
                    onClick={this.props.requestClasspassPartnership}
                    variant="outlined"
                  >
                    {this.props.t('actions.requestPartnership')}
                  </Button>
                )}
              </div>
            )}
          </Paper>
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

const mapWithHandlers = {
  requestClasspassPartnership: (props: ConnectorProps & StateProps) => () => {
    props.requestPartnership(CLASSPASS_INTEGRATION_IDENTIFIER, {
      onSuccess: () => props.setHasRequested(true),
    });
  },
  createWellhubGym:
    (props: ConnectorProps & StateProps) =>
    (gymID: number, establishmentIDs: number[]) => {
      const wellhubGymAvailability = props.getWellhubGymAvailability(gymID);
      if (wellhubGymAvailability.is_available) {
        if (
          wellhubGymAvailability.reason_code ===
            GymAvailabilityReasonCode.DISABLED_GYM_EXISTS &&
          !!wellhubGymAvailability.wellhub_gym_uuid
        ) {
          props.updateWellhubGymAction(
            wellhubGymAvailability.wellhub_gym_uuid,
            gymID,
            establishmentIDs,
            {
              onSuccess: (wellhubGymUpdated) => {
                props.configureWellhubGymWebhooks(wellhubGymUpdated.uuid, {
                  onSuccess: () => {
                    props.fetchWellhubGyms();
                    props.fetchOffersMissingWellhubProduct({});
                  },
                  onError: () => {
                    props.fetchWellhubGyms();
                    props.fetchOffersMissingWellhubProduct({});
                  },
                });
              },
            },
          );
        } else {
          props.createWellhubGymAction(gymID, establishmentIDs, {
            onSuccess: (wellhubGymCreated) => {
              props.configureWellhubGymWebhooks(wellhubGymCreated.uuid, {
                onSuccess: () => {
                  props.fetchWellhubGyms();
                  props.fetchOffersMissingWellhubProduct({});
                },
                onError: () => {
                  props.fetchWellhubGyms();
                  props.fetchOffersMissingWellhubProduct({});
                },
              });
            },
          });
        }
      }
    },
  updateWellhubGym:
    (props: ConnectorProps & StateProps) =>
    (wellhubGym: WellhubGym, establishmentIDs: number[]) => {
      props.updateWellhubGymAction(
        wellhubGym.uuid,
        wellhubGym.gym_id,
        establishmentIDs,
        {
          onSuccess: () => {
            props.fetchWellhubGyms();
            props.fetchOffersMissingWellhubProduct({});
          },
        },
      );
    },
};

export default compose(
  withTranslation(['partnership']),
  withTitle(({ t }) => t('pageTitle')),
  withStyles(styles),
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
      similarOffersWithCoachAndEstablishment: withEstablishment(
        withCoach(getSimilarsOffers),
      )(state),
      wellhubGymAvailabilityError: getWellhubGymAvailabilityError(state),
      wellhubGymAvailabilityLoading: getWellhubGymAvailabilityLoading(state),
      wellhubGyms: getWellhubGyms(state),
      wellhubLoading: getWellhubLoading(state),
      getWellhubGymAvailability: (gymID: number) =>
        getWellhubGymAvailability(state, gymID),
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
      checkAvailability: getGymAvailabilityAction,
      configureWellhubGymWebhooks: configureWellhubGymWebhooksAction,
      createWellhubGymAction,
      deleteWellhubGym: deleteWellhubGymAction,
      editOffers: editOffersAction,
      fetchAssociatedCoachList: fetchAssociatedCoachListAction,
      fetchOffersMissingWellhubProduct: fetchOffersMissingWellhubProductAction,
      fetchSimilarOffers: fetchSimilarOffersAction,
      fetchWellhubGyms: fetchWellhubGymsAction,
      updateWellhubGymAction,
    },
  ),
  withHandlers(mapWithHandlers),
)(Partnership);
