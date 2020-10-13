// @flow
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import WarningIcon from '@material-ui/icons/Warning';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

type Props = {
  classes: Object,
  members: Array<Member>,
  keyword: string,
  t: TFunction,
  receiversNotEditable: boolean,
  checkedMembers: Array<number>,
  handleToggle: (id: number) => void,
  openMemberPage: () => void,
  loading: boolean,
  fetchPreviousPage: () => void,
  fetchNextPage: () => void,
  page: number,
  page_size: number,
  membersCount: number,
  membersByPageLoading: boolean,
};

export class ReceiversItem extends Component<Props> {
  state = {
    displayReceiverList: false,
  };

  render() {
    const { t, classes, membersCount } = this.props;
    return (
      <div>
        <ListItem
          button
          onClick={() =>
            this.setState((previousState) => ({
              displayReceiverList: !previousState.displayReceiverList,
            }))
          }
        >
          <PersonIcon color="action" className={classes.iconMargin} />
          {this.props.loading ? (
            <CircularProgress size={30} />
          ) : (
            <div className={classes.itemContainer}>
              <div className={classes.inline}>
                <ListItemText
                  primary={`${t('recipients')} (${Object.keys(
                    this.props.checkedMembers,
                  ).length.toString()}/${membersCount})`}
                />
                {Object.keys(this.props.checkedMembers).length ===
                membersCount ? null : (
                  <WarningIcon className={classes.iconMargin} color="error" />
                )}
              </div>
              {this.state.displayReceiverList ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </div>
          )}
        </ListItem>
        <Divider />
        <Collapse in={this.state.displayReceiverList}>
          {this.props.membersByPageLoading
            ? this.props.members.map((member, index) => {
                if (index === parseInt(this.props.page_size / 2, 10)) {
                  return (
                    <div className={this.props.classes.loadingContainer}>
                      <CircularProgress />
                    </div>
                  );
                }

                return <div className={this.props.classes.blankDiv} />;
              })
            : this.props.members.map((member) => (
                <ListItem key={member.id}>
                  <ListItemText
                    id={member.id}
                    primary={member.name}
                    secondary={
                      member[this.props.keyword] ? (
                        member[this.props.keyword]
                      ) : (
                        <div>
                          {this.props.keyword === 'email'
                            ? t('mail.mailMissing')
                            : t('mail.phoneMissing')}
                          <Button
                            onClick={(event) =>
                              this.props.openMemberPage(event, member.id)
                            }
                          >
                            <EditIcon />
                          </Button>
                        </div>
                      )
                    }
                    secondaryTypographyProps={{
                      color: member[this.props.keyword] ? '' : 'error',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      disabled={
                        !member[this.props.keyword] ||
                        this.props.receiversNotEditable
                      }
                      onChange={this.props.handleToggle(member.id)}
                      checked={
                        member[this.props.keyword]
                          ? this.props.checkedMembers.indexOf(member.id) !== -1
                          : false
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          {this.props.page ? (
            <div>
              <div className={classes.itemContainer}>
                <IconButton onClick={this.props.fetchPreviousPage}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography variant="subtitle2">
                  {`Page ${this.props.page}/${parseInt(
                    membersCount / this.props.page_size,
                    10,
                  ) + 1}`}
                </Typography>
                <IconButton onClick={this.props.fetchNextPage}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </div>
              <Divider />
            </div>
          ) : null}
        </Collapse>
      </div>
    );
  }
}

const styles = (theme) => ({
  iconMargin: {
    marginRight: theme.spacing.unit * 2,
  },
  inline: { display: 'flex', alignItems: 'center' },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  blankDiv: {
    minHeight: theme.spacing.unit * 8.5,
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: theme.spacing.unit * 8,
  },
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(ReceiversItem);
