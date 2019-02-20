import React, { Component } from 'react';
import cn from 'classnames';
import { isEqual } from 'lodash';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

/**
 * Компонент TextEditor
 * @param value - значение разметки
 * @param onChange - callback на изменение значения
 * @param onFocus - callback на фокус
 * @param onBlur - callback на потерю фокуса
 * @param disabled - флаг активности
 * @param visible - флаг видимости
 * @param className - класс компонента
 * @param toolbarConfig - настройка тулбара
 *
 * @example
 * toolbar: {
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: true },
  }
 */
class TextEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: this.convertToEditorState(props.value),
      value: props.value
    };

    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.value, this.props.value)) {
      this.setState({
        editorState: EditorState.moveFocusToEnd(this.convertToEditorState(this.props.value)),
        value: this.props.value
      });
    }
  }

  convertToHtml(editorState) {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }

  convertToEditorState(value) {
    const contentBlock = htmlToDraft(value);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }

    return EditorState.createEmpty();
  }

  onEditorStateChange(editorState) {
    const { onChange } = this.props;
    const value = this.convertToHtml(editorState);
    onChange && onChange(value);
    this.setState({ editorState, value });
  }

  render() {
    const { className, disabled, visible, onFocus, onBlur, toolbarConfig } = this.props;
    const { editorState } = this.state;
    const baseStyle = {
      wordBreak: 'break-all',
      wordWrap: 'break-word',
      maxWidth: '100%'
    };
    const disabledStyle = {
      pointerEvents: 'none',
      opacity: '0.4'
    };
    return (
      <div style={disabled ? { ...baseStyle, ...disabledStyle } : baseStyle}>
        {visible && (
          <Editor
            onFocus={onFocus}
            onBlur={onBlur}
            editorState={editorState}
            wrapperClassName={cn('n2o-text-editor-wrapper')}
            editorClassName={cn('n2o-text-editor', className)}
            onEditorStateChange={this.onEditorStateChange}
            toolbar={toolbarConfig}
          />
        )}
      </div>
    );
  }
}

TextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  className: PropTypes.string,
  toolbarConfig: PropTypes.object
};
TextEditor.defaultProps = {
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  disabled: false,
  visible: true,
  value: ''
};

export default TextEditor;
