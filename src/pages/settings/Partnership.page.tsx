import React from 'react';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
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

// UPSELL
import { getCompanyUpsellData } from '#src/libs/company/selectors';
import { hasUpsellIdentifier } from '#src/libs/role/utils';
import { UPSELL_IDENTIFIER_WELLHUB } from '#src/libs/platform-billing/upsell-identifiers';
import type { UpsellSumup } from '#src/libs/company/types';

// CLASSPASS
import type {
  PartnershipCompany,
  PartnershipEstablishmentMerge,
} from '#src/libs/partnership/types';
import {
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

import CLASSPASS_LOGO from './classpass.png';

// WELLHUB
import WellhubConfigurationPanel from '#src/libs/wellhub/components/WellhubConfigurationPanel';

type Props = {
  associatedEstablishmentList: AssociatedEstablishment[];
  classpass: PartnershipCompany | null;
  company: number;
  establishmentList: Establishment[];
  featureList: UpsellSumup[];
  hasRequested: boolean;
  isSubmitting: boolean;
  loading: boolean;
  partnershipEstablishmentMergeList: PartnershipEstablishmentMerge[];

  fetchEstablishments: () => void;
  fetchPartnershipEstablishmentMergeList: () => void;
  fetchPartnershipList: () => void;
  requestClasspassPartnership: () => void;
  setHasRequested: (b: boolean) => void;
  updatePartnership: (id: number, data: any) => void;

  t: TFunction;
} & WithStyles;

export class Partnership extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPartnershipList();
    this.props.fetchPartnershipEstablishmentMergeList();
    this.props.fetchEstablishments();
    // @ts-expect-error
    this.props.fetchAssociatedEstablishments({ company: this.props.company });
  }

  updatePartnership = (data: any) => {
    this.props.updatePartnership(this.props.classpass.id, data);
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
    // @ts-expect-error
    if (this.props.classpass?.override_establishment_pk) {
      // @ts-expect-error
      venueIds = `${this.props.classpass?.override_establishment_pk}`;
    }

    const hasWellhubUpsell = hasUpsellIdentifier(
      UPSELL_IDENTIFIER_WELLHUB,
      this.props.featureList,
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
        {hasWellhubUpsell && <WellhubConfigurationPanel />}
        <div className={this.props.classes.classpassContainer}>
          <div
            style={{ display: 'flex', alignItems: 'row', flexDirection: 'row' }}
          >
            <img
              alt="classpass"
              src={CLASSPASS_LOGO}
              style={{ height: 64, width: 64 }}
            />
            <Typography
              className={this.props.classes.paper}
              component="h3"
              variant="h3"
            >
              ClassPass
            </Typography>
          </div>
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
                {this.props.classpass ? (
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
                ) : (
                  <div>
                    <Button
                      className={this.props.classes.requestButton}
                      color="primary"
                      onClick={this.props.requestClasspassPartnership}
                      variant="outlined"
                    >
                      {this.props.t('actions.requestPartnership')}
                    </Button>
                  </div>
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

export default compose(
  withTranslation(['partnership']),
  withTitle(({ t }) => t('pageTitle')),
  withStyles(styles),
  withState('hasRequested', 'setHasRequested', false),
  connect(
    (state: RootState) => ({
      classpass: getPartnershipByIdentifier(state, 'classpass'),
      company: themeSelector.getTheme(state).company,
      establishmentList: getAllPageEstablishments(state),
      associatedEstablishmentList: getAllAssociatedEstablishment(state),
      partnershipEstablishmentMergeList:
        getPartnershipEstablishmentMergeList(state),
      isSubmitting: state.partnership.createOrUpdate.loading,
      loading:
        state.partnership.loading ||
        state.partnership.partnershipEstablishmentMerge.loading ||
        state.establishment.loading ||
        state.establishment.associatedEstablishment.loading,
      featureList: getCompanyUpsellData(state),
    }),
    {
      fetchPartnershipList,
      fetchEstablishments,
      fetchAssociatedEstablishments,
      fetchPartnershipEstablishmentMergeList,
      updatePartnership,
      requestPartnership: requestPartnershipAction,
    },
  ),
  withHandlers({
    requestClasspassPartnership:
      ({ requestPartnership, setHasRequested }) =>
      () => {
        requestPartnership('classpass', {
          onSuccess: () => setHasRequested(true),
        });
      },
  }),
)(Partnership);
