import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

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
    this.state = {
      editorState: EditorState.createEmpty(),
      id: "",
      title: "",
      author: "",
      content: "",
    };
    this.onChange = (editorState) => this.setState({ editorState });
  }

  componentDidMount(){
    fetch(`http://127.0.0.1:1337/doc/${this.props.location.state.id}`)
    .then(get => get.json())
    .then(docObj => {
      this.setState({
        id: docObj._id,
        title: docObj.title,
        author: docObj.author.name,
        content: docObj.content
      })})
  }

  toggleInlineStyle(e, inlineStyle) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  toggleBlockType(e, blockType) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  save(string){
    fetch(`http://127.0.0.1:1337/doc/${this.state.id}`,
      { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc: this.state.add,
          user: this.state.user,
          password: 123,
        }),
      }).then();
  }

  render() {
    return (
      <div>
        <h3>{this.state.title}</h3>
        <p>Author: {this.state.author}</p>
        <p>Shareable Document ID: {this.state.id}</p>
        <button onClick={this.save.bind(this, this.state.content)}>Save Changes</button>
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
      </div>
    );
  }
}
