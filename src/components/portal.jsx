import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react';
import DocDisplay from './docDisplay'

export default class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new: "",
      add: "",
      user: this.props.user,
      docs: this.props.user.docs,
    };
  }

  new(){
    fetch('http://127.0.0.1:1337/new',
    { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: this.state.new,
        author: this.state.user,
        password: 123,
        collaborators: [this.state.user._id]
      }),
    })
    .then(resp => resp.json())
    .then(docObj => {
      console.log("new document", docObj);
      let tempObj = Object.assign(this.state.user);
      let tempDocsArr = tempObj.docs.slice();
      console.log("tempArr", tempDocsArr);
      tempDocsArr.push(docObj._id);
      tempObj.docs = tempDocsArr;
      this.setState({user: tempObj, docs: tempDocsArr, new: ""})
    })
    .catch(err => { console.log(err);});
  }

  add(){
    fetch('http://127.0.0.1:1337/add',
    { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doc: this.state.add,
        user: this.state.user,
        password: 123,
      }),
    })
    .catch(err => {console.log(err);});
    let tempObj = Object.assign(this.state.user);
    let tempDocsArr = tempObj.docs.slice();
    tempDocsArr.push(this.state.add);
    tempObj.docs = tempDocsArr;
    this.setState({user:tempObj, docs: tempDocsArr, add: ""})
  }

  render() {
    return (
      <div>
        <input placeholder="new document" onChange={(e)=>{this.setState({new:e.target.value})}}/>
        <button type="submit" onClick={this.new.bind(this)}>Create new document</button>
        <div className = "documents">
          <p>My documents</p>
          {this.state.docs.map(doc => <DocDisplay id={doc}/>)}
        </div>
        <input placeholder="paste a doc id" onChange={(e)=>{this.setState({add:e.target.value})}}/>
        <button type="submit" onClick={this.add.bind(this)}>Add shared document</button>
      </div>);
  }
}
