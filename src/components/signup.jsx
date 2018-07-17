import React from 'react';
import { Button, Checkbox, Form, Input } from 'semantic-ui-react';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fn: "",
      pwd: "",
      email: "",
      pwdRep:"",
      signedup: false,
    };
  }

  signup() {
    fetch('http://127.0.0.1:1337/signup',
        { method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstname: this.state.fn,
                password: this.state.pwd,
                passwordRepeat: this.state.pwdRep,
                username: this.state.email,
            })
        }).catch(err=>{console.log(err);})
    this.props.history.push('/login')
}

    render() {
        return (
        <div>
          <Form>
            <Form.Field required>
              <label>Full Name</label>
              <input placeholder='John Doe' value={this.state.fn} onChange={(e)=>{this.setState({fn: e.target.value})}}/>
            </Form.Field>
            <Form.Field required>
              <label>Email</label>
              <input placeholder='johndoe@wsdocs.com' value={this.state.email} onChange={(e)=>{this.setState({email: e.target.value})}} />
            </Form.Field>
            <Form.Field required>
              <label>Password</label>
              <Input placeholder='Password' type="password" value={this.state.pwd} onChange={(e)=>{this.setState({pwd: e.target.value})}}/>
            </Form.Field>
            <Form.Field required>
              <label>Repeat your password</label>
              <Input placeholder='Password Repeat' type="password" value={this.state.pwdRep} onChange={(e)=>{this.setState({pwdRep: e.target.value})}}/>
            </Form.Field>
            <Form.Field required>
              <Checkbox label='I agree to the Terms and Conditions'/>
            </Form.Field>
            <Button type='button' onClick={this.signup.bind(this)}>Signup</Button>
          </Form>
        </div>
        );
    }
  }
