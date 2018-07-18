import React from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import LoginValidator from '../validators/LoginValidator';

const loginValidator = LoginValidator();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: '',
      validationError: null,
      loginSuccess: false,
    };
  }

  validate = () => loginValidator.call(this, this.state);

  handleInputs = (event, field) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ [field]: event.target.value });
  }

  handleSubmit = (signUp = false) => {
    console.log(signUp);
    const err = this.validate();
    if (err) {
      this.setState({ validationError: err });
    } else {
      this.setState({
        loginSuccess: true,
        validationError: null,
      });
    }
  }

  render() {
    console.log(this.state.user, this.state.pass);
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
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
            width: '20rem'
          }}
        >
          <TextField
            label="Username"
            placeholder="Dave"
            name="userName"
            type="text"
            autoFocus
            required
            onKeyPress={(event) => {
               if (event.key === 'Enter') this.handleSubmit();
              }}
            onChange={event => this.handleInputs(event, 'user')}
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
              onClick={this.handleSubmit(false)}
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
