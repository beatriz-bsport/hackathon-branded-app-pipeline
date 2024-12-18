import React, { PureComponent, FormEvent } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import './style.css';

const DELAY = 350;

export type Props = {
  t: TFunction;
  onSearch: (searchText: string) => void;
  onClearInput: () => void;
} & WithTranslation;

type State = {
  searchText: string;
  writingSince: number | null;
};

export class MarketplaceCalendarSearch extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: '',
      writingSince: null,
    };
  }

  sendChange =
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => () => {
      if (
        !this.state.writingSince ||
        Date.now() - this.state.writingSince > DELAY
      ) {
        this.handleRequest(e);
      }
    };

  handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    e.persist();
    this.setState({
      writingSince: Date.now(),
      searchText: e.target.value,
    });
    setTimeout(this.sendChange(e), DELAY + 10);
  };

  handleRequest = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    this.setState({ searchText: e.target.value });
    const searchText = this.state.searchText;

    this.props.onSearch(searchText);
  };

  handleClearInput = () => {
    this.setState({ searchText: '' });
    this.props.onClearInput && this.props.onClearInput();
  };

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  render() {
    return (
      <form
        className="bs-calendar-search__container"
        onSubmit={this.handleSubmit}
      >
        <div className="bs-calendar-search__input__container">
          <button className="bs-calendar-search__input__icon" type="button">
            <SearchIcon fontSize="small" />
          </button>
          <input
            className="bs-calendar-search__input"
            onChange={this.handleChange}
            placeholder={this.props.t('input')}
            value={this.state.searchText}
          />
          {this.state.searchText && (
            <button
              className="bs-calendar-search__input__icon"
              onClick={this.handleClearInput}
              type="button"
            >
              <ClearIcon fontSize="small" />
            </button>
          )}
        </div>
      </form>
    );
  }
}

export default withTranslation(['search'])(MarketplaceCalendarSearch);
