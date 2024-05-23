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
import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import PrivatePassSelector from '../../private-service/components/pass/PrivatePassSelector.component';
import { Establishment, EstablishmentGroup } from '../../establishment/types';
import { PrivatePass, PrivateService } from '../../private-service/types';
import { PaymentPack } from '../../payment-packs/types';
import { MaterialStyleType } from '../../../utils/types';

type Identifier =
  | 'meta_activity'
  | 'establishment'
  | 'private_service'
  | 'payment_pack'
  | 'workshop'
  | 'private_pass'
  | 'establishment_group'
  | 'contract';

type OwnProps = {
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (objectIds: number, allObjects?: boolean) => void;
  identifier: Identifier;
  metaActivities: MetaActivity[];
  establishments: Establishment[];
  privateServices: PrivateService[];
  paymentPacks: PaymentPack[];
  privatePasses: PrivatePass[];
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
  selectedPaymentPack?: number | null;
  selectedPrivatePass?: number | null;
  selectedEstablishmentGroup?: number | null;
  selectedContract?: number | null;
};

class NotificationSourceSelector extends React.PureComponent<Props, State> {
  state: State = {
    selectedMetaActivity: [],
    selectedEstablishment: [],
    selectedPrivateService: null,
    selectedPaymentPack: null,
    selectedPrivatePass: null,
    selectedEstablishmentGroup: null,
    selectedContract: null,
  };

  onChange = (identifier: Identifier, value: number) => {
    const state: State = {
      selectedMetaActivity: [],
      selectedEstablishment: [],
      selectedPrivateService: null,
      selectedPaymentPack: null,
      selectedPrivatePass: null,
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
    if (identifier === 'payment_pack') {
      state.selectedPaymentPack = value;
    }
    if (identifier === 'private_pass') {
      state.selectedPrivatePass = value;
    }
    if (identifier === 'contract') {
      state.selectedContract = value;
    }

    this.setState(state);
  };

  onSubmit = () => {
    const { identifier } = this.props;

    let objectId = -1;

    if (['meta_activity', 'workshop'].includes(identifier)) {
      /* eslint-disable-next-line */
      objectId = this.state.selectedMetaActivity[0];
    }
    if (identifier === 'establishment') {
      /* eslint-disable-next-line */
      objectId = this.state.selectedEstablishment[0];
    }
    if (identifier === 'establishment_group') {
      /* eslint-disable-next-line */
      objectId = this.state.selectedEstablishmentGroup;
    }
    if (identifier === 'private_service') {
      objectId = this.state.selectedPrivateService;
    }
    if (identifier === 'payment_pack') {
      objectId = this.state.selectedPaymentPack;
    }
    if (identifier === 'contract') {
      objectId = this.state.selectedContract;
    }
    if (identifier === 'private_pass') {
      objectId = this.state.selectedPrivatePass;
    }
    this.props.onSubmit(objectId);
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
    if (identifier === 'payment_pack') {
      return typeof this.state.selectedPaymentPack !== 'number';
    }
    if (identifier === 'private_pass') {
      return typeof this.state.selectedPrivatePass !== 'number';
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

            {identifier === 'payment_pack' && (
              <PaymentPackSelector
                helperText={t('notifications.paymentPackPlaceholder')}
                isMulti={false}
                onChange={(value) => this.onChange('payment_pack', value)}
                paymentPacks={this.props.paymentPacks}
                value={this.state.selectedPaymentPack}
              />
            )}
            {identifier === 'contract' && (
              <ContractSelector
                contractId={this.state.selectedContract}
                contracts={this.props.contracts}
                onChange={(value) => this.onChange('contract', value)}
              />
            )}

            {identifier === 'private_pass' && (
              <PrivatePassSelector
                // @ts-expect-error
                helperText={t('notifications.privatePassPlaceholder')}
                isMulti={false}
                onChange={(value: number) =>
                  this.onChange('private_pass', value)
                }
                privatePassList={this.props.privatePasses}
                value={this.state.selectedPrivatePass}
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
