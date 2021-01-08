import React from 'react';
import { compose } from 'recompose';
import { PrivateServiceSelectorDataProvider, PrivateServiceSelectorPage } from 'bsport-saas/src/pages/marketplace/PrivateService/PrivateServiceSelectorPage/PrivateServiceSelector.page';
import { PrivateServiceDetailDataProvider, PrivateServiceDetailPage } from 'bsport-saas/src/pages/marketplace/PrivateService/PrivateServiceDetailPage/PrivateServiceDetail.page';
import { PrivateService, PrivateSlot } from 'bsport-saas/src/libs/private-service/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { ButtonBase, withStyles } from '@material-ui/core';


import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { constants } from '../const/constants';

interface Props {
  companyId: number;
  store: any;
  data: {
    serviceId?: number;
  }
  classes: any;
}

interface State {
  serviceId?: number;
}

const PrivateServiceSelector = themify(
  PrivateServiceSelectorDataProvider(PrivateServiceSelectorPage)
);
const PrivateServiceDetailBase = themify(
  PrivateServiceDetailDataProvider(PrivateServiceDetailPage)
);

class PrivateServiceWidget extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      serviceId: props.data.serviceId,
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
    const width = window.innerWidth * 0.5;
    const height = window.innerHeight * 0.5;
    const params = `
      scrollbars=no,
      resizable=no,
      status=no,
      location=no,
      toolbar=no,
      menubar=no,
      width=${width},
      height=${height},
      left=${width / 2},
      top=${height / 2}
    `;

    window.open(`${constants.backofficeUrl}/customer/payment/private-service/${
      this.state.serviceId
    }/private-slot/${
      privateSlot.id
    }/?membership=${this.props.companyId}&data=${encodeURIComponent(
      JSON.stringify(data)
    )}`, '_blank', params);
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        {this.state.serviceId === undefined && (
          <PrivateServiceSelector
            companyId={this.props.companyId.toString()}
            companyName=""
            onClickPrivateService={this.onClickPrivateService}
            store={this.props.store}
          />
        )}

        {this.state.serviceId !== undefined && (
          <div>
            <ButtonBase onClick={() => {
              this.setState({ serviceId: undefined });
            }}
            >
              <ChevronLeftIcon
                className={this.props.classes.icon}
                fontSize="large"
              />
            </ButtonBase>
          <PrivateServiceDetailBase
            companyId={this.props.companyId.toString()}
            serviceId={this.state.serviceId.toString()}
            onSessionSelect={this.onSessionSelect}
            hideDetailSummary={true}
            store={this.props.store}
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
  icon: {
    marginLeft: theme.spacing(2),
  },
});

export default compose(
  // @ts-ignore
  withStyles(styles)
)(PrivateServiceWidget);
