import React from 'react';

import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import type { ImmutableArray, ImmutableObject } from 'seamless-immutable';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/styles';
// @ts-expect-error
import SmartListSelector from '#src/libs/smart-list/components/SmartListSelector.component';
import type { SmartList } from '#src/libs/smart-list/types';
import type { Link, LinkApi, ActiveCampaignList } from '../types';

type OuterProps = {
  open: boolean;
  smartLists: ImmutableArray<SmartList>;
  link: ImmutableObject<Link>;
  updateLink: (
    data: Pick<LinkApi, 'smartlist' | 'active_campaign_list'>,
  ) => void;
  onCancel: () => void;
  activeCampaignLists: ActiveCampaignList[];
};
type InnerProps = WithStyles<typeof styles> & WithTranslation;

type Props = OuterProps & InnerProps;

type State = Pick<LinkApi, 'smartlist' | 'active_campaign_list'>;
const ACTIVE_CAMPAIGN_LIST_SELECTION = '-1';

export class ActiveCampaignLinkForm extends React.Component<Props, State> {
  state = {
    smartlist: this.props.link?.smartlist?.id ?? null,
    active_campaign_list:
      this.props.link?.active_campaign_list || ACTIVE_CAMPAIGN_LIST_SELECTION,
  };

  onCancel = () => {
    this.setState({
      smartlist: null,
      active_campaign_list: ACTIVE_CAMPAIGN_LIST_SELECTION,
    });
    this.props.onCancel();
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.link && this.props.link !== prevProps.link) {
      this.setState({
        smartlist: this.props.link?.smartlist?.id ?? null,
        active_campaign_list: this.props.link?.active_campaign_list || null,
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
            onSubmit={(ev) => {
              ev.preventDefault();
              updateLink({
                smartlist: this.state.smartlist,
                active_campaign_list: this.state.active_campaign_list,
              });
              this.onCancel();
            }}
            style={{
              minHeight: '400px',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <div>
              <SmartListSelector
                helperText={t('active_campaign.link.smartListSelection')}
                onChange={(newVal: Array<{ value: number; name: string }>) => {
                  if (newVal.length) {
                    this.setState({
                      smartlist: Number(newVal[newVal.length - 1].value),
                    });
                  } else {
                    this.setState({
                      smartlist: null,
                    });
                  }
                }}
                smartLists={smartLists}
                values={[this.state.smartlist]}
              />
              <div className={classes.formControl}>
                <FormControl className={classes.formControl}>
                  <Select
                    required
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                      this.setState({ active_campaign_list: ev.target.value })
                    }
                    value={this.state.active_campaign_list}
                  >
                    <MenuItem
                      key={ACTIVE_CAMPAIGN_LIST_SELECTION}
                      disabled
                      value={ACTIVE_CAMPAIGN_LIST_SELECTION}
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
                color="primary"
                disabled={
                  this.state.active_campaign_list ===
                    ACTIVE_CAMPAIGN_LIST_SELECTION || !this.state.smartlist
                }
                type="submit"
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

const styles = (theme: Theme) =>
  createStyles({
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

export default compose<InnerProps, OuterProps>(
  withStyles(styles),
  withTranslation('settings'),
)(ActiveCampaignLinkForm);
