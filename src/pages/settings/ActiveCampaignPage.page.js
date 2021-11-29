// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withTranslation, TFunction } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import WarningIcon from '@material-ui/icons/Warning';

import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';

import { getAllSmartList } from '../../libs/smart-list/selectors';
import { createWebhook, deleteWebhook } from '../../libs/active-campaign/api';
import {
  fetchSmartListBulk as fetchSmartListBulkAction,
  fetchAllSmartLists,
} from '../../libs/smart-list/actions';
import withStayEvent from '../../hocs/tracking/stay-event.hoc';
import ActiveCampaignLinkForm from '../../libs/active-campaign/components/ActiveCampaignLinkForm.component';
import ActiveCampaignWebhooks from '../../libs/active-campaign/components/ActiveCampaignWebhooks.component';
import ActiveCampaignAccountFormDialog from '../../libs/active-campaign/components/ActiveCampaignAccountForm.component';
import ActiveCampaignLinks from '../../libs/active-campaign/components/ActiveCampaignLinks.component';

import {
  fetchActiveCampaignAccount,
  updateActiveCampaignAccount,
  deleteActiveCampaignAccount,
  createActiveCampaignAccount,
  fetchActiveCampaignLinks as fetchActiveCampaignLinksAction,
  updateActiveCampaignLinks,
  deleteActiveCampaignLinks,
  createActiveCampaignLinks,
  getActiveCampaignLists,
  getActiveCampaignWebhooks,
} from '../../libs/active-campaign/actions';
import {
  withSmartlist,
  getActiveCampaignLinks,
  getAccount,
} from '../../libs/active-campaign/selectors';
import { snackbarSuccess, snackbarError } from '../../libs/snackbar/actions';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  loading: boolean,
  classes: any,
  activeCampaignLists: Array<any>,
  deleteActiveCampaignLinks: (id: number) => void,
  updateActiveCampaignLinks: (id: number, data: any) => void,
  createActiveCampaignLinks: (data: any) => void,
  t: TFunction,
  links: Array<any>,
  smartLists: Array<SmartList>,
  account: Object,
  getSmartLists: () => void,
  fetchActiveCampaignAccount: () => void,
  fetchActiveCampaignLinks: () => void,
  getActiveCampaignLists: () => void,
  updateActiveCampaignAccount: (id: number, data: any) => void,
  createActiveCampaignAccount: (data: any) => void,
  company_id: number,
  activeCampaignListsLoading: boolean,
  linkLoading: boolean,
  errorAccountInfo: number,

  // webhooks
  webhooks: Array<any>,
  getActiveCampaignWebhooks: (id: number) => void,
};

export class ActiveCampaignConfiguration extends Component<Props> {
  state = {
    selected: null,
    openForm: false,
    openHelpModal: false,
    openEditAccount: false,
    webhookLoading: null,
    openListInfoModal: false,
    openWebhookInfoModal: false,
  };

  componentDidMount() {
    this.props.fetchActiveCampaignAccount({
      onSuccess: (id) => {
        this.props.getActiveCampaignLists(id);
        this.props.getActiveCampaignWebhooks(id);
      },
    });
    this.props.fetchActiveCampaignLinks();
  }

  renderAccountInfos = () => {
    const { classes, t } = this.props;
    return (
      <div>
        <div className={classes.inline}>
          <Typography variant="h5">
            {this.props.t('active_campaign.account.title')}
          </Typography>
          <IconButton onClick={() => this.setState({ openHelpModal: true })}>
            <HelpIcon />
          </IconButton>
        </div>
        <Paper className={classes.accountInfosContainer}>
          <ListItem>
            <ListItemText
              primary={
                <div>
                  <div className={classes.accountInlineEdit}>
                    <Typography>
                      {`API url: ${
                        this.props.account ? this.props.account.api_url : ' '
                      }`}
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={() => this.setState({ openEditAccount: true })}
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                  <Typography className={classes.typoMargin}>
                    {`${this.props.t('active_campaign.account.token')}: ${
                      this.props.account ? this.props.account.token : ' '
                    }`}
                  </Typography>
                  {this.props.account && this.props.errorAccountInfo >= 300 ? (
                    <div className={classes.inlineError}>
                      <WarningIcon
                        className={classes.warningIcon}
                        color="error"
                      />
                      <Typography>
                        {t('active_campaign.account.error')}
                      </Typography>
                    </div>
                  ) : null}
                  {!this.props.account && (
                    <div className={classes.inlineError}>
                      <WarningIcon
                        className={classes.warningIcon}
                        color="secondary"
                      />
                      <Typography>
                        {t('active_campaign.account.empty')}
                      </Typography>
                    </div>
                  )}
                </div>
              }
            />
          </ListItem>
        </Paper>
      </div>
    );
  };

  renderAccountHelpModal = () => {
    const { t } = this.props;

    return (
      <Dialog
        open={this.state.openHelpModal}
        onClose={() => this.setState({ openHelpModal: false })}
      >
        <DialogTitle> {t('active_campaign.account.helpTitle')}</DialogTitle>
        <DialogContent>
          {t('active_campaign.account.helpContent')}
        </DialogContent>
      </Dialog>
    );
  };

  renderLinksHelpModal = () => {
    const { t } = this.props;

    return (
      <Dialog
        open={this.state.openListInfoModal}
        onClose={() => this.setState({ openListInfoModal: false })}
      >
        <DialogTitle>{t('active_campaign.link.helpTitle')}</DialogTitle>
        <DialogContent>{t('active_campaign.link.helpContent')}</DialogContent>
      </Dialog>
    );
  };

  renderWebhooksHelpModal = () => {
    const { t } = this.props;
    return (
      <Dialog
        open={this.state.openWebhookInfoModal}
        onClose={() => this.setState({ openWebhookInfoModal: false })}
      >
        <DialogTitle>{t('active_campaign.webhooks.helpTitle')}</DialogTitle>
        <DialogContent>
          {t('active_campaign.webhooks.helpContent')}
        </DialogContent>
      </Dialog>
    );
  };

  handleWebhookActive = async (hook) => {
    this.setState({ webhookLoading: hook });
    if (this.props.webhooks.items.find((webhook) => webhook.name === hook)) {
      await deleteWebhook(
        this.props.account.id,
        this.props.webhooks.items.find((webhook) => webhook.name === hook).id,
      );
    } else {
      await createWebhook(this.props.account.id, hook);
    }
    this.props.getActiveCampaignWebhooks(this.props.account.id, {
      onFinish: () => this.setState({ webhookLoading: null }),
    });
  };

  render() {
    const { classes } = this.props;
    if (this.props.loading) return <LinearProgress />;
    const isdisabled = !this.props.account ? 'disabled' : null;

    return (
      <div className={classes.container}>
        {this.renderAccountInfos()}
        <ActiveCampaignLinks
          disabled={isdisabled}
          onClickInfo={() => this.setState({ openListInfoModal: true })}
          onClickEdit={(link) => {
            this.props.getSmartLists();
            this.setState({
              selected: link,
              openForm: true,
            });
          }}
          onClickAdd={() => {
            this.props.getSmartLists();
            this.setState({ openForm: true });
          }}
          onClickDelete={(id) => this.props.deleteActiveCampaignLinks(id)}
          links={this.props.links}
          loading={
            this.props.linkLoading || this.props.activeCampaignListsLoading
          }
          activeCampaignLists={this.props.activeCampaignLists}
        />
        <ActiveCampaignWebhooks
          disabled={isdisabled}
          onClickInfo={() => this.setState({ openWebhookInfoModal: true })}
          webhookLoading={this.state.webhookLoading}
          webhooks={this.props.webhooks}
          handleWebhookActive={this.handleWebhookActive}
        />
        <ActiveCampaignLinkForm
          open={this.state.openForm}
          smartLists={this.props.smartLists}
          link={this.state.selected}
          activeCampaignLists={this.props.activeCampaignLists}
          updateLink={(data) => {
            if (this.state.selected) {
              this.props.updateActiveCampaignLinks(
                this.state.selected.id,
                data,
              );
            } else {
              this.props.createActiveCampaignLinks(data);
            }
          }}
          onCancel={() =>
            this.setState({
              selected: null,
              openForm: false,
            })
          }
        />
        <ActiveCampaignAccountFormDialog
          account={this.props.account}
          open={this.state.openEditAccount}
          updateAccount={(data) => {
            if (this.props.account) {
              this.props.updateActiveCampaignAccount(
                this.props.account.id,
                data,
                {
                  onSuccess: () =>
                    this.props.getActiveCampaignLists(this.props.account.id),
                },
              );
            } else {
              this.props.createActiveCampaignAccount(
                {
                  ...data,
                  company: this.props.company_id,
                },
                {
                  onSuccess: (id) => this.props.getActiveCampaignLists(id),
                },
              );
            }
          }}
          onCancel={() => this.setState({ openEditAccount: false })}
        />

        {this.renderAccountHelpModal()}
        {this.renderLinksHelpModal()}
        {this.renderWebhooksHelpModal()}
      </div>
    );
  }
}

const styles = (theme) => ({
  typoMargin: {
    marginTop: theme.spacing(1),
  },

  titleLink: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  inline: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  inlineError: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  warningIcon: { marginRight: theme.spacing(1) },
  accountInfosContainer: { paddingBottom: theme.spacing(2) },
  accountInlineEdit: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
});

export default compose(
  withStayEvent('active-campaign', [10, 30, 90]),
  connect(
    (state) => ({
      links: withSmartlist(getActiveCampaignLinks)(state),
      account: getAccount(state),
      accountLoading: state.activeCampaign.account.loading,
      linkLoading: state.activeCampaign.links.loading,
      activeCampaignLists: state.activeCampaign.links.lists,
      smartLists: getAllSmartList(state),
      company_id: state.theme.theme.company,
      activeCampaignListsLoading: state.activeCampaign.links.listsLoading,
      errorAccountInfo: state.activeCampaign.links.listsError,
      webhooks: {
        items: state.activeCampaign.account.webhooks.items,
        loading: state.activeCampaign.account.webhooks.loading,
      },
    }),
    {
      fetchActiveCampaignAccount,
      updateActiveCampaignAccount,
      deleteActiveCampaignAccount,
      createActiveCampaignAccount,
      fetchActiveCampaignLinks: fetchActiveCampaignLinksAction,
      updateActiveCampaignLinks,
      deleteActiveCampaignLinks,
      createActiveCampaignLinks,
      getActiveCampaignLists,
      getActiveCampaignWebhooks,
      fetchSmartListBulk: fetchSmartListBulkAction,
      getSmartLists: fetchAllSmartLists,
      testSuccess: snackbarSuccess,
      testError: snackbarError,
    },
  ),
  withProps(({ fetchActiveCampaignLinks, fetchSmartListBulk }) => ({
    fetchActiveCampaignLinks: () =>
      fetchActiveCampaignLinks({
        onSuccess: (links) => {
          fetchSmartListBulk(links.map((link) => link.smartlist));
        },
      }),
  })),
  withStyles(styles),
  withTranslation(['settings']),
  withTitle(({ t }) => t('tab.active_campaign')),
)(ActiveCampaignConfiguration);
