import React from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import LoginValidator from '../validators/LoginValidator';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: '',
      validationError: null,
      loginSuccess: false,
    };
    console.log(this.props.history);
    this.loginCall = this.props.socket.login(this.loginHandler);
    this.login = signUp => this.loginCall(this.state, signUp);
  }

  componentWillMount() {
    this.loginValidator = LoginValidator();
  }

  componentDidMount() {
    // check token login status
    this.props.socket.extendedLogin()
      .then((status) => {
        if (status) {
          this.props.history.push('/home');
        }
      });
  }

  shouldComponentUpdate() {
    return !this.state.loginSuccess;
  }

  componentDidUpdate() {
    if (this.state.loginSuccess && localStorage.token) {
      this.props.history.push('/home');
    }
  }

  componentWillUnmount() {
    this.login();
  }

  _validate = () => this.loginValidator.call(this, this.state);

  loginHandler = ({ token, err }) => {
    if (err) {
      console.log('authentication failed');
      this.setState({
        loginSuccess: false,
        validationError: err,
      });
    } else if (token) {
      console.log('authentication succeeded');
      localStorage.token = token;
      this.setState({
        loginSuccess: true,
        validationError: false,
      });
    } else {
      throw new Error('websocket response is missing');
    }
  }

  handleInputs = (event, field) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ [field]: event.target.value });
  }

  handleSubmit = (signUp) => {
    const err = this._validate();
    if (err) {
      this.setState({
        validationError: err,
        loginSuccess: false,
      });
    } else {
      this.login(signUp);
    }
  }

  render() {
    return (
      <div
        style={{
          margin: 'auto',
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          width: '20rem',
        }}
      >
        <Typography
          id="login-title"
          className="title"
          variant="headline"
          style={{ paddingTop: '10rem' }}

        >
        Nyt Scrape
        </Typography>
        {
          this.state.validationError ?
            <Typography
              id="login-title"
              className="title"
              variant="subheading"
              style={{ textAlign: 'center', color: 'red' }}
            >
              {this.state.validationError}

            </Typography>
            : null
        }
        <div
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
          }}
        >
          <TextField
            label="Username"
            placeholder="Dave"
            name="userName"
            type="text"
            autoFocus
            required
            onChange={event => this.handleInputs(event, 'user')}
            onKeyPress={(event) => {
               if (event.key === 'Enter') this.handleSubmit();
            }}
            value={this.state.userName}
          />
          <TextField
            label="Password"
            placeholder=""
            name="passWord"
            type="password"
            required
            autoFocus
            onKeyPress={(event) => {
               if (event.key === 'Enter') this.handleSubmit();
              }}
            onChange={event => this.handleInputs(event, 'pass')}
            value={this.state.pass}
          />
          <div
            style={{
              padding: '1rem 0',
              width: 'initial',
              justifyContent: 'space-between',
              display: 'flex',
              flexFlow: 'row nowrap'
            }}
          >
            <Button
              onClick={() => this.handleSubmit(false)}
            >
              sign in
            </Button>
            <Typography
              variant="headline"
              style={{ padding: '0 .5rem' }}
            >
              |
            </Typography>
            <Button
              onClick={() => this.handleSubmit(true)}
            >
              sign up
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
