import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react';

export default class DocDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      author: "",
      content: "",
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
        content: docObj.content
      })})
  }

  save(string){
    fetch()
  }

  render() {
    return (
      <div>
        <h3>{this.state.title}</h3>
        <p>Author: {this.state.author}</p>
        <p>Shareable Document ID: {this.state.id}</p>
        <button onClick={this.save.bind(this, this.state.content)}>Save Changes</button>
        <div>
        </div>
      </div>);
  }
}
