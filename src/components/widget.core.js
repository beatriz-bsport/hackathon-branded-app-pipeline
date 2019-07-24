// @flow
import React, { Component } from 'react';
import { Moment } from 'bsport-saas/src/i18n';
import Immutable from 'seamless-immutable';
import { Provider } from 'react-redux';
import { MarketPlaceCalendarWidget } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';
import initStore from '../store';

const store = initStore();

// import PropTypes from 'prop-types';

type Props = {
  companyId: number,
};
class BsportWidget extends Component<Props> {
  render() {
    const { companyId } = this.props;
    return (
      <Provider store={store}>
        <MarketPlaceCalendarWidget companyId={companyId} />;
      </Provider>
    );
  }
}

BsportWidget.propTypes = {};

// BsportWidget.defaultProps = {};

export default BsportWidget;
