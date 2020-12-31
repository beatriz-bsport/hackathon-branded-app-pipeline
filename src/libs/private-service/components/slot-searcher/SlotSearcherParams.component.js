// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { RESOURCE_ATTRIBUTION_CONSUMER } from '@bsport/common/lib/master-data/resource-attribution-methods';
import PrivateServiceSelectorWithSlot from '../service/PrivateServiceSelectorWithSlot.component';
import CoachSelector from '../../../associated-coach/components/CoachSelector.component';
import EstablishmentSelector from '../../../establishment/components/EstablishmentSelector.component';
import type { PrivateService } from '../../types';

type Props = {
  private_services: Array<PrivateService>,
  classes: Object,
  t: TFunction,
  private_service: number,
  private_slot: number,
  coach?: any,
  establishment?: any,
  onConfigurationChange: ({
    private_service: number,
    private_slot: number,
    coaches: Array<number>,
    establishment: number,
    coach?: number,
  }) => void,
  coachUnique?: boolean,
  asManager?: boolean,
};

type State = {
  private_service: ?PrivateService,
  privateSlotId: ?number,
  privateServiceId: ?number,
  coaches_selected: Array<number>,
  establishment_selected: number,
};

export class PrivateServiceBooker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.private_service && props.private_slot) {
      const private_service = props.private_services.find(
        (ps) => ps.id === props.private_service,
      );
      this.state = {
        private_service,
        privateSlotId: props.private_slot,
        privateServiceId: props.private_service,
        coaches_selected: props.coach ? [props.coach] : [],
        establishment_selected: props.establishment || null,
      };
    } else {
      this.state = {
        private_service: null,
        privateSlotId: null,
        privateServiceId: null,
        coaches_selected: [],
        establishment_selected: null,
      };
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.privateServiceId !== this.state.privateServiceId ||
      prevState.coaches_selected !== this.state.coaches_selected ||
      prevState.establishment_selected !== this.state.establishment_selected
    ) {
      this.handleConfigurationChange();
    }
  }

  handleCoachChange = (coaches_selected: Array<Option>) => {
    let coach_ids =
      coaches_selected && coaches_selected.length
        ? coaches_selected.map((o) => o.value)
        : [];

    const { coachResourceState } = this.getResourceState();
    if (coachResourceState.choices.length === 1) {
      coach_ids = [coachResourceState.choices[0].id];
    }
    this.setState({
      coaches_selected:
        coach_ids.length && this.props.coachUnique ? [coach_ids[0]] : coach_ids,
    });
  };

  handleEstablishmentChange = (establishments_selected: Array<Option>) => {
    const { private_service } = this.state;
    if (
      private_service &&
      private_service.establishments &&
      private_service.establishments.length === 1 &&
      private_service.establishments[0].id
    ) {
      this.setState({
        establishment_selected: private_service.establishments[0].id,
      });
    } else {
      const establishment_ids =
        establishments_selected && establishments_selected.length > 0
          ? establishments_selected[establishments_selected.length - 1].value
          : null;
      this.setState({ establishment_selected: establishment_ids });
    }
  };

  handleConfigurationChange = () => {
    const {
      privateServiceId,
      privateSlotId,
      coaches_selected,
      establishment_selected,
    } = this.state;
    if (this.props.onConfigurationChange) {
      this.props.onConfigurationChange({
        private_service: privateServiceId,
        private_slot: privateSlotId,
        coaches: coaches_selected,
        establishment: establishment_selected,
        ...(this.props.coachUnique && coaches_selected.length
          ? { coach: coaches_selected[0] }
          : {}),
      });
    }
  };

  getResourceState = () => ({
    coachResourceState: {
      needChoice: false,
      choices: this.state.private_service
        ? this.state.private_service.coaches.filter((c) => c && c.id)
        : [],
      disabled:
        this.state.private_service &&
        this.state.private_service.coaches.length === 1,
      canSelect:
        this.state.private_service &&
        this.state.private_service.coaches.length >= 1 &&
        (this.state.private_service.coach_attribution ===
          RESOURCE_ATTRIBUTION_CONSUMER ||
          this.props.asManager),

      hasChosen: !!(this.state.coaches_selected && this.state.coaches_selected)
        .length,
    },
    establishmentResourceState: {
      disabled:
        !this.state.private_service ||
        this.state.private_service.establishments.length === 1,
      choices: this.state.private_service
        ? this.state.private_service.establishments.filter((c) => !!c)
        : [],
      needChoice:
        this.state.private_service &&
        this.state.private_service.establishments.length > 1 &&
        (this.state.private_service.establishment_attribution ===
          RESOURCE_ATTRIBUTION_CONSUMER ||
          this.props.asManager),
      canSelect:
        this.state.private_service &&
        this.state.private_service.establishments.length >= 1 &&
        (this.state.private_service.establishment_attribution ===
          RESOURCE_ATTRIBUTION_CONSUMER ||
          this.props.asManager),

      hasChosen: !!this.state.establishment_selected,
    },
  });

  handleServiceChange = (privateServiceId, privateSlotId) => {
    const private_service = this.props.private_services.find(
      (ps) => ps.id === privateServiceId,
    );
    this.setState(
      {
        privateServiceId,
        privateSlotId,
        private_service,
      },
      () => {
        this.handleCoachChange([]);
        this.handleEstablishmentChange([]);
      },
    );
  };

  render() {
    const { t, classes } = this.props;
    const {
      coachResourceState,
      establishmentResourceState,
    } = this.getResourceState();
    return (
      <div className={classes.container}>
        <PrivateServiceSelectorWithSlot
          privateServiceList={this.props.private_services}
          privateServiceId={this.state.privateServiceId}
          privateSlotId={this.state.privateSlotId}
          onSelect={this.handleServiceChange}
        />
        {this.props.establishment ||
        establishmentResourceState.needChoice ||
        establishmentResourceState.canSelect ? (
          <div className={classes.selectorContainer}>
            <Typography color="textSecondary" variant="caption">
              {this.props.t('service.selector.establishment.label')}
            </Typography>
            <EstablishmentSelector
              disabled={establishmentResourceState.disabled}
              establishments={establishmentResourceState.choices}
              helperText={this.props.t('slotSearcher.selectEstablishment')}
              closeMenuOnSelect
              selectedEstablishments={[this.state.establishment_selected]}
              selectOption={this.handleEstablishmentChange}
            />
          </div>
        ) : null}
        {this.props.coach || coachResourceState.canSelect ? (
          <div className={classes.selectorContainer}>
            <Typography color="textSecondary" variant="caption">
              {this.props.t('service.selector.coach.label')}
            </Typography>
            <CoachSelector
              closeMenuOnSelect
              placeholder={t('slotSearcher.selectCoach')}
              selectedCoaches={this.state.coaches_selected}
              isDisabled={coachResourceState.disabled}
              selectOption={this.handleCoachChange}
              coaches={coachResourceState.choices}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: theme.spacing(2),
  },
  sectionTitle: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  selectorContainer: {
    marginTop: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateServiceBooker);
