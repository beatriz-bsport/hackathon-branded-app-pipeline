// @flow

import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import EstablishmentInput from '../../../components/input/EstablishmentInput.component';

import WarningForceRecursion from './WarningForceRecursion.component';

type Props = {
  t: TFunction,
  onFormFieldChange: (id: string) => (Object) => void,
  establishment: Establishment,
  establishments: Array<Establishment>,
  establishment_override: Establishment,
  offer: Offer,
  hasChangedEstablishment: boolean,
};

export class EstablishmentSubForm extends Component<Props> {
  renderModifyEstablishment = () => (
    <EstablishmentInput
      noBlank
      label={this.props.t('form.offer.establishmentLabel')}
      onChange={this.props.onFormFieldChange('establishment')}
      establishments={this.props.establishments}
      value={this.props.establishment}
    />
  );

  renderModifySubstituteEstablishment = () => (
    <EstablishmentInput
      label={this.props.t('form.offer.substituteEstablishmentLabel')}
      onChange={this.props.onFormFieldChange('establishment_override')}
      establishments={this.props.establishments.filter(
        (e) =>
          e.id !==
          (this.props.establishment || this.props.offer.etablissement.id),
      )}
      value={this.props.establishment_override}
    />
  );

  render() {
    return (
      <div>
        <Grid container direction="row" spacing={16}>
          <Grid item>{this.renderModifyEstablishment()}</Grid>
          <Grid item>{this.renderModifySubstituteEstablishment()}</Grid>
        </Grid>
        {this.props.hasChangedEstablishment ? (
          <WarningForceRecursion
            text={this.props.t('form.offer.establishmentChangeWarning')}
          />
        ) : null}
      </div>
    );
  }
}

export default withNamespaces()(EstablishmentSubForm);
