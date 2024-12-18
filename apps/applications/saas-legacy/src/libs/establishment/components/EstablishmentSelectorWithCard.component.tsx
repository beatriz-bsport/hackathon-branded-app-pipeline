import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
// @ts-expect-error
import EstablishmentListItem from './EstablishmentListItem.component';
import FuzeSearch from '../../../components/FuzeSearch.component';
import { Establishment } from '../types';

type OwnProps = {
  establishments: Array<Establishment>;
  onChange: (id: number | null) => void;
  placeholder: string;
  value: any;
  id: number;
  disableAutoFocus?: boolean;
};

type Props = OwnProps & WithStyles;

type State = {
  searchText: string;
  searchResult: Array<Establishment>;
  displayList: boolean;
};

export class EstablishmentSelectorWithCard extends Component<Props, State> {
  state = {
    searchText: '',
    // @ts-expect-error
    searchResult: [],
    displayList: false,
  };

  // @ts-expect-error
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

  getEstablishmentGroupByAddres = (establishmentList: Array<Establishment>) => {
    const establishmentGourpByAddress = establishmentList.reduce(
      (accumulator, establishmentItem) => {
        const temp = accumulator.findIndex(
          (group) =>
            group.address?.toUpperCase() ===
            establishmentItem.location.address?.toUpperCase(),
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
              button
              clearIcon
              noDivider
              establishment={this.props.value}
              onClickDelete={() => {
                this.props.onChange(null);
                this.setState({
                  displayList: true,
                  searchResult: this.props.establishments,
                });
              }}
            />
          </div>
        ) : (
          <div>
            {/* @ts-expect-error */}
            <Button
              className={this.props.classes.button}
              id={this.props.id}
              onClick={() => {
                if (this.state.searchText === '') {
                  this.setState((prevstate: State) => ({
                    displayList: !prevstate.displayList,
                    searchResult: this.props.establishments || [],
                  }));
                }
              }}
            >
              <FuzeSearch
                changeSearch={this.changeSearch}
                clearSearch={this.clearSearch}
                disableAutoFocus={this.props.disableAutoFocus}
                items={this.props.establishments}
                placeholder={this.props.placeholder}
                searchFields={['title', 'location.adress']}
                // @ts-expect-error
                searchResult={this.state.searchResult}
                searchText={this.state.searchText}
                variant="outlined"
              />
            </Button>
            {this.state.displayList && this.state.searchResult ? (
              <Paper className={this.props.classes.searchPaperDisplayed}>
                <Collapse
                  // @ts-expect-error
                  in={this.state.displayList && this.state.searchResult}
                >
                  {this.getEstablishmentGroupByAddres(
                    this.state.searchResult,
                  ).map((group, index) => (
                    <List
                      key={index}
                      component="nav"
                      subheader={
                        <ListSubheader
                          className={this.props.classes.listSubHeader}
                          component="div"
                        >
                          <LocationOnIcon color="primary" />
                          {group.address}
                        </ListSubheader>
                      }
                    >
                      {group.establishmentList.map(
                        (establishment: Establishment) => (
                          <EstablishmentListItem
                            key={`${index}${establishment.id}`}
                            button
                            noDivider
                            establishment={establishment}
                            // @ts-expect-error
                            onClick={() => this.props.onChange(establishment)}
                          />
                        ),
                      )}
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

const styles = (theme: Theme) =>
  createStyles({
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
