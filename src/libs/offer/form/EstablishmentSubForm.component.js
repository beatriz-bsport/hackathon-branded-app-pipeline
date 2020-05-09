// @flow

import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import WarningIcon from '@material-ui/icons/Warning';

import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelectorWithCard.component';
import WarningForceRecursion from './WarningForceRecursion.component';

type Props = {
  t: TFunction,
  establishment: Establishment,
  establishments: Array<Establishment>,
  establishment_override: Establishment,
  classes: Object,
  hasChangedEstablishment: boolean,
  establishments_override: Array,
  onChangeEstablishmentOverride: (Establishment) => void,
  onChangeEstablishment: (Establishment) => void,
};

export class EstablishmentSubForm extends Component<Props> {
  renderModifyEstablishment = () => (
    <div className={this.props.classes.selector}>
      <Typography variant="caption" className={this.props.classes.caption}>
        {this.props.t('establishment:baseEstablishment')}
      </Typography>

      <EstablishmentSelector
        id="establishment"
        placeholder={this.props.t('establishment:establishment')}
        establishments={this.props.establishments}
        value={this.props.establishment}
        onChange={this.props.onChangeEstablishment}
      />
    </div>
  );

  renderModifySubstituteEstablishment = () => (
    <div className={this.props.classes.selector}>
      <Typography variant="caption" className={this.props.classes.caption}>
        {this.props.t('establishment:overrider')}
      </Typography>
      <EstablishmentSelector
        id="establishment_override"
        placeholder={this.props.t('establishment:establishment_override')}
        establishments={this.props.establishments_override}
        value={this.props.establishment_override}
        onChange={this.props.onChangeEstablishmentOverride}
      />
    </div>
  );

  render() {
    return (
      <div className={this.props.classes.selector}>
        {this.renderModifyEstablishment()}
        {this.props.establishment && this.props.hasChangedEstablishment ? (
          <WarningForceRecursion
            text={this.props.t('form.offer.establishmentChangeWarning')}
          />
        ) : null}
        {this.props.establishment ? null : (
          <div className={this.props.classes.warningContainer}>
            <WarningIcon size={20} />
            <Typography
              variant="caption"
              className={this.props.classes.caption}
            >
              {this.props.t('establishment:pleaseFill')}
            </Typography>
          </div>
        )}
        {this.renderModifySubstituteEstablishment()}
      </div>
    );
  }
}

const styles = (theme) => ({
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
  caption: {
    paddingLeft: theme.spacing(1),
  },
  selector: {
    width: '100%',
  },
});
export default compose(
  withStyles(styles),
  withNamespaces(),
)(EstablishmentSubForm);
