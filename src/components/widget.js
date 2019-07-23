// @flow
import { Moment } from 'bsport-saas/src/i18n';
import Immutable from 'seamless-immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarketplaceCalendarComponent from 'bsport-saas/src/libs/marketplace/components/MarketplaceCalendar.component';
import './widget.scss';

class Widget extends Component<null> {
  handleDateChange() {
    console.log('handleDateChange');
  }

  openOfferDialog() {
    console.log('handlerOpenDialog');
  }

  render() {
    return (
      <div className="docked-widget">
        <MarketplaceCalendarComponent
          selectedDate={Moment()}
          offers={Immutable([])}
          setFilters={null}
          filters={{
            coaches: Immutable([]),
            metaActivities: Immutable([]),
            establishments: Immutable([]),
          }}
          loading={false}
          dayOffers={Immutable([])}
          onClickOffer={this.openOfferDialog}
          onClickBook={null}
          onClickBookOption={null}
          onSelectDate={this.handleDateChange}
          coaches={Immutable([])}
          establishments={Immutable([])}
          metaActivities={Immutable([])}
          filtersOpen={false}
          toogleFiltersOpen={null}
        />
      </div>
    );
  }
}

Widget.propTypes = {};

Widget.defaultProps = {};

export default Widget;
