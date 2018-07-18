import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';
import Login from './containers/Login';
import './App.scss';

class App extends React.Component {
  componentDidMount() {
    return null;
  }

  render() {
    return (
      <Router>
        <Provider store={store}>
          <Switch>
            <Route path="/" component={Login} />
          </Switch>
        </Provider>
      </Router>
    );
  }
}

export default App;
