// @flow
import React, { Component } from 'react';

import {
  withMobileDialog,
  withStyles,
  CircularProgress,
  Grid,
  Dialog,
  DialogContent,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CancelIcon from '@material-ui/icons/Cancel';

import { get, API_URI } from '../../../http';

import Map from '../../../components/establishment/Map.component';

type Props = {
  classes: Object,
  offer: Offer,
  onClose: () => void,
  fullScreen: boolean,
};

type State = {
  activity: ?Activity,
  loading: boolean,
};

export class ActivityDetailModal extends Component<Props, State> {
  state = {
    loading: false,
    activity: null,
  };

  componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true });
    get(`${API_URI}/activity/${this.props.offer.activity.id}/detail?noapp=true`)
      .then((response) => {
        if (this._isMounted) {
          this.setState({ activity: response.data, loading: false });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({ loading: false });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  renderCoachBanner = () => {
    const { classes } = this.props;
    const { activity } = this.state;
    if (activity && activity.coach) {
      return (
        <div>
          <Typography variant="h6" className={classes.title}>
            Coach
          </Typography>
          <ListItem>
            <Avatar src={activity.coach.photo} />
            <ListItemText primary={activity.coach.name} />
          </ListItem>
        </div>
      );
    }
    return null;
  };

  renderActivity = () => {
    const { activity } = this.state;
    const { offer, classes, onClose } = this.props;
    const establishment =
      offer.establishment_override || offer.activity.etablissement;
    const { location } = establishment || { location: null };
    const center = location ? [location.latitude, location.longitude] : null;
    const markers = location ? [establishment] : [];
    return (
      <Card className={classes.card}>
        <IconButton className={classes.cancelButton} onClick={onClose}>
          <CancelIcon className={classes.cancelIcon} />
        </IconButton>
        <CardMedia
          className={classes.media}
          src={activity.cover_main}
          component="img"
        />
        <CardContent>
          <div>
            <Typography variant="body1" className={classes.hashtags}>
              {activity.hashtags}
            </Typography>
            <Typography variant="h6" className={classes.title}>
              {activity.name}
            </Typography>
            <Typography variant="body1">{activity.description}</Typography>
            {this.renderCoachBanner()}
            <Typography variant="h6" className={classes.title}>
              {establishment.title}
            </Typography>
            <Typography variant="body1" className={classes.address}>
              {establishment.location.address}
            </Typography>
            <Map center={center} markers={markers} zoom={15} />
          </div>
        </CardContent>
      </Card>
    );
  };

  render() {
    const { classes, onClose, fullScreen } = this.props;
    return (
      <Dialog
        open
        scroll="paper"
        onClose={onClose}
        classes={{ paper: classes.dialog }}
        fullScreen={fullScreen}
      >
        <DialogContent className={classes.dialogContent}>
          {this.state.loading || !this.state.activity ? (
            <Grid
              container
              item
              justify="center"
              alignItems="center"
              className={classes.loadingContainer}
            >
              <CircularProgress />
            </Grid>
          ) : (
            this.renderActivity()
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  card: {
    margin: '0 auto',
    minWidth: 200,
  },
  media: {
    maxHeight: 200,
    objectFit: 'cover',
  },
  hashtags: {
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 500,
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit,
  },
  address: {
    marginBottom: 20,
  },
  callButton: {
    marginBottom: 20,
  },
  listPaymentPacks: {
    backgroundColor: '#F8F8F8',
    maxHeight: 320,
    overflowY: 'scroll',
  },
  loadingContainer: {
    padding: 40,
  },
  cancelButton: {
    position: 'fixed',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  cancelIcon: {
    color: 'secondary',
    height: 32,
    width: 32,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  dialog: {
    minWidth: '60vw',
  },
  dialogContent: {
    padding: 0,
    paddingTop: '0 !important',
  },
});
export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles)(ActivityDetailModal),
);
