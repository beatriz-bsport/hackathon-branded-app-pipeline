import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { HourglassEmpty } from '@material-ui/icons';
import classnames from 'classnames';
import { compose } from 'recompose';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import './BookButton.css';

type OwnProps = {
  isRegisteringForWaitingList: boolean;
  selectedOffersCount: number;
  price: number;
  tax: number;
  selectedPackId: number;
  is_tax_excluded_in_marketplace: boolean;
  onClickBook: () => void;
};

type State = {
  animation: boolean;
};

type Props = OwnProps & WithTranslation;
class BookButton extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animation: false,
    };
  }

  componentDidMount() {
    this.setState({ animation: true });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !this.state.animation &&
      prevProps.selectedPackId !== this.props.selectedPackId
    ) {
      this.setState({ animation: true });
    }
  }

  render() {
    const {
      t,
      onClickBook,
      isRegisteringForWaitingList,
      selectedOffersCount,
      price,
      is_tax_excluded_in_marketplace,
      tax,
    } = this.props;
    const { animation } = this.state;
    const display_price = getCurrencyDisplayWithPrice(
      price,
      is_tax_excluded_in_marketplace,
      tax,
    );
    return (
      <>
        <Button
          onClick={onClickBook}
          color="primary"
          className={classnames('bookingButton', {
            bookingButtonAnimation: animation,
          })}
          variant="contained"
          onAnimationEnd={() => {
            this.setState({ animation: false });
          }}
        />
        <div className="buttonContent">
          {isRegisteringForWaitingList ? (
            <div className="waitingListButtonContent">
              <HourglassEmpty className="iconLeft" />
              <Typography variant="button" display="block">
                {t('offer.mainButton.registerWaitingList')}
              </Typography>
            </div>
          ) : (
            <div className="bookingButtonContent">
              <Typography variant="button" display="block">
                {t('offer.mainButton.book')}
              </Typography>
              <Typography variant="caption">
                {t('offer.mainButton.numberOfBook', {
                  count: selectedOffersCount,
                })}
              </Typography>
            </div>
          )}
          {display_price && (
            <div className="bookingButtonPrice">{display_price}</div>
          )}
        </div>
      </>
    );
  }
}

export default compose<any, OwnProps>(withTranslation(['booking']))(BookButton);
