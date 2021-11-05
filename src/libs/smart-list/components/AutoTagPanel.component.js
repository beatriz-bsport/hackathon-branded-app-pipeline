// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import TagRuleListItem from './TagRuleListItem.component';

type Props = {
  t: TFunction,
  classes: any,
  smartlistAutoTagLoading: boolean,
  smartlistAutoTag: Array<any>,
  createAutoTag: (data: object) => void,
  deleteAutoTag: (id: number) => void,
  updateAutoTag: (id: number, data: object) => void,
  tags: Array<Tag>,
};

export class AutoTagPanel extends Component<Props> {
  state = {
    displayAutoTagRules: false,
    tagRuledefaultCreate: {
      tag: null,
      smartlist: null,
      kind: 1,
    },
  };

  render() {
    const { classes, t, smartlistAutoTag } = this.props;
    return (
      <div>
        <ButtonBase
          onClick={() =>
            this.setState((previousState) => ({
              displayAutoTagRules: !previousState.displayAutoTagRules,
            }))
          }
          className={this.props.classes.header}
        >
          {this.props.smartlistAutoTagLoading ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                style={{ marginRight: '10px' }}
                color={
                  this.state.displayAutoTagRules ? 'default' : 'textSecondary'
                }
              >
                {t('tag_rules.display_tag_rules')}
              </Typography>
              <CircularProgress size="1.5rem" />
            </div>
          ) : (
            <Typography
              variant="h6"
              color={
                this.state.displayAutoTagRules ? 'default' : 'textSecondary'
              }
            >
              {`${t('tag_rules.display_tag_rules')} (${
                smartlistAutoTag.length
              })`}
            </Typography>
          )}
          {this.state.displayAutoTagRules ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ButtonBase>
        <Divider className={this.props.classes.divider} />
        <Collapse in={this.state.displayAutoTagRules}>
          <Grid container spacing={2}>
            {smartlistAutoTag &&
              smartlistAutoTag.map((tagRule) => {
                return (
                  <Grid key={tagRule.id} item className={classes.tagPanel}>
                    <TagRuleListItem
                      tagRule={tagRule}
                      deleteAutoTag={this.props.deleteAutoTag}
                      updateAutoTag={this.props.updateAutoTag}
                      tags={this.props.tags}
                    />
                  </Grid>
                );
              })}
            <Grid item className={classes.tagPanel}>
              <TagRuleListItem
                creationCard
                tagRule={this.state.tagRuledefaultCreate}
                createAutoTag={this.props.createAutoTag}
                deleteAutoTag={this.props.deleteAutoTag}
                tags={this.props.tags}
              />
            </Grid>
          </Grid>
        </Collapse>
      </div>
    );
  }
}

const styles = (theme) => ({
  header: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: theme.spacing(4),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  tagPanel: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['smartList']),
)(AutoTagPanel);
