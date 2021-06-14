import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/styles';
import { compose } from 'recompose';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CanvasPreview from './CanvasPreview.component';
import { AssetForBlueprint, RoomBlueprint } from '../../types';
import { MaterialStyleType } from '../../../../utils/types';

interface OwnProps {
  roomBlueprint?: RoomBlueprint;
  assets: { [identifier: string]: AssetForBlueprint };
  open: boolean;
  onClose: () => void;
  takenSpot?: number[];
  selectedSpot?: number;
}

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

class CanvasPreviewDialog extends React.PureComponent<Props> {
  render() {
    return (
      <Dialog fullWidth maxWidth="md" open={this.props.open}>
        <MuiDialogTitle
          disableTypography
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">{this.props.roomBlueprint?.name}</Typography>
          <IconButton aria-label="close" onClick={this.props.onClose}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>

        <DialogContent style={{ height: 800 }}>
          <CanvasPreview
            roomBlueprint={this.props.roomBlueprint}
            assets={this.props.assets}
            takenSpot={this.props.takenSpot}
            selectedSpot={this.props.selectedSpot}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = () => ({});

export default compose<any, OwnProps>(withStyles(styles))(CanvasPreviewDialog);
