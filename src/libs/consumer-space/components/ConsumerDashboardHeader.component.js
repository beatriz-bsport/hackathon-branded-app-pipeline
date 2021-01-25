// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import MetaActivityListItem from '../../meta-activity/components/MetaActivityListItem.component';
import EstablishmentListItem from '../../establishment/components/EstablishmentListItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  favoriteMetaActivity: ?MetaActivity,
  favoriteEstablishment: ?Establishment,
  goToCalendar: (params: any) => void,
};

export class ConsumerDashboardHeader extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        {this.props.favoriteMetaActivity || this.props.favoriteEstablishment ? (
          <div>
            <Typography variant="h4" color="textSecondary">
              {this.props.t('dashboard.favoriteTitle')}
            </Typography>
            <div className={this.props.classes.myFavorite}>
              <Grid container direction="row">
                <Grid item xs={12} md={6}>
                  {this.props.favoriteMetaActivity ? (
                    <div className={this.props.classes.favoriteContainer}>
                      <MetaActivityListItem
                        dense
                        metaActivity={this.props.favoriteMetaActivity}
                        onClick={() =>
                          this.props.goToCalendar({
                            f_metaActivities: `[${this.props.favoriteMetaActivity.id}]`,
                          })
                        }
                      />
                    </div>
                  ) : null}
                </Grid>
                <Grid item xs={12} md={6}>
                  {this.props.favoriteEstablishment ? (
                    <div className={this.props.classes.favoriteContainer}>
                      <EstablishmentListItem
                        establishment={this.props.favoriteEstablishment}
                        onClick={() =>
                          this.props.goToCalendar({
                            f_establishments: `[${this.props.favoriteEstablishment.id}]`,
                          })
                        }
                      />
                    </div>
                  ) : null}
                </Grid>
              </Grid>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
  myFavorite: {
    padding: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    boxShadow: theme.shadows[1],
    marginLeft: theme.spacing(-1) * 1,
    // marginRight: theme.spacing(-4),
    backgroundColor: 'white',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  favoriteContainer: {
    width: '100%',
    backgroundColor: 'white',
  },
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles),
)(ConsumerDashboardHeader);
