// @flow

import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SmartListSelector from '../../smart-list/components/SmartListSelector.component';

type Props = {
  open: boolean,
  smartLists: Array<any>,
  t: TFunction,
  classes: Object,
  link: Link,
  updateLink: (data: any) => void,
  onCancel: () => void,
  activeCampaignLists: Array<any>,
};

const ACTIVE_CAMPAIGN_LIST_SELECTION = -1;

export class ActiveCampaignFormDialog extends React.Component<Props, State> {
  state = {
    smartlist:
      this.props.link && this.props.link.smartlist
        ? this.props.link.smartlist.id
        : null,
    active_campaign_list:
      this.props.link && this.props.link.active_campaign_list
        ? this.props.link.active_campaign_list
        : ACTIVE_CAMPAIGN_LIST_SELECTION,
  };

  onCancel = () => {
    this.setState({
      smartlist: null,
      active_campaign_list: ACTIVE_CAMPAIGN_LIST_SELECTION,
    });
    this.props.onCancel();
  };

  componentDidUpdate(prevProps) {
    if (this.props.link && this.props.link !== prevProps.link) {
      // eslint-disable-next-line
      this.setState({
        smartlist: this.props.link.smartlist.id,
        active_campaign_list: this.props.link.active_campaign_list,
      });
    }
  }

  render() {
    const { open, smartLists, t, classes, updateLink, activeCampaignLists } =
      this.props;
    return (
      <Dialog open={open}>
        <DialogTitle id="dialog-title">
          {t('active_campaign.link.dialogTitle')}
        </DialogTitle>
        <DialogContent>
          <div className={classes.helperText}>
            {t('active_campaign.link.helperForm')}
          </div>

          <form
            style={{
              minHeight: '400px',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
            onSubmit={(ev) => {
              ev.preventDefault();
              updateLink({
                smartlist: this.state.smartlist,
                active_campaign_list: this.state.active_campaign_list,
              });
              this.onCancel();
            }}
          >
            <div>
              <SmartListSelector
                smartLists={smartLists}
                values={[this.state.smartlist]}
                onChange={(ev) => {
                  if (ev.length) {
                    this.setState({
                      smartlist: ev[ev.length - 1].value,
                    });
                  } else {
                    this.setState({
                      smartlist: null,
                    });
                  }
                }}
                helperText={t('active_campaign.link.smartListSelection')}
              />
              <div className={classes.formControl}>
                <FormControl className={classes.formControl}>
                  <Select
                    className={classes.input}
                    required
                    value={this.state.active_campaign_list}
                    onChange={(ev) =>
                      this.setState({ active_campaign_list: ev.target.value })
                    }
                  >
                    <MenuItem
                      key={ACTIVE_CAMPAIGN_LIST_SELECTION}
                      value={ACTIVE_CAMPAIGN_LIST_SELECTION}
                      disabled
                    >
                      {t('active_campaign.link.listActiveCampaignSelection')}
                    </MenuItem>
                    {activeCampaignLists.map((item) => (
                      <MenuItem key={item} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <DialogActions>
              <Button color="secondary" onClick={this.onCancel}>
                {t('active_campaign.cancel')}
              </Button>
              <Button
                type="submit"
                color="primary"
                disabled={
                  this.state.active_campaign_list ===
                    ACTIVE_CAMPAIGN_LIST_SELECTION || !this.state.smartlist
                }
              >
                {t('active_campaign.submit')}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  textField: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  helperText: {
    marginBottom: theme.spacing(2),
  },
  dialog: {
    minHeight: '400px',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['settings']),
)(ActiveCampaignFormDialog);
