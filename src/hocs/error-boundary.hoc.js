// @flow

import * as Sentry from '@sentry/browser';

import React from 'react';

import '../errors.scss';

/* eslint-disable */
export default function(WrappedComponent) {
  return class extends React.Component {
    state = { error: null };

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Sentry.withScope((scope) => {
        Object.keys(errorInfo).forEach((key) => {
          scope.setExtra(key, errorInfo[key]);
        });
        Sentry.captureException(error);
      });
    }

    render() {
      if (this.state.error) {
        return (
          <div>
            <div className="error-screen-wrapper">
              <div className="error-screen-shadow" />
            </div>
            <div className="error-screen">
              <h1>Woops</h1>
              <p>Vous venez de rencontrer une erreur.</p>
              <p>
                {
                  "Nous venons d'en être averti. Nous sommes même sûrement déjà en train de la corriger."
                }
              </p>
              <p>
                Afin de nous aider, vous pouvez remplir le formulaire de
                feedback en nous décrivant le problème rencontré et le contexte
                dans lequel celui-ci s'est produit. Nous reviendrons vers vous
                rapidement.
              </p>
              <div className="buttons">
                <a
                  onClick={() => Sentry.showReportDialog()}
                  className="btn btn-error"
                >
                  Je donne mon feedback
                </a>
                <a
                  onClick={() => {
                    window.location = '/?storeReload';
                  }}
                  className="btn btn-info"
                >
                  Je relance l'interface
                </a>
              </div>
            </div>
          </div>
        );
      }
      return <WrappedComponent />;
    }
  };
}
/* eslint-enable */
