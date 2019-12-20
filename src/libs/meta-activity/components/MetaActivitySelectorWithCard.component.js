// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import MetaActivityListItem from './MetaActivityListItem.component';
import FuzeSearch from '../../../components/FuzeSearch.component';

type Props = {
  classes: Object,
  metaActivities: Array,
  onChange: (?number) => void,
  placeholder: string,
  value: any,
};

export class MetaActivity extends Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
    displayList: false,
  };

  changeSearch = (fuse) => (ev) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value) || [],
      displayList: true,
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: this.props.metaActivities });
  };

  render() {
    return (
      <div>
        {this.props.value ? (
          <div>
            <MetaActivityListItem
              metaActivity={this.props.value}
              noDivider
              clearIcon
              deleteMetaActivity={() => this.props.onChange()}
            />
          </div>
        ) : (
          <div>
            <Button
              onClick={() => {
                if (this.state.searchText === '') {
                  this.setState((prevstate) => ({
                    displayList: !prevstate.displayList,
                    searchResult: this.props.metaActivities || [],
                  }));
                }
              }}
              className={this.props.classes.button}
            >
              <FuzeSearch
                variant="outlined"
                searchText={this.state.searchText}
                clearSearch={this.clearSearch}
                changeSearch={this.changeSearch}
                searchFields={['name']}
                items={this.props.metaActivities}
                placeholder={this.props.placeholder}
                searchResult={this.state.searchResult}
              />
            </Button>
            {this.state.displayList && this.state.searchResult ? (
              <Paper className={this.props.classes.searchPaperDisplayed}>
                <Collapse
                  in={this.state.displayList && this.state.searchResult}
                >
                  {this.state.searchResult.map((metaActivity) => (
                    <MetaActivityListItem
                      metaActivity={metaActivity}
                      noDivider
                      button
                      onClick={() => this.props.onChange(metaActivity)}
                    />
                  ))}
                </Collapse>
              </Paper>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

const styles = () => ({
  button: { width: '100%', padding: '0' },
  searchPaperDisplayed: {
    maxHeight: '500px',
    overflow: 'auto',
  },
});

export default compose(withStyles(styles))(MetaActivity);
