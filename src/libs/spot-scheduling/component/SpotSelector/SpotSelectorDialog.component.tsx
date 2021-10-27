import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/styles/withStyles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import WarningIcon from '@material-ui/icons/Warning';
import { Theme } from '@material-ui/core/styles';
import moment from 'moment-timezone';

import { AssetForBlueprint, RoomBlueprint } from '../../types';
import SpotSelector from './SpotSelector.component';
import { Offer } from '../../../offer/types';
import { MaterialStyleType } from '../../../../utils/types';

interface OwnProps {
  offer?: Offer;
  roomBlueprint?: RoomBlueprint;
  assets: { [identifier: string]: AssetForBlueprint };
  takenSpot: number[];
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onSelectSpot: (spot: number) => void;
  selectedSpot?: number;
  forceFullScreen: boolean | null;
  fullScreen: boolean;
}

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  takenSpotError: boolean;
}

class SpotSelectorDialog extends React.PureComponent<Props, State> {
  state: State = {
    takenSpotError: false,
  };

  onSelectSpot = (spot: number) => {
    this.setState({ takenSpotError: false });
    this.props.onSelectSpot(spot);
  };

  onSelectTakenSpot = () => {
    this.setState({ takenSpotError: true });
  };

  renderContent = () => {
    const { classes, t } = this.props;

    if (!this.props.offer) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className={classes.content}>
        <div className={classes.topRow}>
          <div className={classes.dateContainer}>
            <Typography variant="h6">
              {moment(this.props.offer.date_start)
                .tz(this.props.offer.timezone_name)
                .format('LT')}
            </Typography>

            <Typography className={classes.marginLeft}>
              {`${moment(this.props.offer.date_start)
                .tz(this.props.offer.timezone_name)
                .format('LL')}, ${moment(this.props.offer.date_start)
                .tz(this.props.offer.timezone_name)
                .format('dddd')}`}
            </Typography>
          </div>

          <Typography variant="h6" className={classes.topRowItem}>
            {typeof this.props.selectedSpot === 'number'
              ? t('spotSelectorDialog.spot', {
                  count: this.props.selectedSpot,
                })
              : ''}
          </Typography>

          <div className={classes.topRowItem} />
        </div>

        {this.props.roomBlueprint && (
          <div style={{ height: 750 }}>
            <SpotSelector
              roomBlueprint={this.props.roomBlueprint}
              assets={this.props.assets}
              takenSpot={this.props.takenSpot}
              onSelectSpot={this.onSelectSpot}
              onSelectTakenSpot={this.onSelectTakenSpot}
              selectedSpot={this.props.selectedSpot}
              coach={this.props.offer?.coach}
            />
          </div>
        )}

        {this.state.takenSpotError && (
          <div className={classes.errorContainer}>
            <WarningIcon color="error" />
            <Typography className={classes.marginLeft}>
              {t('spotSelectorDialog.takeSpotError')}
            </Typography>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { t } = this.props;

    return (
      <Dialog
        fullScreen={this.props.fullScreen || !!this.props.forceFullScreen}
        open={this.props.open}
      >
        <MuiDialogTitle
          disableTypography
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">{t('spotSelectorDialog.title')}</Typography>
          <IconButton aria-label="close" onClick={this.props.onClose}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>

        <DialogContent>{this.renderContent()}</DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            {t('spotSelectorDialog.cancel')}
          </Button>
          <Button
            color="primary"
            disabled={!this.props.selectedSpot}
            onClick={this.props.onSubmit}
          >
            {t('spotSelectorDialog.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme: Theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '100%',
  },
  topRow: {
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  dateContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
  topRowItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    display: 'flex',
    alignItem: 'center',
  },
  loadingContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default compose<any, OwnProps>(
  withTranslation(['spotScheduling']),
  // @ts-ignore
  withStyles(styles),
  withMobileDialog(),
)(SpotSelectorDialog);
