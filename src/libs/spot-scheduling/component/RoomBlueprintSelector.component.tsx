import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import ClearIcon from '@material-ui/icons/Clear';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';

import FuzeSearch from '../../../components/FuzeSearch.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { RoomBlueprint } from '../types';

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
            <ListItem alignItems="center">
              <ListItemText
                primary={
                  <Typography component="span" variant="subtitle1">
                    {this.props.value.name}
                  </Typography>
                }
              />

              <ListItemResponsiveAction
                actions={[
                  {
                    icon: ClearIcon,
                    label: '',
                    onClick: () => {
                      this.props.onChange(null);
                      this.setState({
                        displayList: true,
                        searchResult: this.props.roomBlueprints,
                      });
                    },
                  },
                ]}
              />
            </ListItem>
          </div>
        ) : (
          <div>
            <Button
              onClick={this.onClickFuzeSearch}
              id={this.props.id}
              className={this.props.classes.button}
            >
              <FuzeSearch
                variant="outlined"
                searchText={this.state.searchText}
                clearSearch={this.clearSearch}
                changeSearch={this.changeSearch}
                searchFields={['name']}
                items={this.props.roomBlueprints}
                placeholder={this.props.placeholder}
                searchResult={this.state.searchResult}
              />
            </Button>
            {this.state.displayList && this.state.searchResult ? (
              <Paper className={this.props.classes.searchPaperDisplayed}>
                <Collapse
                  in={this.state.displayList && this.state.searchResult}
                >
                  {this.state.searchResult.map((roomBlueprint) => (
                    <ListItem
                      alignItems="center"
                      onClick={() => this.props.onChange(roomBlueprint)}
                    >
                      <ListItemText
                        primary={
                          <Typography component="span" variant="subtitle1">
                            {roomBlueprint.name}
                          </Typography>
                        }
                      />
                    </ListItem>
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
