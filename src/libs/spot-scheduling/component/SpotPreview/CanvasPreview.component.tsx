// @ts-nocheck
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { compose } from 'recompose';
import CanvasEditorComponent from '../../CanvasSvg/CanvasEditor.component';
import { CANVAS_SELECTABLE_TOOLS } from '../../CanvasSvg/tools/CanvasStrategy';
import { AssetForBlueprint, RoomBlueprint, SpotType } from '../../types';
import SpotSchedulingHelper from '../../utils';
import { MaterialStyleType } from '../../../../utils/types';

interface OwnProps {
  roomBlueprint: RoomBlueprint;
  assets: { [identifier: string]: AssetForBlueprint };
  takenSpot?: number[];
  selectedSpot?: number;
  coach?: any;
  fetchSpotForBlueprint: () => void;
  spotTypes: Array<SpotType>;
}

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

class CanvasPreview extends React.PureComponent<Props> {
  render() {
    if (!this.props.roomBlueprint) {
      return (
        <div className={this.props.classes.loadingContainer}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <CanvasEditorComponent
        disableEdit
        assets={this.props.assets}
        blueprints={[]}
        coach={this.props.coach}
        fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
        selectedRoomBlueprint={SpotSchedulingHelper.canvasTransformer({
          roomBlueprint: this.props.roomBlueprint,
          takenSpot: this.props.takenSpot,
          selectedSpot: this.props.selectedSpot,
        })}
        selectedTool={CANVAS_SELECTABLE_TOOLS.hand}
        spotTypes={this.props?.spotTypes?.concat({ id: -1 })}
      />
    );
  }
}

const styles = () => ({
  loadingContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default compose<any, OwnProps>(withStyles(styles))(CanvasPreview);
