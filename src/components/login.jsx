import React from 'react';
import { Redirect } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  submit() {
    this.props.login(this.state.email, this.state.pwd);
    this.setState({
      email: '',
      pwd: '',
    });
  }

  render() {
    return (<div className="masterContainer">
      <Form>
        <Form.Field required>
          <label>Email</label>
          <input value={this.state.email}
                 onChange={(e)=>{this.setState({email: e.target.value})}} />
        </Form.Field>
        <Form.Field required>
          <label>Password</label>
          <input placeholder='Password' type="password" value={this.state.pwd}
                 onChange={(e)=>{this.setState({pwd: e.target.value})}}/>
        </Form.Field>
        <Button type='button' onClick={this.submit.bind(this)}>Login</Button>
      </Form>
    </div>);
  }
}
