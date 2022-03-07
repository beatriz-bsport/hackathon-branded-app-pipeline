import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { push as pushRouter } from 'connected-react-router';
import { OptionCallback } from '../../state/types';
import withTitle from '../../hocs/with-title.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';

import InvoiceConfigurationForm from '../../libs/invoice/components/InvoiceConfigurationForm.component';
import {
  fetchInvoiceConfiguration,
  patchInvoiceConfiguration as patchInvoiceConfigurationAction,
} from '../../libs/invoice/actions';
import {
  snackbarSuccess as snackbarSuccessAction,
  snackbarError as snackbarErrorAction,
} from '../../libs/snackbar/actions';

import {
  getEstablishmentBillingroup,
  withEstablishment,
  getAvailableEstablishmentList,
} from '../../libs/establishment/selectors';
import {
  fetchEstablishments,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  upsertEstablishmentBillingGroup as upsertEstablishmentBillingGroupAction,
  deleteEstablishmentBillingGroup as deleteEstablishmentBillingGroupAction,
} from '../../libs/establishment/actions';
import EstablishmentBillingGroupTable from '../../libs/establishment/components/EstablishmentBillingGroupTable.component';
import EstablishmentBillingGroupFormDialog from '../../libs/establishment/components/EstablishmentBillingGroupFormDialog.component';
import type { EstablishmentBillingGroup as EstablishmentBillingGroupType } from '../../libs/establishment/types';
import themeSelectors from '../../libs/theme/selectors';
import { updateCompanyTheme } from '../../libs/theme/actions';

type StateHandlerInit = {
  openDialogForm: boolean;
  initialBillingGroup: EstablishmentBillingGroupType | null;
  submitting: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
type State = {};
export class InvoiceConfigurationPage extends React.Component<Props, State> {
  componentDidMount() {
    this.props.fetchInvoiceConfiguration();
    this.props.fetchAllEstablishmentBillingGroup();
    this.props.fetchEstablishments();
  }

  render() {
    const { configuration, loading, processing, classes, t } = this.props;
    if (loading || !configuration) {
      return <LinearProgress />;
    }
    return (
      <>
        <div className={classes.container}>
          <InvoiceConfigurationForm
            configuration={configuration}
            processing={processing}
            onSubmit={this.props.patchInvoiceConfiguration}
            submitTheme={this.props.submitTheme}
            theme={this.props.theme}
            goToReports={this.props.goToReports}
            patchTheme={this.props.patchTheme}
          />
          {this.props.theme.enable_multi_localization && (
            <>
              <Paper className={classes.paper}>
                <Typography variant="h6" component="h3">
                  {t('billing_group.header')}
                </Typography>
                <div className={classes.textAndIcon}>
                  <InfoIcon className={classes.leftIcon} fontSize="small" />
                  <div className={classes.helperTextContainer}>
                    <Typography variant="caption">
                      {t('billing_group.helperText')}
                    </Typography>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    this.props.setInitialBillingGroup(null);
                    this.props.setOpenDialogForm(true);
                  }}
                >
                  <AddIcon />
                  {t('billing_group.add')}
                </Button>
                {this.props?.establishmentBillingGroup?.length !== 0 && (
                  <EstablishmentBillingGroupTable
                    establishmentBillingGroupList={
                      this.props.establishmentBillingGroup
                    }
                    onEditEstablishmentBillingGroup={(
                      group: EstablishmentBillingGroupType,
                    ) => {
                      this.props.setInitialBillingGroup(group);
                      this.props.setOpenDialogForm(true);
                    }}
                    onDeleteEstablishmentBillingGroup={(
                      group: EstablishmentBillingGroupType,
                    ) => this.props.deleteEstablishmentBillingGroup(group)}
                  />
                )}
              </Paper>
              {this.props.openDialogForm && (
                <EstablishmentBillingGroupFormDialog
                  open={this.props.openDialogForm}
                  onSubmit={this.props.upsertEstablishmentBillingGroup}
                  onClose={() => {
                    this.props.setOpenDialogForm(false);
                    this.props.setInitialBillingGroup(null);
                  }}
                  establishments={this.props.establishments}
                  initial={this.props.initialBillingGroup}
                  isSubmitting={this.props.submitting}
                />
              )}
            </>
          )}
        </div>
      </>
    );
  }
}
const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: '20vh',
  },
  paper: {
    padding: theme.spacing(2),
  },
  textAndIcon: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  helperTextContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
});
const mapStateToProps = (state: RootState) => ({
  theme: themeSelectors.getTheme(state),
  configuration: state.invoice.configuration.result,
  loading: state.invoice.configuration.loading,
  processing: state.invoice.configuration.updating,
  establishmentBillingGroup: withEstablishment(getEstablishmentBillingroup)(
    state,
  ),
  establishments: getAvailableEstablishmentList(state),
});
const mapDispatchToProps = {
  fetchInvoiceConfiguration,
  patchInvoiceConfigurationAction,
  snackbarSuccess: snackbarSuccessAction,
  snackbarError: snackbarErrorAction,
  fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
  upsertEstablishmentBillingGroupAction,
  fetchEstablishments,
  deleteEstablishmentBillingGroupAction,
  submitTheme: updateCompanyTheme,
  goToReports: () => pushRouter('/reporting'),
};
const mapWithHandlers = {
  patchTheme:
    (props: OwnAndConnectedProps) =>
    (data: FormData, options: OptionCallback) => {
      props.submitTheme(props.theme.company, data, options);
    },
  patchInvoiceConfiguration: (props: OwnAndConnectedProps) => (data) => {
    props.patchInvoiceConfigurationAction(data, {
      onSuccess: () => props.snackbarSuccess('settings.update.success'),
      onError: () => props.snackbarError('settings.update.error'),
    });
  },
  upsertEstablishmentBillingGroup:
    (props: OwnAndConnectedProps) =>
    (establishmentBillingGroup: EstablishmentBillingGroupType) => {
      props.setSubmitting(true);
      props.upsertEstablishmentBillingGroupAction(establishmentBillingGroup, {
        onSuccess: () => {
          props.setSubmitting(false);
          props.setInitialBillingGroup(null);
          props.setOpenDialogForm(false);
          props.fetchEstablishments();
        },
        onError: () => props.setSubmitting(false),
      });
    },
  deleteEstablishmentBillingGroup:
    (props: OwnAndConnectedProps) =>
    (establishmentBillingGroup: EstablishmentBillingGroupType) => {
      props.setSubmitting(true);
      props.deleteEstablishmentBillingGroupAction(establishmentBillingGroup, {
        onSuccess: () => {
          props.setSubmitting(false);
          props.setInitialBillingGroup(null);
          props.fetchEstablishments();
        },
        onError: () => props.setSubmitting(false),
      });
    },
};
const withStateHandlersInit: StateHandlerInit = {
  openDialogForm: false,
  initialBillingGroup: null,
  submitting: false,
};
const withStateHandlersSetter = {
  setOpenDialogForm: () => (openDialogForm: boolean) => {
    return { openDialogForm };
  },
  setInitialBillingGroup:
    () => (initialBillingGroup: EstablishmentBillingGroupType | null) => {
      return { initialBillingGroup };
    },
  setSubmitting: () => (submitting: boolean) => {
    return { submitting };
  },
};
export default compose<any, OwnProps>(
  withTranslation('settings'),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) => t('tab.invoice')),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(InvoiceConfigurationPage);
