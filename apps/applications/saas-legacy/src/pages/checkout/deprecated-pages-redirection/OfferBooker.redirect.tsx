import React from 'react';

import { replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import type { CompanyTheme } from '#src/libs/theme/types';
import { getOfferBookerUrl } from '#src/libs/marketplace/routing-utils';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import type { Offer } from '#src/libs/offer/types';
import RedirectionLoading from './RedirectionLoading.component';
import { fetchOfferBulk } from '../../../libs/offer/actions';
import { OptionCallback } from '../../../state/types';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { RootState } from '../../../reducers';

type Props = {
  id: number;
  replace: (path: string) => void;
  fetchOfferBulk: (ids: number[], options: OptionCallback<Offer[]>) => void;
  theme: CompanyTheme;
  fetchCompanyTheme: (
    companyId: number,
    options?: OptionCallback<CompanyTheme>,
  ) => void;
};

/**
 * OfferBookerRedirect Component
 *
 * This React component is responsible for handling the redirection logic when the page is loaded.
 * It ensures that the appropriate booking flow is used base on the company theme associated with the offer.
 * If the current theme does not have a valid company attribute, it fetches the offer information and updates the theme accordingly.
 * The redirection URL is then constructed using the updated theme and offer details.
 *
 */
export class OfferBookerRedirect extends React.Component<Props> {
  // TODO : DELETE THIS ?
  componentDidMount() {
    /*
     * If the current theme does not have a valid company attribute (nullable),
     * fetch the offer details and update the theme.
     * The redirection URL is constructed based on the updated theme and offer details.
     */
    if (!this.props.theme?.company) {
      this.props.fetchOfferBulk([this.props.id], {
        onSuccess: (offerList) => {
          const offer = offerList[0];
          if (offer?.company) {
            this.props.fetchCompanyTheme(offer.company);
          }
        },
      });
    } else {
      /*
       * If the theme has a valid company attribute, fetch the offer details,
       * and construct the redirection URL based on the theme, offer, and other parameters.
       */
      this.props.fetchOfferBulk([this.props.id], {
        onSuccess: (offerList) => {
          const offer = offerList[0];
          this.props.replace(
            getOfferBookerUrl(offer.company, offer.id, window.location.search),
          );
        },
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    /*
     * Check for changes in the theme's company attribute (usually if theme was not retrieved properly at first).
     * If there is a change, fetch the offer details and update the redirection URL.
     * This part is useful when the componentDidMount force a re-update of the theme.
     */
    if (prevProps?.theme.company !== this.props.theme?.company) {
      this.props.fetchOfferBulk([this.props.id], {
        onSuccess: (offerList) => {
          const offer = offerList[0];
          this.props.replace(
            getOfferBookerUrl(offer.company, offer.id, window.location.search),
          );
        },
      });
    }
  }

  render() {
    return <RedirectionLoading />;
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state: RootState) => ({
      theme: state.theme.theme,
    }),
    {
      replace,
      fetchOfferBulk,
      fetchCompanyTheme,
    },
  ),
)(OfferBookerRedirect);
