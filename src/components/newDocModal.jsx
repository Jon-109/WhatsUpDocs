import React from 'react';
import { Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import { Header, Form, Button } from 'semantic-ui-react';

Modal.setAppElement('#App');

export default class NewDocModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      title: "",
      password: "",
    };
    this.create = this.create.bind(this);
  }

  create(){
    this.props.func(this.state.title, this.state.password);
    this.setState({
      modalIsOpen: false,
    })
  }

  render() {
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    return (
      <div>
        <Button onClick={()=>this.setState({modalIsOpen:true})}>{this.props.head}</Button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <Header as="h3">{this.props.title}</Header>
          <Form>
            <Form.Input placeholder={this.props.placeholder} value={this.state.title} onChange={(e)=>{this.setState({title:e.target.value})}}/>
            <Form.Input placeholder="Password Key" value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}}/>
            <Button type="submit" onClick={this.create}>Create</Button>
            <Button onClick={()=>{this.setState({modalIsOpen:false})}}>Cancel</Button>
          </Form>
        </Modal>
      </div>
  );
  }
}
