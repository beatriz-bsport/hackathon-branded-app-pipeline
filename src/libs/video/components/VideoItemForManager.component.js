import { connect } from 'react-redux';
import { compose } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import { getStatusText, getHeading } from '../../payment-packs/utils';

type Props = {
  classes: *,
  t: Tfunction,
  id: number,
  memberId: number,
  video: object,
  t: TFunction,
  classes: Object,
  video: Object,
  redirectToMember: ?boolean,
  redirectToOffer: ?boolean,
  newTab: ?boolean,
  selected?: boolean,
  date_created: String,
  timezone?: string,

  push: (path: string) => void,
  onClick: ?() => void,
};
export class VideoItemForManager extends Component<Props, State> {
  handleListItemClick = (event: SyntheticEvent<any>) => {
    event.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    const {
      redirectToMember,
      video,
      newTab,
      redirectToOffer,
      memberId,
    } = this.props;
    const url = `/member/${memberId}/`;
    if (redirectToOffer) {
      this.props.push(`/offer/${video.id}`);
    }
    if (redirectToMember && newTab) {
      const win = window.open(url);
      win.focus();
      return;
    }
    if (redirectToMember) {
      this.props.push(`/member/${memberId}/`);
    }
  };

  render() {
    const { t } = this.props;
    const videoStatus = getStatusText(this.props.video, t);
    return (
      <ListItem
        divider
        selected={!!this.props.selected}
        disableRipple
        onClick={this.handleListItemClick}
      >
        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item>
            <ListItemText
              primary={
                <div className={this.props.classes.rowPrimary}>
                  <Typography variant="body2">
                    {getHeading(
                      this.props.date_created,
                      this.props.video,
                      this.props.timezone,
                    )}
                  </Typography>
                </div>
              }
              secondary={
                <div>
                  {videoStatus.map(([txt, color]) => {
                    return (
                      <Typography key={txt} variant="body2" color={color}>
                        {txt}
                      </Typography>
                    );
                  })}
                </div>
              }
            />
          </Grid>
        </Grid>
      </ListItem>
    );
  }
}

const styles = (theme) => ({
  iconButton: {
    marginLeft: theme.spacing(1),
  },
  rightButton: {
    marginLeft: theme.spacing(1),
  },
  badge: {
    right: '0%',
  },
  disabled: {
    background: 'linear-gradient(135deg, #FFDDDD, transparent)',

    '&:hover': {
      background: 'linear-gradient(135deg, #FFC1C1, transparent)',
    },
  },
  cancelled: {
    opacity: 0.5,
    backgroundColor: '#F8F8F8',
  },
  rowPrimary: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
  },
});
export default compose(
  withTranslation(['booking']),
  withStyles(styles),
  connect(null, {}),
)(VideoItemForManager);
