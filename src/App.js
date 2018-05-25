import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import 'bootstrap';

import Home from './Home.component';
import './App.scss';

import initStore from './store';

class App extends Component {
  constructor(props) {
    super(props);

    const { store } = initStore();
    this.store = store;
  }

  render() {
    return (
      <Provider store={this.store}>
        <div className="main">
          <Home />
        </div>
      </Provider>
    );
  }
}

export default App;
