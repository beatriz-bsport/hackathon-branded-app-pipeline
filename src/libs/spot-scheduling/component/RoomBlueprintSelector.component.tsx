// @ts-nocheck
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import FuzeSearch from '../../../components/FuzeSearch.component';
import { RoomBlueprint } from '../types';
import RoomBlueprintListItem from './RoomBlueprintListItem.component';

type Props = {
  classes: Object;
  value: RoomBlueprint;
  roomBlueprints: RoomBlueprint[];
  onChange: (roomBlueprint: RoomBlueprint) => void;
  placeholder: string;
  id: number;
};

interface State {
  searchText: string;
  searchResult: RoomBlueprint[];
  displayList: boolean;
}

export class RoomBlueprintSelectorComponent extends Component<Props, State> {
  state: State = {
    searchText: '',
    searchResult: [],
    displayList: false,
  };

  changeSearch = (fuse: any) => (ev: any) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value) || [],
      displayList: true,
    });
  };

  clearSearch = () => {
    this.setState({
      searchText: '',
      searchResult: this.props.roomBlueprints,
      displayList: true,
    });
  };

  onClickFuzeSearch = () => {
    if (this.state.searchText === '') {
      this.setState((prevstate) => ({
        displayList: !prevstate.displayList,
        searchResult: this.props.roomBlueprints || [],
      }));
    }
  };

  render() {
    return (
      <div>
        {this.props.value ? (
          <div>
            <RoomBlueprintListItem
              onClickCancel={() => {
                this.props.onChange(null);
                this.setState({
                  displayList: true,
                  searchResult: this.props.roomBlueprints,
                });
              }}
              roomBlueprint={this.props.value}
            />
          </div>
        ) : (
          <div>
            <Button
              className={this.props.classes.button}
              id={this.props.id}
              onClick={this.onClickFuzeSearch}
            >
              <FuzeSearch
                changeSearch={this.changeSearch}
                clearSearch={this.clearSearch}
                items={this.props.roomBlueprints}
                placeholder={this.props.placeholder}
                searchFields={['name']}
                searchResult={this.state.searchResult}
                searchText={this.state.searchText}
                variant="outlined"
              />
            </Button>
            {this.state.displayList && this.state.searchResult ? (
              <Paper className={this.props.classes.searchPaperDisplayed}>
                <Collapse
                  in={this.state.displayList && this.state.searchResult}
                >
                  {this.state.searchResult.map((roomBlueprint) => (
                    <RoomBlueprintListItem
                      key={roomBlueprint.id}
                      onClick={this.props.onChange}
                      roomBlueprint={roomBlueprint}
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

const styles = (theme) => ({
  button: { width: '100%', padding: '0' },
  searchPaperDisplayed: {
    maxHeight: '500px',
    overflow: 'auto',
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
});

export default compose(withStyles(styles))(RoomBlueprintSelectorComponent);
