// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import MetaActivityListItem from '../../libs/meta-activity/components/MetaActivityListItem.component';
import EstablishmentListItem from '../../libs/establishment/components/EstablishmentListItem.component';

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
    padding: theme.spacing.unit,
    paddingTop: 0,
    paddingBottom: 0,
    boxShadow: theme.shadows[1],
    marginLeft: -theme.spacing.unit * 4,
    marginRight: -theme.spacing.unit * 4,
    backgroundColor: 'white',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  favoriteContainer: {
    width: '100%',
    backgroundColor: 'white',
  },
});

export default compose(
  withNamespaces(['consumerSpace']),
  withStyles(styles),
)(ConsumerDashboardHeader);
