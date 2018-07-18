import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react';
import EditDoc from './editDoc';
const path = 'http://127.0.0.1:2000';

export default class DocDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.socket,
      id: "",
      title: "",
      author: "",
    };
  }

  componentDidMount() {
    this.state.socket.emit('fetchDoc', this.props.id);
    this.state.socket.on('fetchDoc', (title, author, docId) => {
      this.setState({
        id: docId,
        title: title,
        author: author,
      })
    });
    // fetch(`${path}/doc/${this.props.id}`)
    // .then(get => get.json())
    // .then(docObj => {
    //   this.setState({
    //     id: docObj._id,
    //     title: docObj.title,
    //     author: docObj.author.name,
    //     doc: docObj,
    //   })})
  }

  render() {
    // console.log(this.state.id, this.state.title)
    return (
      <div>
        <Link to={{pathname: "/doc",
                   state: {id:this.state.id}}}>{this.state.title}</Link>
        <p>Author: {this.state.author}</p>
      </div>);
  }
}
