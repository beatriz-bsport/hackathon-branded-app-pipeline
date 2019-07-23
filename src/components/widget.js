// @flow
import { Moment } from 'bsport-saas/src/i18n';
import Immutable from 'seamless-immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarketplaceCalendarPage from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';
import './widget.scss';

type Props = {
  companyId: number,
};
class Widget extends Component<Props> {
  render() {
    const { companyId } = this.props;
    return (
      <div className="docked-widget">
        <MarketplaceCalendarPage companyId={companyId} />
      </div>
    );
  }
}

Widget.propTypes = {};

Widget.defaultProps = {};

export default Widget;
