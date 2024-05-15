import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withTranslation, WithTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import WarningIcon from '@material-ui/icons/Warning';

import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withProps } from 'recompose';
import HelpIcon from '@material-ui/icons/Help';
import Typography from '@material-ui/core/Typography';

import type { ThunkAction } from 'src/state/types';
import { createStyles, Theme } from '@material-ui/core';
import type { RootState } from 'src/reducers';
import type { ImmutableObject } from 'seamless-immutable';
import { getAllSmartList } from '#libs/smart-list/selectors';
import { createWebhook, deleteWebhook } from '#libs/active-campaign/api';
import {
  fetchSmartListBulk as fetchSmartListBulkAction,
  fetchAllSmartLists,
} from '#libs/smart-list/actions';
// @ts-expect-error
import withStayEvent from '#hocs/tracking/stay-event.hoc';
import ActiveCampaignLinkForm from '#libs/active-campaign/components/ActiveCampaignLinkForm.component';
import ActiveCampaignWebhooks from '#libs/active-campaign/components/ActiveCampaignWebhooks.component';
import ActiveCampaignAccountForm from '#libs/active-campaign/components/ActiveCampaignAccountForm.component';
import ActiveCampaignLinks from '#libs/active-campaign/components/ActiveCampaignLinks.component';
import {
  fetchActiveCampaignAccount,
  updateActiveCampaignAccount,
  createActiveCampaignAccount,
  fetchActiveCampaignLinks as fetchActiveCampaignLinksAction,
  updateActiveCampaignLinks,
  deleteActiveCampaignLinks,
  createActiveCampaignLinks,
  getActiveCampaignLists,
  getActiveCampaignWebhooks,
} from '#libs/active-campaign/actions';
import {
  withSmartlist,
  getActiveCampaignLinks,
  getAccount,
} from '#libs/active-campaign/selectors';

import { snackbarSuccess, snackbarError } from '#libs/snackbar/actions';
import withTitle from '#hocs/with-title.hoc';
import type { Link, Account } from '#libs/active-campaign/types';

type Props = ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

type State = {
  selected: ImmutableObject<Link> | null;
  openForm: boolean;
  openHelpModal: boolean;
  openEditAccount: boolean;
  webhookLoading: string | null;
  openListInfoModal: boolean;
  openWebhookInfoModal: boolean;
};

export class ActiveCampaignPage extends React.Component<Props, State> {
  state: State = {
    selected: null,
    openForm: false,
    openHelpModal: false,
    openEditAccount: false,
    webhookLoading: null,
    openListInfoModal: false,
    openWebhookInfoModal: false,
  };

  componentDidMount() {
    this.props.getSmartLists();
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
        onClose={() => this.setState({ openHelpModal: false })}
        open={this.state.openHelpModal}
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
        onClose={() => this.setState({ openListInfoModal: false })}
        open={this.state.openListInfoModal}
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
        onClose={() => this.setState({ openWebhookInfoModal: false })}
        open={this.state.openWebhookInfoModal}
      >
        <DialogTitle>{t('active_campaign.webhooks.helpTitle')}</DialogTitle>
        <DialogContent>
          {t('active_campaign.webhooks.helpContent')}
        </DialogContent>
      </Dialog>
    );
  };

  handleWebhookActive = async (hook: string) => {
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
    const isdisabled: boolean = !this.props.account;

    return (
      <div className={classes.container}>
        {this.renderAccountInfos()}
        <ActiveCampaignLinks
          activeCampaignLists={this.props.activeCampaignLists}
          disabled={isdisabled}
          links={this.props.links}
          loading={
            this.props.linkLoading || this.props.activeCampaignListsLoading
          }
          onClickAdd={() => {
            this.props.getSmartLists();
            this.setState({ openForm: true });
          }}
          onClickDelete={(id: number) =>
            this.props.deleteActiveCampaignLinks(id)
          }
          onClickEdit={(link) => {
            this.props.getSmartLists();
            this.setState({
              selected: link,
              openForm: true,
            });
          }}
          onClickInfo={() => this.setState({ openListInfoModal: true })}
        />
        <ActiveCampaignWebhooks
          disabled={isdisabled}
          handleWebhookActive={this.handleWebhookActive}
          onClickInfo={() => this.setState({ openWebhookInfoModal: true })}
          webhookLoading={this.state.webhookLoading}
          webhooks={this.props.webhooks}
        />
        <ActiveCampaignLinkForm
          activeCampaignLists={this.props.activeCampaignLists}
          link={this.state.selected}
          onCancel={() =>
            this.setState({
              selected: null,
              openForm: false,
            })
          }
          open={this.state.openForm}
          smartLists={this.props.smartLists}
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
        />
        <ActiveCampaignAccountForm
          account={this.props.account}
          onCancel={() => this.setState({ openEditAccount: false })}
          open={this.state.openEditAccount}
          updateAccount={(data: Account) => {
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
                  onSuccess: (account) =>
                    this.props.getActiveCampaignLists(account),
                },
              );
            }
          }}
        />

        {this.renderAccountHelpModal()}
        {this.renderLinksHelpModal()}
        {this.renderWebhooksHelpModal()}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
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

const connector = connect(
  (state: RootState) => ({
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
);

export default compose<Props, ThunkAction>(
  withStayEvent('active-campaign', [10, 30, 90]),
  connector,
  withProps(({ fetchActiveCampaignLinks, fetchSmartListBulk }) => ({
    fetchActiveCampaignLinks: () =>
      fetchActiveCampaignLinks({
        onSuccess: (links: Link[]) => {
          fetchSmartListBulk(links.map((link) => link.smartlist));
        },
      }),
  })),
  withStyles(styles),
  withTranslation('settings'),
  withTitle(({ t }) => t('tab.active_campaign')),
)(ActiveCampaignPage);
