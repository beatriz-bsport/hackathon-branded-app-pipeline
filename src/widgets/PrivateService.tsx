import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { ButtonBase } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { PrivateServiceSelectorDataProvider, PrivateServiceSelectorPage } from 'bsport-saas/src/pages/marketplace/PrivateService/PrivateServiceSelectorPage/PrivateServiceSelector.page';
import { PrivateServiceDetailDataProvider, PrivateServiceDetailPage } from 'bsport-saas/src/pages/marketplace/PrivateService/PrivateServiceDetailPage/PrivateServiceDetail.page';
import { MarketplacePrivateServiceData } from 'bsport-saas/src/libs/marketplace/types';
import { PrivateService, PrivateSlot } from 'bsport-saas/src/libs/private-service/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { Theme } from 'bsport-saas/src/libs/theme/types';

import { openTab } from '../utils/utils';
import { RootState } from '../store/reducer';

const PrivateServiceSelector = themify(
  PrivateServiceSelectorDataProvider(PrivateServiceSelectorPage)
);
const PrivateServiceDetailBase = themify(
  PrivateServiceDetailDataProvider(PrivateServiceDetailPage)
);


type OwnProps = {
  companyId: number;
  config: MarketplacePrivateServiceData
  store: any;
  theme: Theme;
  onWindowOpen: (popupWindow: any) => void;
}

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>

interface State {
  serviceId?: number | null;
}


class PrivateServiceWidget extends React.PureComponent<Props, State> {
  popupWindow?: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      serviceId: props.config.serviceId,
    };
  }

  onClickPrivateService = (ps: PrivateService) => {
    this.setState({ serviceId: ps.id });
  };

  onSessionSelect = (data: {
    date: string;
    establishment: number;
    associated_coach: number;
  }, privateSlot: PrivateSlot) => {
    const { PUBLIC_URL } = window.runtime.env
    const url = `${PUBLIC_URL}/customer/payment/private-service/${
      this.state.serviceId
    }/private-slot/${
      privateSlot.id
    }/?membership=${this.props.companyId}&data=${encodeURIComponent(
      JSON.stringify(data)
    )}&authToken=${this.props.auth.token}&context=widget`;

    const popupWindow = openTab(url);
    this.props.onWindowOpen(popupWindow);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {(
          this.state.serviceId === undefined ||
          this.state.serviceId === null
        ) && (
          <PrivateServiceSelector
            companyId={this.props.companyId.toString()}
            companyName=""
            onClickPrivateService={this.onClickPrivateService}
            store={this.props.store}
            theme={this.props.theme}
          />
        )}

        {this.state.serviceId !== undefined && this.state.serviceId !== null && (
          <div className={classes.detailContainer}>
            <ButtonBase onClick={() => {
              this.setState({ serviceId: undefined });
            }}
            >
              <ChevronLeftIcon
                className={classes.icon}
                fontSize="large"
              />
            </ButtonBase>

            <PrivateServiceDetailBase
              companyId={this.props.companyId.toString()}
              serviceId={this.state.serviceId.toString()}
              onSessionSelect={this.onSessionSelect}
              hideDetailSummary
              store={this.props.store}
              theme={this.props.theme}
            />
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: any) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  detailContainer: {
    width: '100%',
  },
  icon: {
    marginLeft: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};


export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(PrivateServiceWidget);
