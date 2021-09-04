// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EstablishmentListItem from './EstablishmentListItem.component';
import FuzeSearch from '../../../components/FuzeSearch.component';

type Props = {
  classes: Object,
  establishments: Array,
  onChange: (?number) => void,
  placeholder: string,
  value: any,
  id: number,
};

export class EstablishmentSelectorWithCard extends Component<Props, State> {
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
      searchResult: this.props.establishments,
    });
  };

  getEstablishmentGroupByAddres = (establishmentList) => {
    const establishmentGourpByAddress = establishmentList.reduce(
      (accumulator, establishmentItem) => {
        const temp = accumulator.findIndex(
          (group) =>
            group.address.toUpperCase() ===
            establishmentItem.location.address.toUpperCase(),
        );
        if (temp === -1) {
          accumulator.push({
            address: establishmentItem.location.address,
            establishmentList: [establishmentItem],
          });
        } else {
          accumulator[temp].establishmentList.push(establishmentItem);
        }
        return accumulator;
      },
      [],
    );
    return establishmentGourpByAddress;
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
              onClickDelete={() => {
                this.props.onChange();
                this.setState({
                  displayList: true,
                  searchResult: this.props.establishments,
                });
              }}
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
              id={this.props.id}
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
                  {this.getEstablishmentGroupByAddres(
                    this.state.searchResult,
                  ).map((group, index) => (
                    <List
                      component="nav"
                      subheader={
                        <ListSubheader
                          component="div"
                          className={this.props.classes.listSubHeader}
                        >
                          <LocationOnIcon color="primary" />
                          {group.address}
                        </ListSubheader>
                      }
                      key={index}
                    >
                      {group.establishmentList.map((establishment) => (
                        <EstablishmentListItem
                          key={`${index}${establishment.id}`}
                          establishment={establishment}
                          noDivider
                          button
                          onClick={() => this.props.onChange(establishment)}
                        />
                      ))}
                    </List>
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

const styles = (theme: Theme) => ({
  button: { width: '100%', padding: '0' },
  searchPaperDisplayed: {
    maxHeight: '500px',
    overflow: 'auto',
  },
  listSubHeader: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottom: `1px solid${theme.palette.primary.main}`,
    paddingBottom: theme.spacing(0.5),
    backgroundColor: 'white',
  },
});

export default compose(withStyles(styles))(EstablishmentSelectorWithCard);
