// @flow
import React from 'react';

import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import MemberSearchModal from '../../member/components/MemberSearchModal.component';

type Props = {
  initial: *,

  src_member: Member,
  dst_member: ?Member,
  onSubmit: (data: *) => void,
  searchLoading: boolean,
  searchMembers: (string) => void,
  searchedMembers: Array<Member>,
  onCancel: () => void,

  classes: Object,
  t: TFunction,
  managerFormConfig: SignUpFormConfigDict,
};

type State = {
  src_name: string,
  dst_name: string,
};

export class RelationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      src_member: props.initial.src_member,
      share_email: false,
    };
    if (props.initial) {
      this.state = {
        src_name: props.initial.src_name,
        dst_name: props.initial.dst_name,
        src_member: props.initial.src_member,
        dst_member: props.initial.dst_member,
        share_email: !!props.initial.share_email,
      };
    }
  }

  onSubmit = (ev: SyntheticEvent<any>) => {
    ev.preventDefault();
    return this.props.onSubmit({
      id: this.props.initial.id,
      src_name: this.state.src_name,
      dst_name: this.state.dst_name,
      src_member: this.state.src_member.id,
      dst_member: this.state.dst_member.id,
      share_email: this.state.share_email,
    });
  };

  render() {
    const { t, classes } = this.props;

    if (!this.state.dst_member) {
      return (
        <MemberSearchModal
          open
          loading={this.props.searchLoading}
          searchMembers={this.props.searchMembers}
          searchedMembers={this.props.searchedMembers}
          onClose={this.props.onCancel}
          handlMemberSelected={(id, member) =>
            this.setState({ dst_member: member })
          }
          managerFormConfig={this.props.managerFormConfig}
        />
      );
    }

    return (
      <form onSubmit={this.onSubmit}>
        <Typography variant="h5" component="h4">
          {t('member.form.title')}
        </Typography>
        <div className={classes.field}>
          <div className={classes.row}>
            <Typography variant="subtitle2" inline>
              {this.state.src_member.name}
            </Typography>
          </div>
          <div className={classes.rightRow}>
            <div className={classes.nameSeparator}>{t('member.form.is')}</div>
            <TextField
              required
              value={this.state.src_name}
              onChange={(ev) => this.setState({ src_name: ev.target.value })}
              placeholder={t('member.form.src_name.placeholder')}
            />
          </div>
        </div>
        <div className={classes.field}>
          <div className={classes.row}>
            <Typography variant="subtitle2" inline>
              {this.state.dst_member.name}
            </Typography>
          </div>
          <div className={classes.rightRow}>
            <div className={classes.nameSeparator}>{t('member.form.is')}</div>
            <TextField
              required
              value={this.state.dst_name}
              onChange={(ev) => this.setState({ dst_name: ev.target.value })}
              placeholder={t('member.form.dst_name.placeholder')}
            />
          </div>
        </div>
        <div className={classes.field}>
          <FormControlLabel
            label={t('member.form.shareEmail')}
            control={
              <Checkbox
                onChange={(ev) =>
                  this.setState({ share_email: ev.target.checked })
                }
                checked={this.state.share_email}
              />
            }
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button onClick={this.props.onCancel}>
            {t('member.form.cancel')}
          </Button>
          <Button
            variant="primary"
            color="primary"
            type="submit"
            onClick={this.onSubmit}
          >
            {t('member.form.submit')}
          </Button>
        </div>
      </form>
    );
  }
}

const styles = (theme) => ({
  title: {
    paddingBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  nameSeparator: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  buttonContainer: {
    paddingTop: theme.spacing(2),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default compose(
  withTranslation(['relationship']),
  withStyles(styles),
)(RelationForm);
