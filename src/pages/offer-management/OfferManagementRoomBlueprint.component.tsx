import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import withStyles from '@material-ui/styles/withStyles';
import { Theme } from '@material-ui/core/styles';

import CanvasPreview from '#libs/spot-scheduling/component/SpotPreview/CanvasPreview.component';
import { AssetForBlueprint, RoomBlueprint } from '#libs/spot-scheduling/types';
import { Offer, OfferStatus } from '#libs/offer/types';
import { MaterialStyleType } from '../../utils/types';

interface OwnProps {
  offer: Offer;
  roomBlueprintById: { [key: string]: RoomBlueprint };
  assetsForBlueprintById: {
    [key: string]: { [key: string]: AssetForBlueprint };
  };
  offerStatusById: { [key: string]: OfferStatus };
}

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

class OfferManagementRoomBlueprint extends React.PureComponent<Props> {
  render() {
    const { classes } = this.props;

    const roomBlueprint =
      this.props.roomBlueprintById[this.props.offer.room_blueprint];
    const offerStatus: OfferStatus =
      this.props.offerStatusById[this.props.offer.id];

    const takenSpot = offerStatus?.taken_spots || [];

    return (
      <Paper className={classes.container}>
        <div className={classes.titleContainer}>
          <Typography variant="h6">{roomBlueprint?.name || ''}</Typography>
        </div>

        <CanvasPreview
          roomBlueprint={roomBlueprint}
          assets={
            this.props.assetsForBlueprintById[this.props.offer.room_blueprint]
          }
          takenSpot={takenSpot}
          coach={this.props.offer?.coach}
        />
      </Paper>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    marginBottom: theme.spacing(2),
    maxHeight: '100%',
  },
  titleContainer: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(withStyles(styles))(
  OfferManagementRoomBlueprint,
);
