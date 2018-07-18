import React from 'react';
import { Header, Form, Button } from 'semantic-ui-react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, SelectionState } from 'draft-js';
const path = 'http://127.0.0.1:2000';
import socket from './../socket';

const styleMap = {
  'UPPERCASE': {
    textTransform: 'uppercase'
  },
  'LOWERCASE': {
    textTransform: 'lowercase'
  }
}

export default class EditDoc extends React.Component {
  constructor(props) {
    super(props);
    const editor = this.props.location.state.doc.content
               ? EditorState.createWithContent(convertFromRaw(this.props.location.state.doc.content))
               : EditorState.createEmpty();
    this.state = {
      editorState: editor,
      collaborators: this.props.location.state.doc.collaborators,
      id: this.props.location.state.doc._id,
      title: this.props.location.state.doc.title,
      author: this.props.location.state.doc.author,
      user: this.props.location.state.user,
      log: [],
      editColor: '',
    };
    this.onChange = (editorState) => {
      this.setState({ editorState });
      socket.emit('content',
                  convertToRaw(this.state.editorState.getCurrentContent()),
                  this.state.editorState.getSelection())
    };
  }

  componentDidMount(){
    socket.emit('join', this.state.id, this.state.user);
    socket.on('joined', (color) => {
      this.setState({ editColor: color });
    })
    socket.on('joinmsg', msg => {
      let tempArr = this.state.log.slice();
      tempArr.push(msg)
      this.setState({
        log: tempArr,
      })
    })

    socket.on('content', (msg, currentLoc) => {
      const editor = EditorState.createWithContent(convertFromRaw(msg));
      this.setState({ editorState: EditorState.forceSelection(editor, new SelectionState(currentLoc)) });
    })
  }

  toggleInlineStyle(e, inlineStyle) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  toggleBlockType(e, blockType) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  save(){
    socket.emit('save', this.state.id, convertToRaw(this.state.editorState.getCurrentContent()));
  }

  autoSave(){
    setInterval(this.save.bind(this), 30000);
  }

  render() {
    return (
      <div>
        {/* <h3>{this.state.title}</h3>
        <p>Author: {this.state.author.name}</p>
        <p>Collaborators:
          {this.state.collaborators.map(user=><li>{user.name}</li>)}
        </p>
        <p>Shareable Document ID: {this.state.id}</p> */}
        <button onClick={this.save.bind(this)}>Save Changes</button>
        {this.autoSave.bind(this)}
        <div className="editor">
          <div className="toolbar">
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>B</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>I</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>U</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>S</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>ABC</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>xyz</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'unordered-list-item')}>Unordered List Item</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'ordered-list-item')}>Ordered List Item</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'header-one')}>H1</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'header-two')}>H2</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'header-three')}>H3</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'header-four')}>H4</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'header-five')}>H5</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'header-six')}>H6</button>
          </div>
          <Editor editorState={this.state.editorState} onChange={this.onChange}/>
        </div>
        <div style={{border:"1px solid black", marginTop: "2em"}}>
          <p><u>Edit Log</u></p>
          {this.state.log.map(msg => <li>{msg}</li>)}
        </div>
      </div>
    );
  }
}
