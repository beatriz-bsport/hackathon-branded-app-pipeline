import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InfoIcon from '@material-ui/icons/Info';
import TextField from '@material-ui/core/TextField';
import { TAG_KIND_MEMBER } from '@bsport/common/lib/master-data/tag';

import TagGroupItem from './TagGroupItem.component';
import { Tag, TagGroup } from '../types';
import { DeepPartial, MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  tagGroupList: TagGroup[];
  onCreateOrUpdateTagGroup: (tagGroup: DeepPartial<TagGroup>) => void;
  onDeleteTagGroup: (tagGroup: DeepPartial<TagGroup>) => void;

  onCreateOrUpdateTag: (tag: DeepPartial<Tag>) => void;
  onDeleteTag: (tag: DeepPartial<Tag>) => void;
  onSelectTag: (tag: Tag) => void;
  selectedTag: Tag;
};

interface State {
  createTag: string | null;
}

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class TagGroupList extends React.PureComponent<Props> {
  state: State = {
    createTag: null,
  };

  onSubmitCreateTagGroup = (ev: React.FormEvent) => {
    ev.preventDefault();
    this.props.onCreateOrUpdateTagGroup({
      name: this.state.createTag,
      kind: TAG_KIND_MEMBER.id,
    });
    this.setState({ createTag: null });
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.container}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => this.setState({ createTag: '' })}
        >
          {t('management.addGroup')}
        </Button>

        {this.props.tagGroupList.map((tagGroup) => (
          <TagGroupItem
            key={tagGroup.id}
            filterBy={this.props.tagKind}
            tagGroup={tagGroup}
            tagUsageById={this.props.tagUsageById}
            onUpdateTagGroup={this.props.onCreateOrUpdateTagGroup}
            onDeleteTagGroup={this.props.onDeleteTagGroup}
            onCreateTag={this.props.onCreateOrUpdateTag}
            onUpdateTag={this.props.onCreateOrUpdateTag}
            onDeleteTag={this.props.onDeleteTag}
            onSelectTag={this.props.onSelectTag}
            selectedTag={this.props.selectedTag}
          />
        ))}

        <Dialog open={this.state.createTag !== null}>
          <DialogTitle>{t('management.createGroupDialog.title')}</DialogTitle>
          <DialogContent>
            <form onSubmit={this.onSubmitCreateTagGroup}>
              <FormControl>
                <TextField
                  label={t('management.createGroupDialog.field')}
                  variant="outlined"
                  onChange={(ev) =>
                    this.setState({ createTag: ev.target.value })
                  }
                  value={this.state.createTag}
                  required
                />

                <div className={classes.dialogHelperContainer}>
                  <InfoIcon />
                  <Typography className={classes.dialogHelperText}>
                    {t('management.createGroupDialog.helper')}
                  </Typography>
                </div>
              </FormControl>

              <DialogActions className={classes.dialogActions}>
                <Button onClick={() => this.setState({ createTag: null })}>
                  {t('management.cancel')}
                </Button>
                <Button
                  variant="contained"
                  disabled={!this.state.createTag}
                  color="primary"
                  type="submit"
                >
                  {t('management.submit')}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
  },
  tagGroup: {
    marginTop: theme.spacing(2),
  },
  tagGroupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderStyle: 'solid',
    paddingBottom: theme.spacing(1),
  },
  tagGroupActions: {
    display: 'flex',
  },
  headerButton: {
    borderRadius: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  dialogActions: {
    marginTop: theme.spacing(1),
  },
  dialogHelperContainer: {
    display: 'flex',
    marginTop: theme.spacing(1),
    alignItems: 'center',
  },
  dialogHelperText: {
    marginLeft: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['tag']),
)(TagGroupList);
