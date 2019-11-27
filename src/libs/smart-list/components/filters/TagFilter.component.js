// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import { Tag, TagGroup } from '../../../tag/types';
import TagChipList from '../../../tag/components/TagChipListNew.component';
import TagFilterForm from '../../../tag/components/TagRowSelector.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  tag_groups: Array<TagGroup>,
  tags: Array<Tag>,
};

export class TagFilter extends Component<Props, state> {
  state = {
    anchorEl: null,
    open: false,
    placement: null,
  };

  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({
        tags_included: [],
        tags_excluded: [],
      });
    }
  }

  handleClick = (placement) => (event) => {
    const { currentTarget } = event;
    this.setState((state) => ({
      anchorEl: currentTarget,
      open: !state.open,
      placement,
    }));
  };

  render() {
    const { anchorEl, open, placement } = this.state;
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div className={classes.container}>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <TagChipList
          tagGroups={this.props.tag_groups}
          tags={this.props.tags}
          includes={filter_data.tags_included || []}
          excludes={filter_data.tags_excluded || []}
          handleReinit={() =>
            onChange({ tags_included: [], tags_excluded: [] })
          }
          handleDeleteTag={(id, include) => {
            if (include) {
              const new_included = filter_data.tags_included.filter(
                (id_) => id_ !== id,
              );
              onChange({
                tags_included: new_included,
              });
            } else {
              const new_excluded = filter_data.tags_excluded.filter(
                (id_) => id_ !== id,
              );
              onChange({
                tags_excluded: new_excluded,
              });
            }
          }}
          handleAdd={this.handleClick('bottom-start')}
        />
        <Popper
          style={{ zIndex: '1000' }}
          open={open}
          anchorEl={anchorEl}
          transition
          placement={placement}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <TagFilterForm
                  tagGroups={this.props.tag_groups}
                  createFilter={(ev) => {
                    let new_tags = [];
                    if (ev.include) {
                      new_tags = [...filter_data.tags_included, ev.tagId];
                      onChange({
                        tags_included: new_tags,
                      });
                    } else {
                      new_tags = [...filter_data.tags_excluded, ev.tagId];
                      onChange({
                        tags_excluded: new_tags,
                      });
                    }
                    this.setState({ open: false });
                  }}
                />
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  textInput: {
    width: '70px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(TagFilter);
