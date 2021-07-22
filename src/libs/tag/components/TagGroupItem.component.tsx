import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import MenuIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import ButtonBase from '@material-ui/core/ButtonBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu/Menu';
import Dialog from '@material-ui/core/Dialog';
import LabelIcon from '@material-ui/icons/Label';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import TableContainer from '@material-ui/core/TableContainer';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import { FormControl } from '@material-ui/core';
import { Tag, TagGroup } from '../types';
import { DeepPartial, MaterialStyleType } from '../../../utils/types';
import { showDeleteDialog } from '../../../components/GenericDialog/CustomDialogs';

type OwnProps = {
  tagGroup: TagGroup;
  filterBy: 'member' | 'coupon' | 'smartlist';

  onUpdateTagGroup: (tagGroup: TagGroup) => void;
  onDeleteTagGroup: (tagGroup: TagGroup) => void;

  onCreateTag: (tag: DeepPartial<Tag>) => void;
  onUpdateTag: (tag: Tag) => void;
  onDeleteTag: (tag: Tag) => void;

  onSelectTag: (tag: Tag) => void;
  selectedTag: Tag;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

interface State {
  expand: boolean;
  anchorEl: any;
  name: string | null;
  createTag: string | null;
  editTag: Tag | null;

  loadingEdit: boolean;
}

class TagGroupItem extends React.PureComponent<Props, State> {
  state: State = {
    expand: true,
    anchorEl: null,
    name: null,
    createTag: null,
    editTag: null,

    loadingEdit: false,
  };

  onClickExpand = () => {
    this.setState((prevState: State) => ({
      expand: !prevState.expand,
    }));
  };

  onClickShowMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeShowMore = () => {
    this.setState({ anchorEl: null });
  };

  onClickRenameTagGroup = () => {
    this.setState({ name: this.props.tagGroup.name });
    this.closeShowMore();
  };

  onClickDeleteTagGroup = async () => {
    const { t } = this.props;
    this.closeShowMore();
    const shouldDelete = await showDeleteDialog(
      t('management.deleteTagGroupDialog.title'),
      t('management.deleteTagGroupDialog.text'),
    );

    shouldDelete && this.props.onDeleteTagGroup(this.props.tagGroup);
  };

  submitRenameTagGroup = async (ev: React.FormEvent) => {
    ev.preventDefault();
    await this.props.onUpdateTagGroup({
      ...this.props.tagGroup,
      name: this.state.name,
    });

    this.setState({ name: null });
  };

  onSubmitNewTag = async (ev: React.FormEvent) => {
    ev.preventDefault();
    this.setState({ loadingEdit: true });
    await this.props.onCreateTag({
      name: this.state.createTag,
      group: this.props.tagGroup.id,
    });
    this.setState({ loadingEdit: false, createTag: null });
  };

  onSubmitEditTag = async (ev: React.FormEvent) => {
    ev.preventDefault();
    this.setState({ loadingEdit: true });
    await this.props.onUpdateTag(this.state.editTag);
    this.setState({ loadingEdit: false, editTag: null });
  };

  onClickDeleteTag = async (tag: Tag) => {
    const { t } = this.props;
    const shouldDelete = await showDeleteDialog(
      t('management.deleteTagDialog.title'),
      t('management.deleteTagDialog.text'),
    );

    shouldDelete && this.props.onDeleteTag(tag);
  };

  getTagUsage = (tagId: number) => {
    const usage = this.props.tagUsageById[tagId];
    if (!usage) return '-';
    switch (this.props.filterBy) {
      case 'member':
        return `${usage.member_count}/${usage.member_total_count}`;
      case 'smartlist':
        return usage.autotagrule_count;
      default:
        return null;
    }
  };

  render() {
    const { classes, tagGroup, t } = this.props;

    return (
      <div className={classes.tagGroup}>
        <div className={classes.tagGroupHeader}>
          <Typography variant="h4">{tagGroup.name}</Typography>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={() => this.setState({ createTag: '' })}
              size="small"
            >
              <AddIcon color="primary" />
            </IconButton>

            <IconButton
              aria-controls={`tag-group-header-menu${tagGroup.id}`}
              onClick={this.onClickShowMore}
            >
              <MoreVertIcon />
            </IconButton>

            <IconButton onClick={this.onClickExpand}>
              {this.state.expand ? <ExpandMoreIcon /> : <ExpandLess />}
            </IconButton>

            <Menu
              id={`tag-group-header-menu${tagGroup.id}`}
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.closeShowMore}
            >
              <MenuItem onClick={() => this.setState({ createTag: '' })}>
                <MenuIcon>
                  <AddIcon />
                </MenuIcon>
                {t('management.addTag')}
              </MenuItem>
              <MenuItem onClick={this.onClickRenameTagGroup}>
                <MenuIcon>
                  <EditIcon />
                </MenuIcon>
                {t('management.rename')}
              </MenuItem>

              <MenuItem onClick={this.onClickDeleteTagGroup}>
                <MenuIcon>
                  <DeleteIcon />
                </MenuIcon>
                {t('management.delete')}
              </MenuItem>
            </Menu>
          </div>
        </div>

        <Collapse in={this.state.expand}>
          <TableContainer component={Paper}>
            <Table
              size="small"
              className={classes.tableContainer}
              aria-label="simple table"
            >
              {!!this.props.tagGroup.tags.length && (
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <div className={classes.row}>
                        <LabelIcon
                          color="disabled"
                          size="small"
                          className={classes.leftIcon}
                        />
                        {t('management.tagColumn.tag')}
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      {t(`management.tagColumn.${this.props.filterBy}_count`)}
                    </TableCell>
                    <TableCell align="right">
                      {t('management.tagColumn.actions')}
                    </TableCell>
                  </TableRow>
                </TableHead>
              )}
              <TableBody>
                {this.state.createTag !== null && (
                  <TableRow key="create">
                    <TableCell
                      component="th"
                      scope="row"
                      className={classes.addRow}
                    >
                      <form onSubmit={this.onSubmitNewTag}>
                        <TextField
                          required
                          placeholder={t('management.form.tagGroupName')}
                          value={this.state.createTag}
                          onChange={(ev) =>
                            this.setState({ createTag: ev.target.value })
                          }
                        />

                        {this.state.loadingEdit ? (
                          <CircularProgress
                            size={26}
                            className={classes.addLoader}
                          />
                        ) : (
                          <>
                            <ButtonBase
                              className={classes.addRowButton}
                              type="submit"
                            >
                              <SaveIcon color="primary" />
                            </ButtonBase>

                            <ButtonBase
                              className={classes.addRowButton}
                              onClick={() => this.setState({ createTag: null })}
                            >
                              <CancelIcon />
                            </ButtonBase>
                          </>
                        )}
                      </form>
                    </TableCell>
                    <TableCell align="right" />
                  </TableRow>
                )}
                {this.props.tagGroup.tags.map((tag: Tag) =>
                  this.state.editTag && this.state.editTag.id === tag.id ? (
                    <TableRow key={`edit${tag.id}`}>
                      <TableCell
                        component="th"
                        scope="row"
                        className={classes.addRow}
                      >
                        <form onSubmit={this.onSubmitEditTag}>
                          <TextField
                            required
                            placeholder={t('management.form.tagGroupName')}
                            value={this.state.editTag.name}
                            onChange={(ev) => {
                              this.setState({
                                editTag: {
                                  ...tag,
                                  name: ev.target.value,
                                },
                              });
                            }}
                          />

                          {this.state.loadingEdit ? (
                            <CircularProgress
                              size={26}
                              className={classes.addLoader}
                            />
                          ) : (
                            <>
                              <IconButton
                                className={classes.addRowButton}
                                type="submit"
                              >
                                <SaveIcon color="primary" />
                              </IconButton>

                              <IconButton
                                className={classes.addRowButton}
                                onClick={() => this.setState({ editTag: null })}
                              >
                                <CancelIcon />
                              </IconButton>
                            </>
                          )}
                        </form>
                      </TableCell>
                      <TableCell align="right" />
                      <TableCell align="right" />
                    </TableRow>
                  ) : (
                    <TableRow
                      key={tag.id}
                      className={
                        this.props.selectedTag &&
                        this.props.selectedTag.id === tag.id
                          ? classes.selectedTag
                          : ''
                      }
                      hover
                      onClick={(ev) => {
                        ev.preventDefault();
                        this.props.onSelectTag(tag);
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="subtitle2">{tag.name}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        {this.getTagUsage(tag.id)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          className={classes.tagButton}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            this.setState({ editTag: tag });
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={(ev) => {
                            ev.stopPropagation();
                            this.onClickDeleteTag(tag);
                          }}
                          className={classes.tagButton}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={(ev) => {
                            ev.stopPropagation();
                            this.props.onSelectTag(tag);
                          }}
                          className={classes.tagButton}
                        >
                          <ArrowForwardIcon color="primary" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {!this.props.tagGroup.tags.length && (
            <Typography color="textSecondary">
              {t('management.form.tagGroupEmpty')}
            </Typography>
          )}
        </Collapse>

        <Dialog open={this.state.name !== null}>
          <DialogTitle>{t('management.form.groupRename')}</DialogTitle>
          <DialogContent>
            <form onSubmit={this.submitRenameTagGroup}>
              <FormControl>
                <TextField
                  label={t('management.form.tagGroupName')}
                  variant="outlined"
                  onChange={(ev) => this.setState({ name: ev.target.value })}
                  value={this.state.name}
                  required
                />
              </FormControl>

              <DialogActions className={classes.dialogActions}>
                <Button onClick={() => this.setState({ name: null })}>
                  {t('management.cancel')}
                </Button>
                <Button
                  variant="outlined"
                  disabled={!this.state.name}
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
  tagGroup: {
    marginTop: theme.spacing(2),
  },
  tagGroupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#AAA',
    borderStyle: 'solid',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  tagGroupActions: {
    display: 'flex',
  },
  tableContainer: {
    width: '100%',
  },
  addRow: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  addRowButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '100%',
  },
  addLoader: {
    marginLeft: theme.spacing(2),
  },
  dialogActions: {
    marginTop: theme.spacing(1),
  },
  tagButton: {
    padding: theme.spacing(1),
    borderRadius: '100%',
  },
  selectedTag: {
    backgroundColor: '#EFEFEF',
  },
  leftIcon: {
    marginRight: theme.spacing(0.5),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['tag']),
)(TagGroupItem);
