import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import withStyles from '@material-ui/styles/withStyles';
import { Theme } from '@material-ui/core/styles';

import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CanvasPreview from '#libs/spot-scheduling/component/SpotPreview/CanvasPreview.component';
import type {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from '#libs/spot-scheduling/types';
import type { Offer, OfferStatus } from '#libs/offer/types';
import { getCoachOrSubstitute } from '../../libs/offer/utils';
import type { MaterialStyleType } from '../../utils/types';

interface OwnProps {
  offer: Offer;
  roomBlueprintById: { [key: string]: RoomBlueprint };
  assetsForBlueprintById: {
    [key: string]: { [key: string]: AssetForBlueprint };
  };
  offerStatusById: { [key: string]: OfferStatus };
  fetchSpotForBlueprint: () => void;
  spotTypes: SpotType[];
}

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  isOpen: boolean;
};

class OfferManagementRoomBlueprint extends React.PureComponent<Props, State> {
  state = {
    isOpen: false,
  };

  toggleIsOpen = () =>
    this.setState(({ isOpen: previousValue }) => ({ isOpen: !previousValue }));

  render() {
    const { classes } = this.props;

    const roomBlueprint =
      this.props.roomBlueprintById[this.props.offer.room_blueprint];
    const offerStatus: OfferStatus =
      this.props.offerStatusById[this.props.offer.id];

    const takenSpot = offerStatus?.taken_spots || [];

    return (
      <Paper className={classes.container}>
        <ButtonBase
          className={classes.titleContainer}
          onClick={this.toggleIsOpen}
        >
          <Typography variant="h6">{roomBlueprint?.name || ''}</Typography>
          {this.state.isOpen ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </ButtonBase>
        <Divider />
        <Collapse in={this.state.isOpen}>
          <CanvasPreview
            assets={
              this.props.assetsForBlueprintById[this.props.offer.room_blueprint]
            }
            coach={getCoachOrSubstitute(this.props.offer)}
            fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
            roomBlueprint={roomBlueprint}
            spotTypes={this.props.spotTypes}
            takenSpot={takenSpot}
          />
        </Collapse>
      </Paper>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    marginBottom: theme.spacing(2),
    maxHeight: '100%',
    padding: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: '100%',
  },
});

export default compose<any, OwnProps>(withStyles(styles))(
  OfferManagementRoomBlueprint,
);
