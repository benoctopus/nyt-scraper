import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { Button } from '@material-ui/core';
import store from './store';
import Socket from './scripts/Socket';
import Login from './containers/Login';
import Home from './containers/Home';

class App extends React.Component {
  componentWillMount() {
    this.socket = new Socket();
  }

  render() {
    return (
      <Router>
        <Provider store={store}>
          <Switch>
            <Route
              path="/home"
              render={
                ({ history }) => <Home history={history} socket={this.socket} />
                }
            />
            <Route
              path="/"
              render={
                ({ history }) => <Login history={history} socket={this.socket} />
                }
            />
          </Switch>
        </Provider>
      </Router>
    );
    // return (
    //   <Button onClick={() => {
    //     this.socket.emit('message', 'test');
    //     console.log('clicked');
    //   }}
    //   >
    //     Click Me
    //   </Button>
    // );
  }
}

export default App;
