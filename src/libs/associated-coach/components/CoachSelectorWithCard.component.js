// @flow
import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import CoachListItem from './CoachListItemBasic.component';
import FuzeSearch from '../../../components/FuzeSearch.component';

type Props = {
  classes: Object,
  coaches: Array,
  onChange: (?number) => void,
  placeholder: string,
  value: any,
  coaches: any,
  id: number,
};

export class CoachSelector extends Component<Props, State> {
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
    this.setState({
      searchText: '',
      displayList: true,
      searchResult: this.props.coaches,
    });
  };

  render() {
    return (
      <div>
        {this.props.value ? (
          <div>
            <CoachListItem
              coach={this.props.value}
              noDivider
              button
              onDelete={() => {
                this.props.onChange();
                this.setState({
                  displayList: true,
                  searchResult: this.props.coaches,
                });
              }}
              clearIcon
            />
          </div>
        ) : (
          <div>
            <Button
              id={this.props.id}
              onClick={() => {
                if (this.state.searchText === '') {
                  this.setState((prevstate) => ({
                    displayList: !prevstate.displayList,
                    searchResult: this.props.coaches || [],
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
                items={this.props.coaches}
                placeholder={this.props.placeholder}
                searchResult={this.state.searchResult}
              />
            </Button>
            {this.state.displayList && this.state.searchResult ? (
              <Paper className={this.props.classes.searchPaperDisplayed}>
                <Collapse
                  in={this.state.displayList && this.state.searchResult}
                >
                  {this.state.searchResult.map((coach) => (
                    <CoachListItem
                      coach={coach}
                      noDivider
                      button
                      onClick={() => this.props.onChange(coach)}
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
  searchPaperDisplayed: { maxHeight: '400px', overflow: 'auto' },
});

export default compose(withStyles(styles))(CoachSelector);
