import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react';
import EditDoc from './editDoc';

export default class DocDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: {},
      id: "",
      title: "",
      author: "",
    };
  }

  componentDidMount(){
    fetch(`http://127.0.0.1:1337/doc/${this.props.id}`)
    .then(get => get.json())
    .then(docObj => {
      this.setState({
        id: docObj._id,
        title: docObj.title,
        author: docObj.author.name,
        doc: docObj,
      })})
  }

  render() {
    return (
      <div>
        <Link to={{pathname: "/doc", state: {id:this.state.id}}}>{this.state.title}</Link>
        <p>Author: {this.state.author}</p>
        {/* <input placeholder="paste a doc id" onChange={(e)=>{this.setState({add:e.target.value})}}/>
        <button type="submit" onClick={}>Add shared document</button> */}
      </div>);
  }
}
