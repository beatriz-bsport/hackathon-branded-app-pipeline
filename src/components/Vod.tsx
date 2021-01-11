import React from 'react';

import {
  MarketplaceVideo,
  MarketplaceVideoDataProvider,
} from 'bsport-saas/src/pages/marketplace/MarketplaceVideo.page';
import {
  MarketplaceVideoDetail,
  MarketplaceVideoDetailDataProvider,
} from 'bsport-saas/src/pages/marketplace/MarketplaceVideoDetail.page';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import { ButtonBase, withStyles } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { compose } from 'recompose';

import './video.css';

interface Props {
  companyId: number;
  store: any;
  data: {
    videoId?: number;
  }
  classes: any
  onRequestLogin: () => void;
}

interface State {
  videoId?: number;
}


const MarketPlaceVideoStyled = themify(
  MarketplaceVideoDataProvider(MarketplaceVideo)
);

const MarketplaceVideoDetailStyled = themify(
  MarketplaceVideoDetailDataProvider(MarketplaceVideoDetail)
);


class VODWidget extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      videoId: props.data.videoId,
    };
  }

  openVideo = (videoId: number) => {
    this.setState({ videoId });
  };

  onRequestBuyPass = () => {

  }

  render() {
    return (
      <div className={this.props.classes.container}>
        {this.state.videoId === undefined && (
          <MarketPlaceVideoStyled
            companyId={this.props.companyId}
            companyName=""
            openVideo={this.openVideo}
            searchParams={{
              coaches: "",
              duration_second_range: "",
              SCTs: "",
              search: "",
              levels: "",
            }}
            store={this.props.store}
          />
        )}

        {this.state.videoId !== undefined && (
          <div className={this.props.classes.videoContainer}>
            <ButtonBase onClick={() => {
              this.setState({ videoId: undefined });
            }}
            >
              <ChevronLeftIcon
                className={this.props.classes.icon}
                fontSize="large"
              />
            </ButtonBase>

            <div className={this.props.classes.videoDetail}>
            <MarketplaceVideoDetailStyled
              companyId={this.props.companyId}
              videoId={this.state.videoId}
              companyName=""
              requestSignUp={this.props.onRequestLogin}
              onRequestBuyPass={this.onRequestBuyPass}
              openVideo={this.openVideo}
              searchParams={{
                coaches: "",
                duration_second_range: "",
                SCTs: "",
                search: "",
                levels: "",
              }}
              store={this.props.store}
            />
            </div>
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
  },
  videoContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
  },
  videoDetail: {
    display: 'block',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});

export default compose(
  // @ts-ignore
  withStyles(styles)
)(VODWidget);
