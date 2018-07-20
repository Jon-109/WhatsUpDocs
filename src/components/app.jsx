import React from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import { Header, Button } from 'semantic-ui-react';
// import socketIO from 'socket.io-client';
import Login from './login';
import Signup from './signup';
import Portal from './portal';
import Home from './home';
import EditDoc from './editDoc';
const path = 'http://127.0.0.1:2000'
import socket from './../socket';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      user:{},
      loggedin: false,
    }
  }
  //
  // componentDidMount(){
  //   fetch('/user', { credentials: 'same-origin' })
  //   .then(this.setState({
  //     loggedin: true,
  //   }));
  // }

  login(email, pwd) {
    fetch(`${path}/login`,
      { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,
          password: pwd,
        }),
      })
      .then(resp => resp.json())
      .then(userObj => {
        this.setState({ loggedin: true, user: userObj});
      })
      .catch(err => { console.log(err);});
  }

  logout(){
    fetch(`${path}/logout`).then(
      this.setState({
        loggedin: false,
        user: {},
      })
    )
  }

  render() {
    var portalPath = `/portal/${this.state.user._id}`;
    const renderPortal = () =>{
      if (this.state.loggedin){
        return <Redirect to={{pathname: portalPath, state:{user: this.state.user}}}/>
      } else {
        return <Home/>
      }
    }
    return (<div>
      <BrowserRouter basename="/">
        <div>
          <div className="masterContainer">
            <Header as="h1">whatsupDOCS</Header>
            {this.state.loggedin ?
              <div>
                <Button onClick={this.logout.bind(this)}>Logout</Button>
              </div>
              : null}
            {renderPortal()}
          </div>
        <Switch>
          <Route path="/login" render={props=> <Login login={this.login.bind(this)} {...props} />} />
          <Route path="/signup" component={Signup}/>
          <Route path={portalPath} render={props=> <Portal user={this.state.user} socket={this.state.socket}{...props} />}/>
          <Route path="/doc" component={EditDoc}/>
        </Switch>
        </div>
      </BrowserRouter>
    </div>);
  }
}
