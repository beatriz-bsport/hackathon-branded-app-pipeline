import React, { Component } from 'react';
import { replace } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { withTranslation, WithTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import EventPanel from '../../libs/event/components/EventPanel.component';
import { COMPANY_EVENTS } from '../../libs/checkout/event.utils';
import BasketListItem from '../../libs/checkout/components/BasketListItem.component';
import BasketConsumer from '../../libs/checkout/components/BasketConsumer.component';

import { RootState } from '../../reducers';
import {
  fetchBasketEventList as fetchBasketEventListAction,
  fetchBasketHistoryList,
} from '../../libs/checkout/actions';
import {
  getBasketEventState,
  getBasketHistoryList,
  getBasket,
} from '../../libs/checkout/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

const styles = (theme: Theme) =>
  createStyles({
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
    paddedContent: {
      padding: theme.spacing(2),
    },
    emptyMessageContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(4),
    },
    emptyMessageText: {
      marginTop: theme.spacing(2),
    },
    rightPanelContainer: {
      '&>*': {
        marginBottom: theme.spacing(2),
      },
    },
  });

type OwnProps = {
  id: number;
  selectedBasketId?: string;
  fetchBasketEventList: (memberId: number) => void;
  eventList: Array<any>;
  eventPage: number;
  eventLoading: boolean;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class MemberDetailBasket extends Component<Props> {
  componentDidMount() {
    this.props.fetchBasketHistoryList(this.props.id);
  }

  selectBasket = (selectedBasketId: string) => {
    this.props.replace(`/member/${this.props.id}/basket/${selectedBasketId}`);
  };

  render() {
    if (this.props.basketLoading) {
      return <BackofficeLinearProgress />;
    }
    const { classes, t } = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item md={6} sm={12}>
          <Typography className={classes.secontionTitle} variant="h4">
            {t('historyTitle')}
          </Typography>
          <Divider className={classes.divider} />
          <Paper>
            {this.props.basketHistoryList.map((basket) => (
              <BasketListItem
                key={basket.id}
                selected={basket.id === this.props.selectedBasketId}
                basket={basket}
                onClick={this.selectBasket}
              />
            ))}
          </Paper>
        </Grid>
        <Grid item md={6} sm={12}>
          {this.props.selectedBasketId ? (
            <>
              <Typography className={classes.secontionTitle} variant="h4">
                {t('myBasket.title')}
              </Typography>
              <Divider className={classes.divider} />
              <Paper>
                <BasketConsumer basket={this.props.selectedBasket} withPrice />
              </Paper>
              <Typography className={classes.secontionTitle} variant="h4">
                {t('eventHistory.sectionTitle')}
              </Typography>
              <Divider className={classes.divider} />
              <Paper>
                <EventPanel
                  loading={this.props.eventLoading}
                  eventList={this.props.eventList.items}
                  page={this.props.eventPage}
                  fetchEventList={this.props.fetchBasketEventList}
                  extraFetchParams={{ object_id: this.props.selectedBasketId }}
                  eventSpec={COMPANY_EVENTS}
                />
              </Paper>
            </>
          ) : (
            <div className={classes.paddedContent}>
              <div className={classes.emptyMessageContainer}>
                <InfoIcon fontSize="large" color="disabled" />
                <Typography
                  className={classes.emptyMessageText}
                  color="textSecondary"
                  variant="caption"
                >
                  {t('eventHistory.pleaseSelectABasket')}
                </Typography>
              </div>
            </div>
          )}
        </Grid>
      </Grid>
    );
  }
}

const connector = connect(
  (
    state: RootState,
    { id, selectedBasketId }: { id: number; selectedBasketId: string },
  ) => {
    const basketEventState = getBasketEventState(state);
    return {
      eventList: basketEventState,
      eventPage: basketEventState.page,
      eventLoading: basketEventState.loading,
      basketHistoryList: getBasketHistoryList(state, id),
      basketLoading: state.checkout.basket.history.loading,
      selectedBasket: getBasket(state, selectedBasketId),
    };
  },
  {
    fetchBasketHistoryList,
    replace,
    fetchBasketEventList: fetchBasketEventListAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['checkout']),
  routerParamsToProps({
    id: 'id:number',
    selectedBasketId: 'selectedBasketId',
  }),
  connector,
)(MemberDetailBasket);
