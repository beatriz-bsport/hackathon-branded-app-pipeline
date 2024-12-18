import React, { Component } from 'react';
import { replace } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/lab/Alert/Alert';
import Paper from '@material-ui/core/Paper';
import { withTranslation, WithTranslation } from 'react-i18next';
import { EventListParams } from '#src/libs/event/types';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import EventPanel from '../../libs/event/components/EventPanel.component';
// @ts-expect-error
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
    alertInfo: {
      display: 'flex',
      alignItems: 'center',
    },
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
  fetchBasketEventList: (params: EventListParams) => void;
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
      return <BackofficeLinearProgress additionalMargin={1} />;
    }
    const { classes, t } = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item md={6} sm={12}>
          {/* @ts-expect-error */}
          <Typography className={classes.secontionTitle} variant="h4">
            {t('historyTitle')}
          </Typography>
          <Divider className={classes.divider} />
          <Paper>
            {this.props.basketHistoryList.map((basket) => (
              <BasketListItem
                key={basket.id}
                basket={basket}
                onClick={this.selectBasket}
                selected={basket.id === this.props.selectedBasketId}
              />
            ))}
          </Paper>
        </Grid>
        <Grid item md={6} sm={12}>
          {this.props.selectedBasketId ? (
            <>
              {/* @ts-expect-error */}
              <Typography className={classes.secontionTitle} variant="h4">
                {t('myBasket.title')}
              </Typography>
              <Divider className={classes.divider} />
              <Paper>
                {/* @ts-expect-error */}
                <BasketConsumer withPrice basket={this.props.selectedBasket} />
              </Paper>
              {/* @ts-expect-error */}
              <Typography className={classes.secontionTitle} variant="h4">
                {t('eventHistory.sectionTitle')}
              </Typography>
              <Divider className={classes.divider} />
              <Paper>
                <EventPanel
                  // @ts-expect-error
                  eventList={this.props.eventList.items}
                  eventSpec={COMPANY_EVENTS}
                  extraFetchParams={{ object_id: this.props.selectedBasketId }}
                  fetchEventList={this.props.fetchBasketEventList}
                  loading={this.props.eventLoading}
                  page={this.props.eventPage}
                />
              </Paper>
            </>
          ) : (
            <div className={classes.paddedContent}>
              <div className={classes.emptyMessageContainer}>
                <Alert
                  // @ts-expect-error
                  className={classes.alertIcon}
                  // @ts-expect-error
                  color="grey"
                  severity="info"
                >
                  {t('eventHistory.pleaseSelectABasket')}
                </Alert>
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
    // @ts-expect-error
    selectedBasketId: 'selectedBasketId',
  }),
  connector,
)(MemberDetailBasket);
