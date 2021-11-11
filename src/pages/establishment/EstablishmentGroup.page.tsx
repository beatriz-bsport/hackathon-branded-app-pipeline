import React from 'react';
import Paper from '@material-ui/core/Paper';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import withTitle from '../../hocs/with-title.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import {
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
  upsertEstablishmentGroup as upsertEstablishmentGroupAction,
  deleteEstablishmentGroup as deleteEstablishmentGroupAction,
} from '../../libs/establishment/actions';
import {
  getAssociatedEstablishmentGroup,
  withEstablishment,
  getAvailableEstablishmentList,
} from '../../libs/establishment/selectors';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import EstablishmentGroupFormDialog from '../../libs/establishment/components/EstablishmentGroupFormDialog.component';
import type { EstablishmentGroup as EstablishmentGroupType } from '../../libs/establishment/types';
import EstablishmentGroupTable from '../../libs/establishment/components/EstablishmentGroupTable.component';
import themeSelectors from '../../libs/theme/selectors';

type StateHandlerInit = {
  openDialogForm: boolean;
  initialGroup: EstablishmentGroupType | null;
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
export class EstablishmentGroup extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllEstablishmentGroup();
    this.props.fetchEstablishments();
  }

  render() {
    if (!this.props.companyTheme.enable_multi_localization) {
      return <Redirect to="/establishment/room" />;
    }
    const { t } = this.props;
    if (this.props.loading || !this.props.establishments) {
      return <BackofficeLinearProgress />;
    }
    return (
      <>
        {this.props.submitting && <BackofficeLinearProgress />}
        <>
          {!this.props.establishmentGroupList ||
          (this.props.establishmentGroupList &&
            this.props.establishmentGroupList.length === 0) ? (
            <IsEmptyList
              text={t('group.noGroupHelper')}
              button={t('group.addLocalisation')}
              onCreate={() => this.props.setOpenDialogForm(true)}
            />
          ) : (
            <Paper>
              <EstablishmentGroupTable
                establishmentGroupList={this.props.establishmentGroupList}
                onEditEstablishmentGroup={(group: EstablishmentGroupType) => {
                  this.props.setInitialGroup(group);
                  this.props.setOpenDialogForm(true);
                }}
                onDeleteEstablishmentGroup={(group: EstablishmentGroupType) =>
                  this.props.deleteEstablishmentGroupAction(group)
                }
              />
            </Paper>
          )}
        </>
        <BottomActionButtons
          onCreateLabel={t('group.addLocalisation')}
          onCreate={() => {
            this.props.setInitialGroup(null);
            this.props.setOpenDialogForm(true);
          }}
        />
        {this.props.openDialogForm && (
          <EstablishmentGroupFormDialog
            open={this.props.openDialogForm}
            onSubmit={this.props.upsertEstablishmentGroup}
            onClose={() => {
              this.props.setOpenDialogForm(false);
              this.props.setInitialGroup(null);
            }}
            establishments={this.props.establishments}
            initial={this.props.initialGroup}
            isSubmitting={this.props.submitting}
          />
        )}
      </>
    );
  }
}
const styles = () => ({});
const mapStateToProps = (state: RootState) => ({
  loading:
    state.establishment.loading ||
    state.establishment.establishmentGroup.loading,
  establishmentGroupList: withEstablishment(getAssociatedEstablishmentGroup)(
    state,
  ),
  establishments: getAvailableEstablishmentList(state),
  companyTheme: themeSelectors.getTheme(state),
});
const mapDispatchToProps = {
  fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  fetchEstablishments: fetchEstablishmentsAction,
  upsertEstablishmentGroupAction,
  deleteEstablishmentGroupAction,
};
const mapWithHandlers = {
  upsertEstablishmentGroup:
    (props: OwnAndConnectedProps) =>
    (establishmentGroup: EstablishmentGroupType) => {
      props.setSubmitting(true);
      props.upsertEstablishmentGroupAction(establishmentGroup, {
        onSuccess: () => {
          props.setSubmitting(false);
          props.setInitialGroup(null);
          props.setOpenDialogForm(false);
        },
        onError: () => props.setSubmitting(false),
      });
    },
};
const withStateHandlersInit: StateHandlerInit = {
  openDialogForm: false,
  initialGroup: null,
  submitting: false,
};
const withStateHandlersSetter = {
  setOpenDialogForm: () => (openDialogForm: boolean) => {
    return { openDialogForm };
  },
  setInitialGroup: () => (initialGroup: EstablishmentGroup | null) => {
    return { initialGroup };
  },
  setSubmitting: () => (submitting: boolean) => {
    return { submitting };
  },
};
export default compose<any, OwnProps>(
  withTranslation('establishment'),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:establishment.establishmentGroupPage'),
  ),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(EstablishmentGroup);
