import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';

import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withStyles, Theme } from '@material-ui/core/styles';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { WithHandlerType, MaterialStyleType } from '../../utils/types';

import {
  getCampaignBySmartlist,
  getAutomatedCampaignBySmartlist,
  withAutomatedCampaign,
} from '../../libs/communication/selectors';

import {
  fetchCampaignSmartlist,
  fetchCampaignSmartlistAutomated,
} from '../../libs/communication/actions';
import { fetchSmartListAutomatedCampaign } from '#libs/smart-list/actions';

import { RootState } from '../../reducers';
import CampaignList from '../../libs/communication/components/CampaignList.component';

type OwnProps = {
  id: number;
};

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = OwnProps &
  OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  StateHandlerType &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export class SmartListCampaign extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCampaignSmartlist(1);
    this.props.fetchCampaignSmartlistAutomated(1);
    this.props.fetchSmartListAutomatedCampaign({ page_size: 100 });
  }

  render() {
    const {
      t,
      classes,
      openManualCampaignSection,
      setOpenManualCampaignSection,
      openAutomatedCampaignSection,
      setOpenAutomatedCampaignSection,
    } = this.props;
    return (
      <div className={classes.container}>
        <ButtonBase
          onClick={() =>
            setOpenAutomatedCampaignSection(!openAutomatedCampaignSection)
          }
          className={classes.flexHeader}
        >
          <Typography
            variant="h5"
            color={openAutomatedCampaignSection ? 'inherit' : 'textSecondary'}
          >
            {t('campaign.automatedTitle')}
          </Typography>

          {openAutomatedCampaignSection ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ButtonBase>
        <Divider className={classes.divider} />
        <Collapse in={openAutomatedCampaignSection}>
          <CampaignList
            campaignList={this.props.automatedCampaignList.map((c) => [
              c,
              null,
            ])}
            loading={this.props.loading}
            onClickReport={this.props.goToCampaignReport}
            fetchMore={
              this.props.automatedCampaignState.next_page
                ? () =>
                    this.props.fetchCampaignSmartlistAutomated(
                      this.props.automatedCampaignState.next_page,
                    )
                : null
            }
          />
        </Collapse>
        <ButtonBase
          onClick={() =>
            setOpenManualCampaignSection(!openManualCampaignSection)
          }
          className={classes.flexHeader}
        >
          <div className={classes.title}>
            <Typography
              variant="h5"
              color={openManualCampaignSection ? 'inherit' : 'textSecondary'}
            >
              {t('campaign.manualTitle')}
            </Typography>
          </div>

          {openManualCampaignSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ButtonBase>
        <Divider className={classes.divider} />
        <Collapse in={openManualCampaignSection}>
          <CampaignList
            campaignList={this.props.campaignList.map((c) => [c, null])}
            loading={this.props.loading}
            onClickReport={this.props.goToCampaignReport}
            fetchMore={
              this.props.campaignState.next_page
                ? () =>
                    this.props.fetchCampaignSmartlist(
                      this.props.campaignState.next_page,
                    )
                : null
            }
          />
        </Collapse>
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    campaignList: getCampaignBySmartlist(state),
    automatedCampaignList: withAutomatedCampaign(
      getAutomatedCampaignBySmartlist,
    )(state),
    campaignState: state.communication.campaign.bySmartlist,
    automatedCampaignState: state.communication.automatedCampaign.bySmartlist,
    loading: state.communication.campaign.bySmartlist.loading,
  }),
  {
    fetchCampaignSmartlist,
    fetchCampaignSmartlistAutomated,
    fetchSmartListAutomatedCampaign,
    push,
  },
);

const mapWithHandlers = {
  fetchCampaignSmartlist: (props: OwnAndConnectedProps) => (page: number) => {
    props.fetchCampaignSmartlist(props.id, page);
  },
  fetchCampaignSmartlistAutomated:
    (props: OwnAndConnectedProps) => (page: number) => {
      props.fetchCampaignSmartlistAutomated(props.id, page);
    },
  goToCampaignReport:
    (props: OwnAndConnectedProps) => (campaign_uuid: string) => {
      props.push(`/smart-list/${props.id}/campaign/${campaign_uuid}/`);
    },
};

const withStateHandlersInit = {
  openManualCampaignSection: true,
  openAutomatedCampaignSection: true,
};

const withStateHandlersSetter = {
  setOpenManualCampaignSection: () => (openManualCampaignSection: boolean) => {
    return { openManualCampaignSection };
  },
  setOpenAutomatedCampaignSection:
    () => (openAutomatedCampaignSection: boolean) => {
      return { openAutomatedCampaignSection };
    },
};

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  flexHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  // @ts-ignore
  withStyles(styles),
  withTranslation('communication'),
  connector,
  withHandlers(mapWithHandlers),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(SmartListCampaign);
