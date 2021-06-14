import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RoomBlueprint } from '../types';
import SpotSchedulingHelper from '../utils';

interface OwnProps {
  blueprints: RoomBlueprint[];
  open: boolean;
  onClose: () => void;
  onSubmit: (roomBlueprint: RoomBlueprint) => void;
}

type Props = OwnProps & WithTranslation;

interface State {
  selected: RoomBlueprint | null;
}

class RoomBlueprintsListDialog extends React.PureComponent<Props, State> {
  state: State = {
    selected: null,
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.selected);
  };

  render() {
    const { t } = this.props;

    return (
      <Dialog open={this.props.open} maxWidth="md">
        <MuiDialogTitle
          disableTypography
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">
            {t('roomBlueprintSelectorTitle')}
          </Typography>
          <IconButton aria-label="close" onClick={this.props.onClose}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>

        <DialogContent style={{ width: 400 }}>
          <List component="nav" aria-label="main mailbox folders">
            {this.props.blueprints.map((roomBlueprint: RoomBlueprint) => (
              <ListItem
                button
                selected={roomBlueprint.id === this.state.selected?.id}
                onClick={() => this.setState({ selected: roomBlueprint })}
              >
                <ListItemText
                  primary={roomBlueprint.name}
                  secondary={t('placeCount', {
                    count: SpotSchedulingHelper.getSpotCount(roomBlueprint),
                  })}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            {t('spotSelectorDialog.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={this.onSubmit}
            disabled={!this.state.selected}
          >
            {t('spotSelectorDialog.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose<any, OwnProps>(withTranslation('spotScheduling'))(
  RoomBlueprintsListDialog,
);
