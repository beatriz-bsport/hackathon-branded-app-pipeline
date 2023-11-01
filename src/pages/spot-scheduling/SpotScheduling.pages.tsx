// @ts-nocheck
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { CircularProgress } from '@material-ui/core';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import { ROOM_PLAN_NOT_EDITABLE_BECAUSE_AVAILABLE_OFFERS_SCHEDULED } from '@bsport/common/lib/master-data/spot-scheduling';
import { v4 as uuid4 } from 'uuid';
import { MaterialStyleType } from '../../utils/types';
import CanvasEditorComponent from '#libs/spot-scheduling/CanvasSvg/CanvasEditor.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';

import {
  createAssetForBlueprint,
  createUnboundedAssetForBlueprint,
  createSpotForBlueprint,
  fetchAssetForBlueprint,
  fetchSpotForBlueprint,
  fetchRoomBlueprintDetail,
  fetchRoomBlueprints,
  updateRoomBlueprint,
  updateSpotForBlueprint,
  deleteSpotType,
  fetchUnboundedAssetForBlueprintPaginated,
} from '#libs/spot-scheduling/actions';
import {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from '#libs/spot-scheduling/types';
import {
  getAssetByIdentifier,
  getRoomBlueprint,
  getAvailableRoomBlueprints,
  getSpotTypesOfCompanyByBlueprintId,
} from '#libs/spot-scheduling/selector';
import { snackbar } from '#libs/snackbar/actions';
import { OptionCallback } from '../../state/types';
import CanvasSpotCreatorDrawer from '#libs/spot-scheduling/component/SpotCreator/CanvasSpotCreatorDrawer.component';
import CanvasAssetUploaderDialog from '#libs/spot-scheduling/component/SpotCreator/CanvasAssetUploaderDialog.component';
import CanvasSpotDeleteModal from '#libs/spot-scheduling/CanvasSvg/CanvasSpotDeleteModal.component';
import { PERSONALIZED_CUSTOMIZATION } from '#libs/spot-scheduling/component/SpotCreator/CanvasSpotCreatorForm.component';
import SpiviConfirmationDialog from '#libs/spot-scheduling/component/SpiviConfirmationDialog.component';

import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc.js';
import { UPSELL_IDENTIFIER_SPIVI } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';
import { FeatureList } from '#libs/company/types';
import { buildSpiviCorrespondence } from '#libs/spot-scheduling/utils';

import { isErrorWithCustomCode } from '#libs/utils';

type OwnProps = {
  id: number;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

class SpotSchedulingPages extends React.PureComponent<Props> {
  canvasEditorRef = React.createRef();

  state = {
    creationFormIsOpen: false,
    spotTypeToUpdate: false,
    deleteModalOpen: false,
    spotTypeToDelete: true,
    defaultSpot: false,
    spotToSelect: null,
    spiviDialogIsOpen: false,
    spotCorrespondence: {},
    tablePages: {},
    tableCountPages: {},
    assetUploaderIsOpen: false,
  };

  componentDidMount() {
    this.props.fetchRoomBlueprintDetail(this.props.id, {
      onSuccess: this.setSpiviCorrespondence,
    });
    this.props.fetchRoomBlueprints();
    this.props.fetchAssetForBlueprint({ blueprint: this.props.id });
  }

  onSave = (roomBlueprint: RoomBlueprint) => {
    this.props.updateRoomBlueprint(this.props.roomBlueprint.id, roomBlueprint, {
      onSuccess: () => this.props.success('spotScheduling:saved'),
      onError: (error) => {
        if (
          isErrorWithCustomCode(error) &&
          error.response.data?.error_code ===
            ROOM_PLAN_NOT_EDITABLE_BECAUSE_AVAILABLE_OFFERS_SCHEDULED
        ) {
          this.props.error('spotScheduling:errorAvailableOffersScheduled');
        } else {
          this.props.error('spotScheduling:saveError');
        }
      },
    });
  };

  onUpdateSpotType = async (spotType: SpotType, options: OptionCallback) => {
    const spot = new FormData();
    spot.append('blueprint', this.props.id.toString());
    spot.append('name', spotType.name);
    spot.append('prefix', spotType.prefix);
    spot.append('customization', spotType.customization);
    spot.append('shape', spotType.shape);
    spot.append('fill_color', spotType.fill_color);
    spot.append('stroke_color', spotType.stroke_color);
    let free_image = '';
    let selected_image = '';
    let taken_image = '';
    free_image = spotType.free_image;
    selected_image = spotType.selected_image;
    taken_image = spotType.selected_image;

    if (spotType.customization === PERSONALIZED_CUSTOMIZATION) {
      typeof free_image !== 'string' && spot.append('free_image', free_image);

      typeof taken_image !== 'string' &&
        spot.append('taken_image', taken_image);

      typeof selected_image !== 'string' &&
        spot.append('selected_image', selected_image);
    }
    spot.append(
      'establishment',
      this.props.roomBlueprint.establishment.toString(),
    );
    spot.append('company', this.props.roomBlueprint.company.toString());

    let error = false;

    this.props.updateSpotForBlueprint(spotType.id, spot, {
      onSuccess: () => {
        this.props.success('spotScheduling:spotCreatorForm.saved');

        this.setState({
          spotToSelect: spotType.id,
          selectedTool: 'spot',
        });
      },
      onError: () => {
        error = true;
      },
    });

    if (error) {
      this.props.error('spotScheduling:saveError');
      options && options.onError && options.onError();
    } else {
      this.props.success('spotScheduling:spotCreatorForm.saved');
      options && options.onSuccess && options.onSuccess();
    }
  };

  onUpdateImages = async (
    images: { spot_free: any; spot_taken: any },
    options: OptionCallback,
  ) => {
    const spot_free = new FormData();
    spot_free.append('blueprint', this.props.id.toString());
    spot_free.append('identifier', 'spot_free');
    spot_free.append('asset', images.spot_free);

    const spot_taken = new FormData();
    spot_taken.append('blueprint', this.props.id.toString());
    spot_taken.append('identifier', 'spot_taken');
    spot_taken.append('asset', images.spot_taken);

    let error = false;

    const promise = [
      this.props.createAssetForBlueprint(spot_free, {
        onError: () => {
          error = true;
        },
      }),
      this.props.createAssetForBlueprint(spot_taken, {
        onError: () => {
          error = true;
        },
      }),
    ];

    await Promise.all(promise);

    if (error) {
      this.props.error('spotScheduling:saveError');
      options && options.onError && options.onError();
    } else {
      this.props.success('spotScheduling:saved');
      options && options.onSuccess && options.onSuccess();
    }
  };

  onCreateSpot = async (
    {
      name,
      prefix,
      customization,
      shape,
      stroke_color,
      fill_color,
      free_image,
      taken_image,
      selected_image,
    }: SpotType,
    options: OptionCallback,
    default_spot: boolean,
  ) => {
    const spot = new FormData();
    spot.append('blueprint', this.props.id.toString());
    spot.append('name', name);
    spot.append('prefix', prefix);
    spot.append('customization', customization);
    spot.append('shape', shape);
    spot.append('fill_color', fill_color);
    spot.append('stroke_color', stroke_color);
    spot.append('default_spot', default_spot);
    if (customization === PERSONALIZED_CUSTOMIZATION) {
      spot.append('free_image', free_image);

      spot.append('taken_image', taken_image);

      spot.append('selected_image', selected_image);
    }
    spot.append('establishment', '2286');

    let error = false;

    const promise = [
      this.props.createSpotForBlueprint(spot, {
        onSuccess: (response) => {
          this.setState({
            spotToSelect: response.data.id,
            selectedTool: 'spot',
          });
        },
        onError: () => {
          error = true;
        },
      }),
    ];

    await Promise.all(promise);

    if (error) {
      this.props.error('spotScheduling:saveError');
      options && options.onError && options.onError();
    } else {
      this.props.success('spotScheduling:spotCreatorForm.saved');
      options && options.onSuccess && options.onSuccess();
    }
  };

  onUnboundedCreateAsset = (
    { image }: { image: File },
    options?: OptionCallback,
  ) => {
    const newAsset = new FormData();
    newAsset.append('blueprint', this.props.id.toString());
    newAsset.append('identifier', uuid4());
    newAsset.append('asset', image);
    newAsset.append('is_unbounded', true);

    this.props.createUnboundedAssetForBlueprint(newAsset, {
      onSuccess: () => {
        this.props.fetchUnboundedAssetForBlueprintPaginated({
          is_unbounded: true,
          blueprint: this.props.id,
        });
        options?.onSuccess?.();
      },
      onError: () => {
        options?.onError?.();
      },
    });
  };

  newOnDeleteSpot = async (id: number, options: OptionCallback) => {
    let error = false;

    const promise = [
      this.props.deleteSpotType(id, {
        onError: () => {
          error = true;
        },
      }),
    ];

    await Promise.all(promise);

    if (error) {
      this.props.error('spotScheduling:saveError');
      options && options.onError && options.onError();
    } else {
      this.props.success('spotScheduling:spotCreatorForm.deleted');
      options && options.onSuccess && options.onSuccess();
    }
  };

  onExit = () => {
    this.props.push(
      `/establishment/details/${this.props.roomBlueprint.establishment}`,
    );
  };

  openSpotCreationForm = (defaultSpot: boolean) => {
    this.setState({ creationFormIsOpen: true });
    this.setState({ defaultSpot });
  };

  openSpotUpdateForm = (spotTypeToUpdate: SpotType) => {
    this.setState({ creationFormIsOpen: true, spotTypeToUpdate });
  };

  openAssetUploader = () => {
    this.setState({ assetUploaderIsOpen: true });
  };

  openDeleteModal = () => {
    this.setState({ deleteModalOpen: true });
  };

  closeDeleteModal = () => {
    this.setState({ deleteModalOpen: false });
    this.props.fetchRoomBlueprintDetail(this.props.id);
    this.props.fetchSpotForBlueprint({
      company: this.props.roomBlueprint.company,
    });
  };

  onDeleteSpotType = (spotTypeToDelete: SpotType) => {
    this.setState({ deleteModalOpen: true, spotTypeToDelete });
  };

  closeCreationForm = (defaultSpot: boolean) => {
    this.setState({ creationFormIsOpen: false, spotTypeToUpdate: false });
    if (defaultSpot) {
      this.props.fetchRoomBlueprintDetail(this.props.id);
      this.props.fetchSpotForBlueprint({
        company: this.props.roomBlueprint.company,
      });
    }
  };

  setSpiviCorrespondence = () => {
    this.setState(
      buildSpiviCorrespondence(this.props.spotTypes, this.props.roomBlueprint),
    );
  };

  fetchSpotForBlueprintAndBuildSpiviCorrespondence = (data) => {
    this.props.fetchSpotForBlueprint(data, {
      onSuccess: this.setSpiviCorrespondence,
    });
  };

  handlePageChange = (ev, value, spotTypeId) => {
    this.setState((prevState) => ({
      tablePages: {
        ...prevState.tablePages,
        [spotTypeId]: value,
      },
    }));
  };

  openSpiviDialog = () => {
    this.setState({ spiviDialogIsOpen: true });
  };

  closeSpiviDialog = () => {
    this.setState({ spiviDialogIsOpen: false });
  };

  onClickUnboundedAsset = (asset: AssetForBlueprint) => {
    const data = {
      x: 0,
      y: 0,
      selected: false,
      height: 100,
      width: 100,
      image: asset.asset,
    };
    const newSvgElement = {
      type: 'rect',
      id: `unbounded-asset-${asset.identifier}`,
      data,
    };

    const currentCanvasEditor = this.canvasEditorRef?.current;
    currentCanvasEditor?.state?.current?.elements &&
      currentCanvasEditor.setStateWithHistory({
        elements: [
          ...(currentCanvasEditor?.state?.current?.elements ?? []),
          newSvgElement,
        ],
      });

    this.setState({ assetUploaderIsOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.containerSpotScheduling}>
        {this.props.roomBlueprint ? (
          <div style={{ width: '100%' }}>
            <CanvasEditorComponent
              ref={this.canvasEditorRef}
              assets={this.props.assets}
              blueprints={this.props.allBlueprints}
              fetchSpotForBlueprint={
                this.fetchSpotForBlueprintAndBuildSpiviCorrespondence
              }
              onDeleteSpotType={this.onDeleteSpotType}
              onExit={this.onExit}
              onSave={this.onSave}
              onUpdateImages={this.onUpdateImages}
              openAssetUploader={this.openAssetUploader}
              openDeleteModal={this.openDeleteModal}
              openSpiviDialog={this.openSpiviDialog}
              openSpotCreationForm={this.openSpotCreationForm}
              openSpotUpdateForm={this.openSpotUpdateForm}
              selectedRoomBlueprint={this.props.roomBlueprint}
              selectedTool={this.state.selectedTool}
              spotToSelect={this.state.spotToSelect}
              spotTypes={this.props.spotTypes.concat({ id: -1 })}
              spotTypesOfBlueprint={this.props.spotTypesOfBlueprint}
            />
            <CanvasSpotCreatorDrawer
              closeDialog={this.closeCreationForm}
              defaultSpot={this.state.defaultSpot}
              onCreateSpot={this.onCreateSpot}
              onUpdateSpot={this.onUpdateSpotType}
              open={this.state.creationFormIsOpen}
              spotTypeToUpdate={this.state.spotTypeToUpdate}
            />
            <CanvasAssetUploaderDialog
              blueprintId={this.props.id}
              closeDialog={() => this.setState({ assetUploaderIsOpen: false })}
              defaultSpot={this.state.defaultSpot}
              onClickUnboundedAsset={this.onClickUnboundedAsset}
              onCreateAsset={this.onUnboundedCreateAsset}
              open={this.state.assetUploaderIsOpen}
              spotTypeToUpdate={this.state.spotTypeToUpdate}
            />
            <CanvasSpotDeleteModal
              deleteSpotType={(spotType) => {
                this.newOnDeleteSpot(spotType.id, {
                  onSuccess: this.closeDeleteModal,
                });
              }}
              onClose={() => this.setState({ deleteModalOpen: false })}
              spotTypeToDeleteId={
                this.state.deleteModalOpen
                  ? this.state.spotTypeToDelete || true
                  : null
              }
            />
            <FeatureListProvider>
              {(featureList: FeatureList) => (
                <>
                  {hasUpsell(featureList, UPSELL_IDENTIFIER_SPIVI) &&
                    this.props.roomBlueprint.spivi_box_id && (
                      <SpiviConfirmationDialog
                        handlePageChange={this.handlePageChange}
                        onClose={this.closeSpiviDialog}
                        open={this.state.spiviDialogIsOpen}
                        spotCorrespondence={this.state.spotCorrespondence}
                        spotTypes={this.props.spotTypes.concat({
                          id: -1,
                        })}
                        tableCountPages={this.state.tableCountPages}
                        tablePages={this.state.tablePages}
                      />
                    )}
                </>
              )}
            </FeatureListProvider>
          </div>
        ) : (
          <div className={classes.fullCenter}>
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

const styles = () => ({
  containerSpotScheduling: {
    display: 'flex',
    flex: 1,
    height: '100%',
  },
  fullCenter: {
    display: 'flex',
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  roomBlueprint: getRoomBlueprint(state, props.id),
  allBlueprints: getAvailableRoomBlueprints(state),
  assets: getAssetByIdentifier(state, props.id),
  spotTypes: getSpotTypesOfCompanyByBlueprintId(state, props.id),
});

const mapDispatchToProps = {
  fetchRoomBlueprintDetail,
  fetchRoomBlueprints,
  updateRoomBlueprint,
  updateSpotForBlueprint,
  fetchAssetForBlueprint,
  fetchSpotForBlueprint,
  createAssetForBlueprint,
  createUnboundedAssetForBlueprint,
  createSpotForBlueprint,
  deleteSpotType,
  fetchUnboundedAssetForBlueprintPaginated,
  push,
  success: snackbar.success,
  error: snackbar.error,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(['spotScheduling']),
)(SpotSchedulingPages);
