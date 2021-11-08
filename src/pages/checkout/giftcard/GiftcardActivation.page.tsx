// @flow
import React from 'react';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import RedeemIcon from '@material-ui/icons/Redeem';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { replace } from 'connected-react-router';

import { withTranslation, WithTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { RootState } from '../../../reducers';
import ConsumerAppBarContainer from '../ConsumerAppBar.container';
import themeSelectors, {
  getCurrencyDisplayWithPrice,
} from '../../../libs/theme/selectors';

import {
  getConsumerGiftcardByActivationCode,
  withGiftcard,
} from '../../../libs/giftcard/selectors';
import {
  retrieveConsumerGiftcardByActivationCode,
  attributeToMember,
} from '../../../libs/giftcard/actions';
import ConsumerGiftcardPreview from '../../../libs/giftcard/components/ConsumerGiftcardPreview.component';

import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { fetchCompanyTheme } from '../../../libs/theme/actions';

type OwnProps = {
  companyId: number;
  activationCode: string;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

export class GiftcardCheckout extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.retrieveConsumerGiftcardByActivationCode(
      this.props.activationCode,
    );
  }

  activate = () => {
    this.props.attributeToMember(
      this.props.consumerGiftcard.id,
      {
        dst_member: 'me',
        activation_code: this.props.activationCode,
      },
      {
        onSuccess: () => this.props.goToConsumerGiftcard(this.props.companyId),
      },
    );
  };

  render() {
    if (!this.props.theme || !this.props.consumerGiftcard) return null;
    const { classes, t } = this.props;
    return (
      <ConsumerAppBarContainer companyId={this.props.companyId}>
        <div className={classes.container}>
          <div className={classes.innerContainer}>
            <Typography variant="h4" className={classes.title}>
              {t('consumerGiftcard.activation.title')}
            </Typography>
            <Typography className={classes.text}>
              {t('consumerGiftcard.activation.subtitle')}
            </Typography>
            <ConsumerGiftcardPreview
              giftcard={this.props.consumerGiftcard.giftcard}
              consumerGiftcard={this.props.consumerGiftcard}
              companyCover={this.props.theme.cover}
            />
            <div>
              <Typography
                color="textSecondary"
                variant="body2"
                className={classes.text}
              >
                {t(
                  this.props.consumerGiftcard?.giftcard.expiration_days
                    ? 'consumerGiftcard.activation.content1withDate'
                    : 'consumerGiftcard.activation.content1',
                  {
                    expiration_days: this.props.consumerGiftcard.giftcard
                      .expiration_days,
                    price: getCurrencyDisplayWithPrice(
                      this.props.consumerGiftcard?.giftcard?.price,
                    ),
                  },
                )}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                className={classes.text}
              >
                {t('consumerGiftcard.activation.content2')}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className={classes.text}
              >
                {t('consumerGiftcard.activation.content3')}
              </Typography>
            </div>
            {!!this.props.consumerGiftcard.date_activated && (
              <div className={classes.disabledText}>
                <InfoOutlinedIcon className={classes.leftIcon} />
                <Typography color="textSecondary">
                  {t('consumerGiftcard.activation.alreadyActivated')}
                </Typography>
              </div>
            )}
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                className={classes.button}
                color="primary"
                onClick={this.activate}
                disabled={!!this.props.consumerGiftcard.date_activated}
              >
                <RedeemIcon className={classes.leftIcon} />
                {t('consumerGiftcard.activation.activate')}
              </Button>
            </div>
          </div>
        </div>
      </ConsumerAppBarContainer>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    disabledText: {
      display: 'flex',
      border: '1px solid orange',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      padding: theme.spacing(2),
    },
    innerContainer: {
      padding: theme.spacing(3),
      maxWidth: 800,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'center',
      width: '100%',
      '&>*': {
        marginBottom: theme.spacing(4),
      },
    },
    title: {
      marginBottom: theme.spacing(3),
    },
    text: {
      marginBottom: theme.spacing(2),
    },
    buttonContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
  });

const connector = connect(
  (state: RootState, { activationCode }: { activationCode: string }) => ({
    consumerGiftcard: withGiftcard(getConsumerGiftcardByActivationCode)(
      state,
      activationCode,
    ),
    theme: themeSelectors.getTheme(state),
  }),
  {
    retrieveConsumerGiftcardByActivationCode,
    fetchCompanyTheme,
    attributeToMember,
    goToConsumerGiftcard: (companyId: number) =>
      replace(`/c/${companyId}/giftcard`),
  },
);

export default compose(
  withTranslation(['giftcard']),
  withStyles(styles),
  routerParamsToProps({
    activationCode: 'activationCode',
    companyId: 'companyId:number',
  }),
  connector,
)(GiftcardCheckout);
