import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';

import { replace as replaceAction } from 'connected-react-router';
import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button, Typography, Paper } from '@material-ui/core';
import { Payment } from '@material-ui/icons';
import withTheme from '#src/hocs/company-themifier.hoc';

import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { getContract } from '#src/libs/subscription/selectors';
import { fetchContractDetail } from '#src/libs/subscription/actions';
import ValidationIcon from '#src/components/icons/ValidationIcon.component';
import TimeoutButton from '#src/components/button/TimeoutButton.component';
import ErrorIcon from '#src/components/icons/ErrorIcon.component';
import ContractValidationCard from '#src/libs/subscription/components/contract/ContractValidationCard.component';
import { getContractCheckoutUrl } from '#src/libs/marketplace/routing-utils';
import ConsumerAppBar from './ConsumerAppBar.container';
import themeSelectors from '../../libs/theme/selectors';
import { WithHandlerType } from '../../utils/types';
// @ts-expect-error
import { withQueryParamsUndecoded } from '../../hocs/with-query-params.hoc';
import { RootState } from '../../reducers';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { VALIDATION_DELAY } from '#src/libs/constants';

type RouterProps = {
  success: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  companyId: number;
  contractId: string;
  next?: string;
};

type Props = RouterProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

export class ContractCheckoutValidation extends Component<Props> {
  componentDidMount() {
    this.props.fetchContractDetail(parseInt(this.props.contractId));
  }

  generateTextContent = () => {
    const { t, success, next } = this.props;
    if (success) {
      if (next) {
        return t('subscriptionPaymentDialog.success.text_content_funnel');
      }
      return t('subscriptionPaymentDialog.success.text_content');
    }
    return t('subscriptionPaymentDialog.error.text_content');
  };

  render() {
    const { classes, success, next, t, goToUserSpace, goToSubsciption } =
      this.props;
    const textContent = this.generateTextContent();
    return (
      <ConsumerAppBar>
        <div className={classes.container}>
          <Paper className={classes.paperContainer}>
            <div className={classes.paperSection}>
              <div className={classes.header}>
                {success ? <ValidationIcon /> : <ErrorIcon />}
                <Typography className={classes.centerText} variant="h4">
                  {success
                    ? t('subscriptionPaymentDialog.success.title')
                    : t('subscriptionPaymentDialog.error.title')}
                </Typography>
                <Typography className={classes.centerText}>
                  {textContent}
                </Typography>
              </div>
              <div className={classes.actions}>
                {next ? (
                  <TimeoutButton
                    color="primary"
                    delayBeforeActivation={VALIDATION_DELAY}
                    onClick={success ? goToUserSpace : goToSubsciption}
                    variant="contained"
                  >
                    {success
                      ? t('subscriptionPaymentDialog.success.button_text')
                      : t('subscriptionPaymentDialog.error.button_text')}
                  </TimeoutButton>
                ) : (
                  <Button
                    color="primary"
                    onClick={success ? goToUserSpace : goToSubsciption}
                    variant="contained"
                  >
                    {success
                      ? t('subscriptionPaymentDialog.success.button_text')
                      : t('subscriptionPaymentDialog.error.button_text')}
                  </Button>
                )}
                {!success && !next && (
                  <Button
                    color="primary"
                    onClick={goToUserSpace}
                    variant="outlined"
                  >
                    {t('subscriptionPaymentDialog.error.userSpace')}
                  </Button>
                )}
              </div>
            </div>

            {success && (
              <>
                <Typography className={classes.paperSection} variant="h5">
                  {t('subscriptionPaymentDialog.success.recap')}
                </Typography>
                <div className={classes.divider} />
                <div className={classes.paperSection}>
                  <div className={classes.section}>
                    <div className={classes.iconAndText}>
                      <Payment />
                      <Typography variant="h5">
                        {t('subscriptionPaymentDialog.success.contract')}
                      </Typography>
                    </div>
                    <ContractValidationCard contract={this.props.contract} />
                  </div>
                </div>
              </>
            )}
          </Paper>
        </div>
      </ConsumerAppBar>
    );
  }
}

const connector = connect(
  (state: RootState, props: RouterProps) => ({
    theme: themeSelectors.getTheme(state),
    // @ts-expect-error
    contract: getContract(state, parseInt(props.contractId, 10)),
  }),
  {
    replace: replaceAction,
    fetchContractDetail,
  },
);

const mapWithHandlers = {
  goToUserSpace:
    (props: RouterProps & ConnectedProps<typeof connector>) => () => {
      if (props.next) {
        return props.replace(props.next);
      }
      if (!WidgetUtils.isWidget()) {
        return props.replace(`/c/${props.companyId}/subscription/`);
      }
      return props.replace(
        `/widget/${props.theme.company_name}/${props.companyId}/subscription?context=widget`,
      );
    },
  goToSubsciption:
    (props: RouterProps & ConnectedProps<typeof connector>) => () => {
      if (props.next) {
        return props.replace(props.next);
      }
      return props.replace(
        // @ts-expect-error
        getContractCheckoutUrl(props.companyId, props.contractId),
      );
    },
};
const styles = (theme: Theme) =>
  createStyles({
    divider: {
      height: '2px',
      margin: '-8px 0px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    },
    section: {
      padding: theme.spacing(1),
      display: 'flex',
      gap: theme.spacing(1),
      flexDirection: 'column',
      width: '50%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    iconAndText: {
      display: 'flex',
      gap: theme.spacing(1),
      alignItems: 'center',
    },
    paperContainer: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '35%',
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        minHeight: '100%',
      },
    },
    content: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(5),
      alignItems: 'center',
    },
    paper: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      gap: theme.spacing(1),
      padding: theme.spacing(2),
    },
    centeredContent: {
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      height: theme.spacing(25),
      width: theme.spacing(25),
    },
    actions: {
      display: 'flex',
      gap: theme.spacing(3),
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerText: {
      textAlign: 'center',
      maxWidth: theme.spacing(120),
    },
    paperSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      padding: theme.spacing(3),
      gap: theme.spacing(3),
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(2),
      flex: '1',
    },
  });

export default compose(
  withQueryParamsUndecoded([
    ['success', 'next'],
    'queryParams',
    'setQueryParams',
  ]),
  routerParamsToProps({
    contractId: 'contractId:number',
    companyId: 'companyId:number',
  }),
  withProps((props: { queryParams: { success: string; next?: string } }) => {
    return {
      success: props.queryParams.success === 'true',
      next: props.queryParams.next,
    };
  }),
  withTranslation(['payment', 'subscription']),
  connector,
  withHandlers(mapWithHandlers),
  withTheme,
  withStyles(styles),
)(ContractCheckoutValidation);
