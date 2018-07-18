import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import { Grid, Header, Form, Button } from 'semantic-ui-react';
import DocDisplay from './docDisplay';
const path = 'http://127.0.0.1:2000';
import NewDocModal from './newDocModal';
import socket from './../socket';

export default class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new: '',
      add: '',
      user: this.props.user,
      docs: [],
      pwd: '',
      pwdAdd: '',
      error: '',
      newModal: false,
      addModal: false,
    };
  }

  componentDidMount(){
    socket.emit('allDocs', this.state.user._id);
    socket.on('allDocs', documents => {
      const docs = JSON.parse(documents);
      let listArr = [];
      for (var i in docs){
        for (var u in docs[i]["collaborators"]){
          if (docs[i]["collaborators"][u]["_id"] === this.state.user._id) {
            listArr.push(docs[i]);
          }
        }
      }
      this.setState({ docs: listArr })
    })
  }

  new(title, password){
    socket.emit('newDoc', title, this.state.user, password)
    socket.on('newDoc', resp => {
      const docObj = JSON.parse(resp);
      docObj.author = {name: this.state.user.name};
      let tempDocsArr = this.state.docs.slice();
      tempDocsArr.push(docObj);
      this.setState({ docs: tempDocsArr, new: '', pwd: '' });
    })
  }

  add(title, password){
    socket.emit('add', title, password, this.state.user);
    socket.on('add', resp=>{
      const docObj = JSON.parse(resp);
      let tempDocsArr = this.state.docs.slice();
      tempDocsArr.push(docObj);
      console.log("tempDocs: ", tempDocsArr);
      this.setState({docs: tempDocsArr, add: '', pwdAdd: '' });
    })
    socket.on('error', msg=>{
      this.setState({error: msg})
    })
  }

  render() {
    return (
      <div>
        <h4>Welcome, {this.state.user.name}</h4>
        <h3 style={{color: "red"}}>{this.state.error}</h3>
        <div className = "documents">
          <Header as="h3">My documents</Header>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <NewDocModal func={this.new.bind(this)} button="Create"
                             head = "Create Doc"
                             title="Create a new document"
                             placeholder="Document Title"/>
              </Grid.Column>
              <Grid.Column width={4}>
                <NewDocModal func={this.add.bind(this)} button="Add"
                             head = "Add Doc"
                             title="Add an existing document"
                             placeholder="Document Key"/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {this.state.docs.map(doc => <div style={{border: "1px solid black", borderRadius:"5px", margin:"5px", padding:"5px"}}>
            <Header as="h4"><Link to={{pathname: "/doc", state: {doc:doc, user: this.state.user}}}>{doc.title}</Link></Header>
            <p>Author: {doc.author.name}</p></div>)}
        </div>
      </div>);
  }
}
