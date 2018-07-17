import React from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import Login from './login';
import Signup from './signup';
import Portal from './portal';
import Home from './home';
import EditDoc from './editDoc';

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
    fetch('http://127.0.0.1:1337/login',
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
    fetch('http://127.0.0.1:1337/logout').then(
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
          <div>
            <Header as="h1">whatsupDOCS</Header>
            {this.state.loggedin ?
              <div>
                <button onClick={this.logout.bind(this)}>Logout</button>
                <button><Link to={portalPath}>Portal</Link></button>
              </div>
              : null}
            {renderPortal()}
          </div>
        <Switch>
          <Route path="/login" render={props=> <Login login={this.login.bind(this)} {...props} />} />
          <Route path="/signup" component={Signup}/>
          <Route path={portalPath} render={props=> <Portal user={this.state.user} {...props} />}/>
          <Route path="/doc" component={EditDoc}/>
        </Switch>
        </div>
      </BrowserRouter>
    </div>);
  }
}
