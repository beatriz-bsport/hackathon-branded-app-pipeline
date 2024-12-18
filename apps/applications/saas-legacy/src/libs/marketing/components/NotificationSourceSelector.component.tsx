import React from 'react';
import { compose } from 'recompose';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Contract } from '#src/libs/subscription/types';
import ContractSelector from '#src/libs/subscription/components/contract/ContractSelector.component';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import { MetaActivity } from '../../meta-activity/types';
// @ts-expect-error
import MetaActivitySelector from '../../meta-activity/components/MetaActivitySelector.component';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import PrivateServiceSelector from '../../private-service/components/service/PrivateServiceSelector.component';
import { Establishment, EstablishmentGroup } from '../../establishment/types';
import { PrivateService } from '../../private-service/types';
import { MaterialStyleType } from '../../../utils/types';

type Identifier =
  | 'meta_activity'
  | 'establishment'
  | 'private_service'
  | 'workshop'
  | 'establishment_group'
  | 'contract';

type OwnProps = {
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (objectId: number) => void;
  identifier: Identifier;
  metaActivities: MetaActivity[];
  establishments: Establishment[];
  privateServices: PrivateService[];
  contracts: Contract[];
  establishmentGroups: Array<EstablishmentGroup>;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  selectedMetaActivity: number[];
  selectedEstablishment: number[];
  selectedPrivateService?: number | null;
  selectedEstablishmentGroup?: number | null;
  selectedContract?: number | null;
};

class NotificationSourceSelector extends React.PureComponent<Props, State> {
  state: State = {
    selectedMetaActivity: [],
    selectedEstablishment: [],
    selectedPrivateService: null,
    selectedEstablishmentGroup: null,
    selectedContract: null,
  };

  onChange = (identifier: Identifier, value: number) => {
    const state: State = {
      selectedMetaActivity: [],
      selectedEstablishment: [],
      selectedPrivateService: null,
      selectedContract: null,
    };

    if (['meta_activity', 'workshop'].includes(identifier)) {
      state.selectedMetaActivity = [value];
    }
    if (identifier === 'establishment') {
      state.selectedEstablishment = [value];
    }
    if (identifier === 'establishment_group') {
      state.selectedEstablishmentGroup = value;
    }
    if (identifier === 'private_service') {
      state.selectedPrivateService = value;
    }
    if (identifier === 'contract') {
      state.selectedContract = value;
    }

    this.setState(state);
  };

  onSubmit = () => {
    switch (this.props.identifier) {
      case 'meta_activity':
      case 'workshop':
        this.props.onSubmit(this.state.selectedMetaActivity[0]);
        break;
      case 'establishment':
        this.props.onSubmit(this.state.selectedEstablishment[0]);
        break;
      case 'establishment_group':
        this.props.onSubmit(this.state.selectedEstablishmentGroup);
        break;
      case 'private_service':
        this.props.onSubmit(this.state.selectedPrivateService);
        break;
      case 'contract':
        this.props.onSubmit(this.state.selectedContract);
        break;
      default:
        break;
    }
  };

  disableSubmit = () => {
    const { identifier } = this.props;
    if (['meta_activity', 'workshop'].includes(identifier)) {
      return !this.state.selectedMetaActivity.length;
    }
    if (identifier === 'establishment') {
      return !this.state.selectedEstablishment.length;
    }
    if (identifier === 'private_service') {
      return typeof this.state.selectedPrivateService !== 'number';
    }
    if (identifier === 'contract') {
      return typeof this.state.selectedContract !== 'number';
    }
    return false;
  };

  render() {
    const { classes, t, identifier, establishmentGroups } = this.props;

    return (
      <Dialog open onClose={this.props.onClose}>
        <div>
          <DialogTitle>{t('notifications.dialogTitle')}</DialogTitle>
          <DialogContent className={classes.content}>
            <Typography className={classes.helperText}>
              {t(`notifications.selectIdentifierLabel.${identifier}`)}
            </Typography>

            {['meta_activity', 'workshop'].includes(identifier) && (
              <MetaActivitySelector
                closeMenuOnSelect
                noMulti
                metaActivities={this.props.metaActivities || []}
                selectedMetaActivities={this.state.selectedMetaActivity}
                // @ts-expect-error
                selectOption={({ value }) =>
                  this.onChange('meta_activity', value)
                }
              />
            )}

            {identifier === 'establishment' && (
              <EstablishmentSelector
                closeMenuOnSelect
                noMulti
                establishments={this.props.establishments}
                selectedEstablishments={this.state.selectedEstablishment}
                // @ts-expect-error
                selectOption={({ value }) => {
                  this.onChange('establishment', value);
                }}
              />
            )}
            {identifier === 'establishment_group' &&
              !!establishmentGroups?.length && (
                <MaterialUISelector
                  isMulti={false}
                  onChange={(option) =>
                    // @ts-expect-error
                    this.onChange('establishment_group', option.value)
                  }
                  options={[...establishmentGroups].map(
                    (establishmentGroup) => ({
                      label: establishmentGroup.name,
                      value: establishmentGroup.id,
                    }),
                  )}
                />
              )}

            {identifier === 'private_service' && (
              <PrivateServiceSelector
                onChange={(value) => this.onChange('private_service', value)}
                privateServiceId={this.state.selectedPrivateService}
                privateServices={this.props.privateServices}
              />
            )}

            {identifier === 'contract' && (
              <ContractSelector
                contractId={this.state.selectedContract}
                contracts={this.props.contracts}
                onChange={(value) => this.onChange('contract', value)}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.props.onCancel();
                this.props.onClose();
              }}
            >
              {t('notifications.cancel')}
            </Button>

            <Button
              color="primary"
              disabled={this.disableSubmit()}
              onClick={this.onSubmit}
            >
              {t('notifications.next')}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    );
  }
}

const styles = (theme: Theme) => ({
  content: {
    minWidth: 400,
    minHeight: 100,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  helperText: {
    marginBottom: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['marketing']),
)(NotificationSourceSelector);
