// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import MemberSearchModal from '../../member/components/MemberSearchModal.component';
import PrivateSlotSelector from './PrivateSlotSelector.component';
import CoachSelector from '../../associated-coach/components/CoachSelector.component';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';

type Props = {
  t: TFunction,
};

export class PrivateBookingManagerPaymentForm extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      private_service: props.private_service,
      coach: props.coach,
      establishment: props.establishment,
      member: props.member,
    };
  }

  handlMemberSelected = (member: number) => {
    this.setState({ member });
  };

  selectSlotOption = (slotOption: { value: number, label: string }) => {
    if (!slotOption) {
      this.handleCoachChange(null);
      this.handleEstablishmentChange(null);
      this.handleServiceChange(null);
      this.handleSlotChange(null);
      return;
    }
    const { value } = slotOption;
    const service_selected = this.props.private_services.find((ps) =>
      ps.slots.map((s) => s.id).includes(value),
    );
    const slot_selected = service_selected.slots.find((s) => s.id === value);
    this.handleCoachChange(null);
    this.handleEstablishmentChange(null);
    this.handleServiceChange(service_selected.id);
    this.handleSlotChange(slot_selected);
  };

  handleCoachChange = (coaches_selected: Array<Option>) => {
    if (!this.props.coach) {
      if (coaches_selected && coaches_selected.length > 0) {
        this.setState({
          coaches_selected: coaches_selected.map((o) => o.value),
        });
        this.props.onCoachChange(
          this.state.service_selected.coaches.filter((c) =>
            coaches_selected.map((o) => o.value).includes(c.id),
          ),
        );
      } else {
        this.setState({ coaches_selected: [] });
        this.props.onCoachChange([]);
      }
    }
  };

  handleEstablishmentChange = (establishments_selected: Array<Option>) => {
    if (!this.props.establishment) {
      if (establishments_selected && establishments_selected.length > 0) {
        this.setState({
          establishments_selected: [
            establishments_selected[establishments_selected.length - 1].value,
          ],
        });
      } else {
        this.setState({ establishments_selected: [] });
      }
    }
  };

  handleServiceChange = (service_selected_id: ?number) => {
    if (!this.props.private_service) {
      const service_selected = this.props.private_services.find(
        (ps) => ps.id === service_selected_id,
      );
      this.setState({ private_service });
      this.props.onPrivateServiceChange(service_selected);
    }
  };

  handleSlotChange = (slot_selected: ?PrivateSlot) => {
    this.setState({ slot_selected });
    this.props.onPrivateSlotChange(slot_selected);
  };

  render() {
    if (!this.state.member) {
      return (
        <MemberSearchModal
          handlMemberSelected={this.handleMember}
          searchMember={this.props.searchMember}
          searchedMembers={this.props.searchedMembers}
          loading={this.props.memberSearchLoading}
        />
      );
    }
    return (
      <div>
        <PrivateSlotSelector
          onChange={this.selectSlotOption}
          onServiceChange={this.handleServiceChange}
          placeholder={t('slotSearcher.selectPrivateSlot')}
          privateServices={this.props.private_services}
        />
        {establishmentResourceState.needChoice ||
        establishmentResourceState.canSelect ? (
          <EstablishmentSelector
            establishments={
              this.state.service_selected
                ? this.state.service_selected.establishments.filter((c) => !!c)
                : []
            }
            helperText={this.props.t('slotSearcher.selectEstablishment')}
            selectedEstablishments={this.state.establishments_selected}
            selectOption={this.handleEstablishmentChange}
          />
        ) : null}
        {coachResourceState.canSelect ? (
          <CoachSelector
            placeholder={t('slotSearcher.selectCoach')}
            selectedCoaches={this.state.coaches_selected || []}
            isDisabled={!coachResourceState.canSelect}
            selectOption={this.handleCoachChange}
            coaches={
              this.state.service_selected
                ? this.state.service_selected.coaches.filter((c) => !!c)
                : []
            }
          />
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
});

export default compose(
  withNamespaces(),
  withStyles(styles),
)(PrivateBookingManagerPaymentForm);
