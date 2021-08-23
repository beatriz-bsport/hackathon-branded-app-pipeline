import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { compose } from 'recompose';
import CanvasEditorComponent from '../../CanvasSvg/CanvasEditor.component';
import { CANVAS_SELECTABLE_TOOLS } from '../../CanvasSvg/tools/CanvasStrategy';
import { AssetForBlueprint, RoomBlueprint } from '../../types';
import SpotSchedulingHelper from '../../utils';
import { MaterialStyleType } from '../../../../utils/types';

interface OwnProps {
  roomBlueprint: RoomBlueprint;
  assets: { [identifier: string]: AssetForBlueprint };
  takenSpot?: number[];
  selectedSpot?: number;
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
        blueprints={[]}
        selectedRoomBlueprint={SpotSchedulingHelper.canvasTransformer({
          roomBlueprint: this.props.roomBlueprint,
          takenSpot: this.props.takenSpot,
          selectedSpot: this.props.selectedSpot,
        })}
        assets={this.props.assets}
        selectedTool={CANVAS_SELECTABLE_TOOLS.hand}
        disableEdit
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
