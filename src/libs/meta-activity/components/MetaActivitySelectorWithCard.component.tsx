// @ts-nocheck
// @flow
import React, { Component } from 'react';
import Fuse, { FuseOptions } from 'fuse.js';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core';

import MetaActivityListItem from './MetaActivityListItem.component';
import FuzeSearch from '#components/FuzeSearch.component';
import VirtualizeListAutoSize from '#components/VirtualizeList/VirtualizeListAutoSize.component';
import { MetaActivity } from '../types';

type Props = {
  classes: Object;
  metaActivities: MetaActivity[];
  onChange: (value?: MetaActivity) => void;
  placeholder: string;
  value: any;
};

type State = {
  searchText: string;
  searchResult: MetaActivity[];
};

export class MetaActivitySelectorWithCard extends Component<
  Props & WithStyles<typeof styles>,
  State
> {
  constructor(props: Props & WithStyles<typeof styles>) {
    super(props);

    this.state = {
      searchText: '',
      searchResult: this.props.metaActivities,
    };
  }

  changeSearch =
    (fuse: Fuse<MetaActivity, FuseOptions<MetaActivity>>) => (ev) => {
      if (ev.target.value === '') {
        this.setState({
          searchText: ev.target.value,
          searchResult: this.props.metaActivities,
        });
        return;
      }

      this.setState({
        searchText: ev.target.value,
        searchResult: (fuse.search(ev.target.value) || []) as MetaActivity[],
      });
    };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: this.props.metaActivities });
  };

  render() {
    return (
      <div className={this.props.classes.main}>
        {this.props.value ? (
          <div>
            <MetaActivityListItem
              metaActivity={{ ...this.props.value, customer_enabled: true }}
              divider
              deleteMetaActivity={this.props.onChange}
            />
          </div>
        ) : (
          <div className={this.props.classes.container}>
            <FuzeSearch
              variant="outlined"
              searchText={this.state.searchText}
              clearSearch={this.clearSearch}
              changeSearch={this.changeSearch}
              searchFields={['name']}
              items={this.props.metaActivities}
              placeholder={this.props.placeholder}
              searchResult={this.state.searchResult}
              className={this.props.classes.search}
            />
            <div style={{ flex: 1 }}>
              <VirtualizeListAutoSize
                itemCount={this.state.searchResult.length}
                itemSize={76}
                renderRow={(index) => {
                  const metaActivity = this.state.searchResult[index];
                  return (
                    <MetaActivityListItem
                      metaActivity={metaActivity}
                      onClick={() => this.props.onChange(metaActivity)}
                    />
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  search: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  main: {
    height: '100%',
    marginTop: theme.spacing(2),
  },
});

export default compose<any, Props>(withStyles(styles))(
  MetaActivitySelectorWithCard,
);
