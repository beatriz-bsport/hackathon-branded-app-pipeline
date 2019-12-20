// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import EstablishmentListItem from './EstablishmentListItem.component';
import FuzeSearch from '../../../components/FuzeSearch.component';

type Props = {
  classes: Object,
  establishments: Array,
  onChange: (?number) => void,
  placeholder: string,
  value: any,
};

export class EstablishmentSelector extends Component<Props, State> {
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
    this.setState({ searchText: '', searchResult: this.props.establishments });
  };

  render() {
    return (
      <div>
        {this.props.value ? (
          <div>
            <EstablishmentListItem
              establishment={this.props.value}
              noDivider
              button
              clearIcon
              onClickDelete={() => this.props.onChange()}
            />
          </div>
        ) : (
          <div>
            <Button
              onClick={() => {
                if (this.state.searchText === '') {
                  this.setState((prevstate) => ({
                    displayList: !prevstate.displayList,
                    searchResult: this.props.establishments || [],
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
                searchFields={['title', 'location.adress']}
                items={this.props.establishments}
                placeholder={this.props.placeholder}
                searchResult={this.state.searchResult}
              />
            </Button>
            {this.state.displayList && this.state.searchResult ? (
              <Paper className={this.props.classes.searchPaperDisplayed}>
                <Collapse
                  in={this.state.displayList && this.state.searchResult}
                >
                  {this.state.searchResult.map((establishment) => (
                    <EstablishmentListItem
                      establishment={establishment}
                      noDivider
                      button
                      onClick={() => this.props.onChange(establishment)}
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

export default compose(withStyles(styles))(EstablishmentSelector);
