import { withStyles } from '@material-ui/styles';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { CircularProgress } from '@material-ui/core';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import { ROOM_BLUEPRINT_ERROR_CODE } from '@bsport/common/lib/master-data/spot-scheduling';

import { MaterialStyleType } from '../../utils/types';
import CanvasEditorComponent from '../../libs/spot-scheduling/CanvasSvg/CanvasEditor.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';

import {
  createAssetForBlueprint,
  fetchAssetForBlueprint,
  fetchRoomBlueprintDetail,
  fetchRoomBlueprints,
  updateRoomBlueprint,
} from '../../libs/spot-scheduling/actions';
import { RoomBlueprint } from '../../libs/spot-scheduling/types';
import {
  getAssetByIdentifier,
  getRoomBlueprint,
  getAvailableRoomBlueprints,
} from '../../libs/spot-scheduling/selector';
import { snackbar } from '../../libs/snackbar/actions';
import { OptionCallback } from '../../state/types';

type OwnProps = {
  id: number;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

class SpotSchedulingPages extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchRoomBlueprintDetail(this.props.id);
    this.props.fetchRoomBlueprints();
    this.props.fetchAssetForBlueprint({ blueprint: this.props.id });
  }

  onSave = async (roomBlueprint: RoomBlueprint) => {
    await this.props.updateRoomBlueprint(
      this.props.roomBlueprint.id,
      roomBlueprint,
      {
        onSuccess: () => this.props.success('spotScheduling:saved'),
        onError: (error) => {
          const error_code = error?.reponse?.data?.error?.code;
          if (
            error_code === ROOM_BLUEPRINT_ERROR_CODE.LESS_SPOT_THAN_EFFECTIF
          ) {
            this.props.error('spotScheduling:errorLessSpotThanEffectif');
          } else {
            this.props.error('spotScheduling:saveError');
          }
        },
      },
    );
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

  onExit = () => {
    this.props.push(
      `/establishment/details/${this.props.roomBlueprint.establishment}`,
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.containerSpotScheduling}>
        {this.props.roomBlueprint ? (
          <CanvasEditorComponent
            blueprints={this.props.allBlueprints}
            selectedRoomBlueprint={this.props.roomBlueprint}
            onSave={this.onSave}
            onUpdateImages={this.onUpdateImages}
            assets={this.props.assets}
            onExit={this.onExit}
          />
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
});

const mapDispatchToProps = {
  fetchRoomBlueprintDetail,
  fetchRoomBlueprints,
  updateRoomBlueprint,
  fetchAssetForBlueprint,
  createAssetForBlueprint,
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
