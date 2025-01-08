import { withStyles } from '@material-ui/styles';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { CircularProgress } from '@material-ui/core';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import { ROOM_PLAN_NOT_EDITABLE_BECAUSE_AVAILABLE_OFFERS_SCHEDULED } from '@bsport/common/master-data/spot-scheduling.js';
import { v4 as uuid4 } from 'uuid';
import CanvasEditorComponent from '#src/libs/spot-scheduling/CanvasSvg/CanvasEditor.component';

import {
  createAssetForBlueprint,
  createUnboundAssetForBlueprint,
  createSpotForBlueprint,
  fetchAssetForBlueprint,
  fetchSpotForBlueprint,
  fetchRoomBlueprintDetail,
  fetchRoomBlueprints,
  updateRoomBlueprint,
  updateSpotForBlueprint,
  deleteSpotType,
  fetchUnboundAssetForBlueprintPaginated,
} from '#src/libs/spot-scheduling/actions';
import type {
  AssetForBlueprint,
  RoomBlueprint,
  SpotNameFormatCustomization,
  SpotToUpdate,
  SpotType,
} from '#src/libs/spot-scheduling/types';
import {
  getAssetByIdentifier,
  getRoomBlueprint,
  getAvailableRoomBlueprints,
  getSpotTypesOfCompanyByBlueprintId,
} from '#src/libs/spot-scheduling/selector';
import themeSelectors from '#src/libs/theme/selectors';
import { snackbar } from '#src/libs/snackbar/actions';
import CanvasSpotCreatorDrawer from '#src/libs/spot-scheduling/component/SpotCreator/CanvasSpotCreatorDrawer.component';
import CanvasAssetUploaderDialog from '#src/libs/spot-scheduling/component/SpotCreator/CanvasAssetUploaderDialog.component';
import CanvasSpotDeleteModal from '#src/libs/spot-scheduling/CanvasSvg/CanvasSpotDeleteModal.component';
import {
  NO_NAME_CUSTOMIZATION,
  PREFIX_NAME_CUSTOMIZATION,
  SUFFIX_NAME_CUSTOMIZATION,
} from '#src/libs/spot-scheduling/constants';
import SpiviConfirmationDialog from '#src/libs/spot-scheduling/component/SpiviConfirmationDialog.component';

// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc.js';
import { UPSELL_IDENTIFIER_SPIVI } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { FeatureList } from '#src/libs/company/types';
import { buildSpiviCorrespondence } from '#src/libs/spot-scheduling/utils';

import { isErrorWithCustomCode } from '#src/libs/utils';
import { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { MaterialStyleType } from '../../utils/types';
import { PERSONALIZED_CUSTOMIZATION } from '#src/libs/spot-scheduling/component/SpotCreator/CanvasSpotCreatorForm.component';

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
    // @ts-expect-error
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
          // @ts-expect-error
          isErrorWithCustomCode(error) &&
          // @ts-expect-error
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

  onUpdateSpotType = async (
    spotType: SpotType,
    options: OptionCallback,
    name_format_customization: SpotNameFormatCustomization,
  ) => {
    const spot = new FormData();
    spot.append('blueprint', this.props.id.toString());
    spot.append('name', spotType.name);
    switch (name_format_customization) {
      case NO_NAME_CUSTOMIZATION:
        spot.append('prefix', '');
        spot.append('suffix', '');
        break;
      case PREFIX_NAME_CUSTOMIZATION:
        spot.append('prefix', spotType.prefix);
        spot.append('suffix', '');
        break;
      case SUFFIX_NAME_CUSTOMIZATION:
        spot.append('suffix', spotType.suffix);
        spot.append('prefix', '');
        break;
      default:
        break;
    }
    spot.append('customization', spotType.customization);
    spot.append('shape', spotType.shape);
    spot.append('fill_color', spotType.fill_color);
    spot.append('stroke_color', spotType.stroke_color);
    let free_image = '';
    let selected_image = '';
    let taken_image = '';
    free_image = spotType.free_image;
    selected_image = spotType.selected_image;
    taken_image = spotType.taken_image;

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

  onCreateSpot = (
    {
      name,
      prefix,
      suffix,
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
    name_format_customization: SpotNameFormatCustomization,
  ) => {
    const spot = new FormData();
    spot.append('blueprint', this.props.id.toString());
    spot.append('name', name);
    switch (name_format_customization) {
      case PREFIX_NAME_CUSTOMIZATION:
        spot.append('prefix', prefix);
        break;
      case SUFFIX_NAME_CUSTOMIZATION:
        spot.append('suffix', suffix);
        break;
      default:
        break;
    }
    spot.append('customization', customization);
    spot.append('shape', shape);
    spot.append('fill_color', fill_color);
    spot.append('stroke_color', stroke_color);
    // @ts-expect-error
    spot.append('default_spot', default_spot);
    if (customization === PERSONALIZED_CUSTOMIZATION) {
      spot.append('free_image', free_image);

      spot.append('taken_image', taken_image);

      spot.append('selected_image', selected_image);
    }
    spot.append('establishment', '2286');

    this.props.createSpotForBlueprint(spot, {
      onSuccess: (response) => {
        this.setState({
          // @ts-expect-error
          spotToSelect: response.data.id,
          selectedTool: 'spot',
        });
        this.props.success('spotScheduling:spotCreatorForm.saved');
        options && options.onSuccess && options.onSuccess();
      },
      onError: () => {
        this.props.error('spotScheduling:saveError');
        options && options.onError && options.onError();
      },
    });
  };

  onUnboundCreateAsset = (
    { image }: { image: File },
    options?: OptionCallback,
  ) => {
    const newAsset = new FormData();
    newAsset.append('blueprint', this.props.id.toString());
    newAsset.append('identifier', uuid4());
    newAsset.append('asset', image);
    // @ts-expect-error
    newAsset.append('is_unbound', true);

    this.props.createUnboundAssetForBlueprint(newAsset, {
      onSuccess: () => {
        this.props.fetchUnboundAssetForBlueprintPaginated({
          is_unbound: true,
          blueprint: this.props.id,
        });
        options?.onSuccess?.();
      },
      onError: () => {
        options?.onError?.();
      },
    });
  };

  newOnDeleteSpot = (id: number, options: OptionCallback) => {
    this.props.deleteSpotType(id, {
      onError: () => {
        this.props.error('spotScheduling:saveError');
        options && options.onError && options.onError();
      },
      onSuccess: () => {
        this.props.success('spotScheduling:spotCreatorForm.deleted');
        options && options.onSuccess && options.onSuccess();
      },
    });
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

  openSpotUpdateForm = (spotTypeToUpdate: SpotToUpdate) => {
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

  onDeleteSpotType = (spotTypeToDelete: SpotToUpdate) => {
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

  // @ts-expect-error
  fetchSpotForBlueprintAndBuildSpiviCorrespondence = (data) => {
    this.props.fetchSpotForBlueprint(data, {
      onSuccess: this.setSpiviCorrespondence,
    });
  };

  // @ts-expect-error
  handlePageChange = (ev, value, spotTypeId) => {
    this.setState((prevState) => ({
      tablePages: {
        // @ts-expect-error
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

  onClickUnboundAsset = (asset: AssetForBlueprint) => {
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
      id: `unbound-asset-${asset.identifier}`,
      data,
    };

    const currentCanvasEditor = this.canvasEditorRef?.current;
    // @ts-expect-error
    currentCanvasEditor?.state?.current?.elements &&
      // @ts-expect-error
      currentCanvasEditor.setStateWithHistory({
        elements: [
          // @ts-expect-error
          ...(currentCanvasEditor?.state?.current?.elements ?? []),
          newSvgElement,
        ],
      });

    this.setState({ assetUploaderIsOpen: false });
  };

  handleCloseAssetUploader = () =>
    this.setState({ assetUploaderIsOpen: false });

  render() {
    const { classes, companyTheme } = this.props;
    return (
      <div className={classes.containerSpotScheduling}>
        {this.props.roomBlueprint ? (
          <div style={{ width: '100%' }}>
            <CanvasEditorComponent
              // @ts-expect-error
              ref={this.canvasEditorRef}
              assets={this.props.assets}
              blueprints={this.props.allBlueprints}
              companyTheme={companyTheme}
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
              // @ts-expect-error
              selectedTool={this.state.selectedTool}
              spotToSelect={this.state.spotToSelect}
              // @ts-expect-error
              spotTypes={this.props.spotTypes.concat({ id: -1 })}
              // @ts-expect-error
              spotTypesOfBlueprint={this.props.spotTypesOfBlueprint}
            />
            <CanvasSpotCreatorDrawer
              // @ts-expect-error
              closeDialog={this.closeCreationForm}
              defaultSpot={this.state.defaultSpot}
              // @ts-expect-error
              onCreateSpot={this.onCreateSpot}
              // @ts-expect-error
              onUpdateSpot={this.onUpdateSpotType}
              open={this.state.creationFormIsOpen}
              spotTypeToUpdate={this.state.spotTypeToUpdate}
            />
            <CanvasAssetUploaderDialog
              blueprintId={this.props.id}
              closeDialog={this.handleCloseAssetUploader}
              defaultSpot={this.state.defaultSpot}
              onClickUnboundAsset={this.onClickUnboundAsset}
              // @ts-expect-error
              onCreateAsset={this.onUnboundCreateAsset}
              open={this.state.assetUploaderIsOpen}
              spotTypeToUpdate={this.state.spotTypeToUpdate}
            />
            <CanvasSpotDeleteModal
              deleteSpotType={(spotType) => {
                // @ts-expect-error
                this.newOnDeleteSpot(spotType.id, {
                  onSuccess: this.closeDeleteModal,
                });
              }}
              onClose={() => this.setState({ deleteModalOpen: false })}
              // @ts-expect-error
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
                        // @ts-expect-error
                        spotCorrespondence={this.state.spotCorrespondence}
                        // @ts-expect-error
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
  companyTheme: themeSelectors.getTheme(state),
});

const mapDispatchToProps = {
  fetchRoomBlueprintDetail,
  fetchRoomBlueprints,
  updateRoomBlueprint,
  updateSpotForBlueprint,
  fetchAssetForBlueprint,
  fetchSpotForBlueprint,
  createAssetForBlueprint,
  createUnboundAssetForBlueprint,
  createSpotForBlueprint,
  deleteSpotType,
  fetchUnboundAssetForBlueprintPaginated,
  push,
  success: snackbar.success,
  error: snackbar.error,
};

export default compose(
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(['spotScheduling']),
)(SpotSchedulingPages);
