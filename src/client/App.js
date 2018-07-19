import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import store from './store';
import Socket from './scripts/Socket';
import Login from './containers/Login';
import Home from './containers/Home';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3f50b5',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }
  componentWillMount() {
    this.socket = new Socket();
  }

  render() {
    return (
      <Router>
        <Provider store={store}>
          <CssBaseline>
            <MuiThemeProvider theme={theme} >
              <Switch>
                <Route
                  path="/home"
                  exact
                  render={
                ({ history }) => (
                  <Home history={history} user={this.state.user} socket={this.socket} />
                )
                }
                />
                <Route
                  path="/"
                  render={
                ({ history }) => <Login history={history} socket={this.socket} />
                }
                />
              </Switch>
            </MuiThemeProvider>
          </CssBaseline>
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
