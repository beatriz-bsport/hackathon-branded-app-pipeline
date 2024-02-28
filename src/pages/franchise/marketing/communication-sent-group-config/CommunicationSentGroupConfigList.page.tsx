import React from 'react';

import { compose, withHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import { ConnectedProps, connect } from 'react-redux';
import { WithHandlerType } from '../../../../utils/types';
import { OptionCallback } from '../../../../state/types';
import { RootState } from '../../../../reducers';
import withTitle from '#hocs/with-title.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import {
  createCommunicationSentGroupConfig as createCommunicationSentGroupConfigAction,
  deleteCommunicationSentGroupConfig as deleteCommunicationSentGroupConfigAction,
  fetchCommunicationSentGroupConfigsList as fetchCommunicationSentGroupConfigsListAction,
  updateCommunicationSentGroupConfig as updateCommunicationSentGroupConfigAction,
  duplicateCommunicationSentGroupConfig as duplicateCommunicationSentGroupConfigAction,
} from '#libs/communication/actions';
import {
  getAllCommunicationSentGroupConfigs,
  getCommunicationSentGroupConfig,
} from '#libs/communication/selectors';
import type { CommunicationSentGroupConfig } from '#libs/communication/types';
// @ts-expect-error
import withQueryParams from '../../../../hocs/with-query-params.hoc';
// @ts-expect-error
import SmartListFormDialog from '#libs/smart-list/components/SmartListFormDialog.component';
import BottomActionButtons from '#components/button/BottomActionsButton.component';
import CommunicationSentGroupConfigListing from '#libs/communication/components/communication-sent-group-config/CommunicationSentGroupConfigListing';

type OwnProps = {
  campaignId: number;
  setQueryParams: (queryName: string) => (queryValue: boolean) => void;
  selectedId: number;
};

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;

type Props = OwnAndConnectedProps &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  openCreateDialog: boolean;
  openEditDialog: boolean;
};

class CommunicationSentGroupConfigList extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openCreateDialog: false,
      openEditDialog: false,
    };
  }

  componentDidMount() {
    this.props.fetchAllCommunicationSentGroupConfig();
  }

  addNewCommunicationSentGroupConfig = (
    communicationSentGroupConfig: Omit<CommunicationSentGroupConfig, 'id'>,
    options?: OptionCallback,
  ) => {
    this.props.createCommunicationSentGroupConfig(
      { ...communicationSentGroupConfig, to_all_members: true },
      {
        onSuccess: (newCommunicationSentGroupConfig) => {
          if (options && options.onSuccess) options.onSuccess();
          this.props.goToEdit(newCommunicationSentGroupConfig.id);
        },
      },
    );
    this.setState({ openCreateDialog: false });
    this.props.setQueryParams('create')(false);
  };

  handleUpdateCommunicationSentGroupConfig = (
    communicationSentGroupConfig: CommunicationSentGroupConfig,
  ) => {
    this.setState({ openEditDialog: false });
    this.props.updateCommunicationSentGroupConfig(this.props.selectedId, {
      ...communicationSentGroupConfig,
      ...(this.props.communicationSentGroupConfigSelected.to_all_members
        ? {
            to_all_members:
              this.props.communicationSentGroupConfigSelected.to_all_members,
          }
        : {
            smartlists:
              this.props.communicationSentGroupConfigSelected.smartlists,
          }),
    });
  };

  handleCommunicationSentGroupConfigDeleteOnClick = (id: number) => {
    this.props.deleteCommunicationSentGroupConfig(id, {
      onSuccess: () => this.props.goToCommunicationSentGroupConfigsList,
    });
  };

  handleCommunicationSentGroupConfigDuplicateOnClick = (id: number) =>
    this.props.duplicateCommunicationSentGroupConfig(id, {
      onSuccess: (
        communicationSentGroupConfig: CommunicationSentGroupConfig,
      ) => {
        return this.props.goToSelected(communicationSentGroupConfig.id);
      },
    });

  handleSelect = (id: number) => {
    if (id === this.props.selectedId) {
      this.props.goToEdit(id);
    } else {
      this.props.goToSelected(id);
    }
  };

  handleEditSmartListCard = () => this.setState({ openEditDialog: true });

  handleCommunicationSentGroupConfigItemOnClick = (campaignId: number) =>
    this.handleSelect(campaignId);

  handleOpenCommunicationSentGroupConfigCreateDialog = () => {
    this.setState({ openCreateDialog: true });
    this.props.setQueryParams('create')(true);
  };

  handleCancelCommunicationSentGroupConfigCreateOrUpdateDialog = () => {
    this.setState({
      openEditDialog: false,
      openCreateDialog: false,
    });
    this.props.setQueryParams('create')(false);
  };

  render() {
    const {
      t,
      communicationSentGroupConfigsList,
      communicationSentGroupConfigSelected,
      loading,
      goToSelectedCommunicationSentGroupConfig,
      goToEdit,
    } = this.props;

    return (
      <div>
        <CommunicationSentGroupConfigListing
          communicationSentGroupConfigSelected={
            communicationSentGroupConfigSelected
          }
          communicationSentGroupConfigsList={communicationSentGroupConfigsList}
          goToEdit={goToEdit}
          goToSelectedCommunicationSentGroupConfig={
            goToSelectedCommunicationSentGroupConfig
          }
          handleCommunicationSentGroupConfigDeleteOnClick={
            this.handleCommunicationSentGroupConfigDeleteOnClick
          }
          handleCommunicationSentGroupConfigDuplicateOnClick={
            this.handleCommunicationSentGroupConfigDuplicateOnClick
          }
          handleCommunicationSentGroupConfigItemOnClick={
            this.handleCommunicationSentGroupConfigItemOnClick
          }
          handleEditSmartListCard={this.handleEditSmartListCard}
          handleOpenCommunicationSentGroupConfigCreateDialog={
            this.handleOpenCommunicationSentGroupConfigCreateDialog
          }
          loading={loading}
        />
        {(this.state.openEditDialog || this.state.openCreateDialog) && (
          <SmartListFormDialog
            fullScreen
            isFranchisor
            onCancel={
              this.handleCancelCommunicationSentGroupConfigCreateOrUpdateDialog
            }
            open={this.state.openEditDialog || this.state.openCreateDialog}
            smartlist={
              this.state.openEditDialog
                ? this.props.communicationSentGroupConfigSelected
                : null
            }
            updateSmartList={
              this.state.openEditDialog
                ? this.handleUpdateCommunicationSentGroupConfig
                : this.addNewCommunicationSentGroupConfig
            }
          />
        )}
        {!!communicationSentGroupConfigsList.length && (
          <BottomActionButtons
            onCreate={this.handleOpenCommunicationSentGroupConfigCreateDialog}
            onCreateLabel={t('campaign.add')}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  { selectedId }: { selectedId: number },
) => ({
  communicationSentGroupConfigsList: getAllCommunicationSentGroupConfigs(state),
  communicationSentGroupConfigSelected: getCommunicationSentGroupConfig(
    state,
    selectedId,
  ),
  loading:
    state.communicationSentGroupConfig.communicationSentGroupConfig.loading,
});

const mapDispatchToProps = {
  fetchAllCommunicationSentGroupConfig:
    fetchCommunicationSentGroupConfigsListAction,
  createCommunicationSentGroupConfig: createCommunicationSentGroupConfigAction,
  updateCommunicationSentGroupConfig: updateCommunicationSentGroupConfigAction,
  deleteCommunicationSentGroupConfig: deleteCommunicationSentGroupConfigAction,
  duplicateCommunicationSentGroupConfig:
    duplicateCommunicationSentGroupConfigAction,
  push,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const mapWithHandlers = {
  goToEdit: (props: OwnAndConnectedProps) => (id: number) =>
    props.push(`/f/marketing/campaign/${id}/general`),
  goToSelected: (props: OwnAndConnectedProps) => (id: number) =>
    props.push(`/f/marketing/campaign/${id}`),
  goToSelectedCommunicationSentGroupConfig:
    (props: OwnAndConnectedProps) => (id: number) =>
      props.push(`/f/marketing/campaign/${id}/general`),
  goToCommunicationSentGroupConfigsList: (props: OwnAndConnectedProps) => () =>
    props.push('/f/marketing/campaign'),
};

export default compose(
  routerParamsToProps({ campaignId: 'selectedId:number' }),
  withTranslation(['campaign']),
  withTitle(({ t }: { t: TFunction }) =>
    t('navigation:franchiseMenu.marketing.campaigns'),
  ),
  withQueryParams([['create'], 'queryParams', 'setQueryParams']),
  connector,
  withHandlers(mapWithHandlers),
)(CommunicationSentGroupConfigList);
