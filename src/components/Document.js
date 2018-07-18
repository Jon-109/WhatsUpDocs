import { Editor, EditorState, RichUtils, CharacterMetadata } from 'draft-js';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import React, {Component, PropTypes} from 'react';
import RichTextEditor from 'react-rte';
import createStyles from 'draft-js-custom-styles';
import ColorPicker, {colorPickerPlugin} from 'draft-js-color-picker'

const numbers = ['8px', '12px', '16px', '24px', '48px', '72px'];
const fonts = ['Times New Roman', 'Arial', 'Helvetica', 'Courier', 'Verdana', 'Tahoma'];

const styleMap = {
  UPPERCASE: {
    textTransform: 'uppercase',
  },
  LOWERCASE: {
    textTransform: 'lowercase',
  },
  '8px': {
    fontSize: '8px',
  },
  '12px': {
    fontSize: '12px',
  },
  '16px': {
    fontSize: '16px',
  },
  '24px': {
    fontSize: '24px',
  },
  '48px': {
    fontSize: '48px',
  },
  '72px': {
    fontSize: '72px',
  },
  'Times New Roman': {
    fontFamily: 'Times New Roman',
  },
  Arial: {
    fontFamily: 'Arial',
  },
  Helvetica: {
    fontFamily: 'Helvetica',
  },
  Courier: {
    fontFamily: 'Courier',
  },
  Verdana: {
    fontFamily: 'Verdana',
  },
  Tahoma: {
    fontFamily: 'Tahoma',
  },
  HIGHLIGHT: {
    backgroundColor: 'yellow',
  },
};


const presetColors = [
  '#ff00aa',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
];

function rgbaToHex (rgba) {
    var parts = rgba.substring(rgba.indexOf("(")).split(","),
        r = parseInt(parts[0].substring(1).trim(), 10),
        g = parseInt(parts[1].trim(), 10),
        b = parseInt(parts[2].trim(), 10),
        a = parseFloat(parts[3].substring(0, parts[3].length - 1).trim()).toFixed(2);

    return ('#' + r.toString(16) + g.toString(16) + b.toString(16) + (a * 255).toString(16).substring(0,2));
}

const getBlockStyle = (block) => {
    switch (block.getType()) {
        case 'left':
            return 'align-left';
        case 'center':
            return 'align-center';
        case 'right':
            return 'align-right';
        default:
            return null;
    }
}

const customStyleMap = {
 MARK: {
   backgroundColor: 'Yellow',
   fontStyle: 'italic',
 },
};

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'text-transform'], 'CUSTOM_', customStyleMap);

export default class Document extends React.Component {
  constructor(props){
    super(props);
    let editorState = EditorState.createEmpty();


    this.onChange = editorState => this.setState({editorState});
    this.getEditorState = () => this.state.editorState;
    this.onChange = (editorState) => this.setState({editorState});
    this.picker = colorPickerPlugin(this.onChange, this.getEditorState);

    this.state = {
      editorState: editorState,
      color: 'black'
    };

  }


  toggleInlineStyle(e, inlineStyle) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  toggleBlockType(e, blockType) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  toggleFontSize(e) {
    // e.preventDefault();
    e.target.blur();
    const fontSize = e.target.value;
    const newEditorState = styles.fontSize.toggle(this.state.editorState, fontSize);

    return this.onChange(newEditorState);
  };

  applyColor() {
    let hex = rgbaToHex(String(this.state.color)).slice(1)
    if(!styleMap[hex]){
      styleMap[hex] = {'color': this.state.color}
    }
    console.log(styleMap);
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, hex))
  }

  onUndo() {
    this.onChange(EditorState.undo(this.state.editorState));
  }

  onRedo() {
    this.onChange(EditorState.redo(this.state.editorState));
  }

  isSelection = (editorState) => {
    const selection = editorState.getSelection();
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    return start !== end;
};

  onChange(editorState) {
  if (!this.isSelection(editorState)) {
    return;
  }
  editorState = RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT');
  this.setState({editorState});
}

  render() {
    const options = x => x.map(fontSize => {
      return <option key={fontSize} value={fontSize}>{fontSize}</option>;
    });
    return (

      <div>
        <h1 className="header">Whats Up DOCS</h1>
        <div className="editor">
          <div className="toolbar">
            <button className="button" onMouseDown={e => this.toggleInlineStyle(e, 'BOLD')}><span className="glyphicon glyphicon-bold"></span></button>
            <button className="button" onMouseDown={e => this.toggleInlineStyle(e, 'ITALIC')}><span className="glyphicon glyphicon-italic"></span></button>
            <button className="button" onMouseDown={e => this.toggleInlineStyle(e, 'UNDERLINE')}><i className="fa fa-underline"></i></button>
            <button className="button" onMouseDown={e => this.toggleInlineStyle(e, 'STRIKETHROUGH')}><i className="	fa fa-strikethrough"></i></button>
            <button className="button" onMouseDown={e => this.toggleInlineStyle(e, 'HIGHLIGHT')}>Highlight</button>
            <button className="button" onMouseDown={e => this.toggleInlineStyle(e, 'UPPERCASE')}>ABC</button>
            <button className="button" onMouseDown={e => this.toggleInlineStyle(e, 'LOWERCASE')}>abc</button>
            <button className="button" onClick={this.onUndo.bind(this)}><i className="material-icons">&#xe166;</i></button>
            <button className="button" onClick={this.onRedo.bind(this)}><i className="material-icons">&#xe15a;</i></button>
            <button className="button" onMouseDown={e => this.toggleBlockType(e, 'unordered-list-item')}><i className="fa fa-list-ul"></i></button>
            <button className="button" onMouseDown={e => this.toggleBlockType(e, 'ordered-list-item')}><i className="fa fa-list-ol"></i></button>
            <button className="button" onMouseDown={e => this.toggleBlockType(e, 'header-one')}>H1</button>
            <button className="button" onMouseDown={e => this.toggleBlockType(e, 'header-two')}>H2</button>
            <button className="button" onMouseDown={e => this.toggleBlockType(e, 'header-three')}>H3</button>
            <button className="button" onMouseDown={e => this.toggleBlockType(e, 'header-four')}>H4</button>
            <button className="button" onMouseDown={e => this.toggleBlockType(e, 'header-five')}>H5</button>
            <button className="button" onMouseDown={e => this.toggleBlockType(e, 'header-six')}>H6</button>
            <button className="colorpicker"> Font Color
              <ColorPicker
                toggleColor={color => {
                  this.setState({
                    color: color
                  })
                  this.picker.addColor(color)
                  this.applyColor()
                }}
                presetColors = {presetColors}
                color={this.state.color}
              />
            </button>
            <br></br>
            <button className="align-left" onMouseDown={e => this.toggleBlockType(e, 'left')}><span className="glyphicon glyphicon-align-left"></span></button>
            <button className="align-center" onMouseDown={e => this.toggleBlockType(e, 'center')}><span className="glyphicon glyphicon-align-center"></span></button>
            <button className="align-left" onMouseDown={e => this.toggleBlockType(e, 'right')}><span className="glyphicon glyphicon-align-right"></span></button>
            <select className="button" onChange={e => this.toggleInlineStyle(e, e.target.value)}>
              {numbers.map(item => <option key={item}>{item}</option>)}
            </select>
            <select className="button" onChange={e => this.toggleInlineStyle(e, e.target.value)}>
              {fonts.map(item => <option key={item}>{item}</option>)}
            </select>


          </div>
          <div className="textbox">
            <Editor
              editorState={this.state.editorState}
              customStyleMap={styleMap}
              onChange={this.onChange}
              placeholder="Click here to begin writing..."
              customStyleFn={customStyleFn}
              blockStyleFn={getBlockStyle}
              onChange={this.onChange}
              onTab={this.onTab}
              readOnly={this.state.readOnly}
            />
          </div>
        </div>
      </div>
    );
  }
}
