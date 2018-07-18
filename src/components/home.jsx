import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';


export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Button><Link to="/login">Login</Link></Button>
        <Button><Link to="/signup">Signup</Link></Button>
      </div>);
  }
}
