import React, { useState } from 'react';
import './rich-editor.css';

const RichEditor = (props) => {
  const { value = '', onChange, config = {} } = props;
  const [content, setContent] = useState(value);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const handleInputChange = (e) => {
    handleContentChange(e.target.value);
  };

  const formatText = (formatType) => {
    let newContent = content;
    const textarea = document.getElementById('rich-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (!selectedText) return;

    switch (formatType) {
      case 'bold':
        newContent = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        break;
      case 'italic':
        newContent = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        break;
      case 'underline':
        newContent = content.substring(0, start) + `__${selectedText}__` + content.substring(end);
        break;
      case 'link':
        const url = prompt('请输入链接地址:', 'https://');
        if (url) {
          newContent = content.substring(0, start) + `[${selectedText}](${url})` + content.substring(end);
        }
        break;
      default:
        break;
    }

    handleContentChange(newContent);
    // 重新聚焦并恢复选择
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, newContent.length - content.length + end);
    }, 0);
  };

  return (
    <div className="rich-editor">
      <div className="editor-toolbar">
        <button 
          className="toolbar-btn" 
          onClick={() => formatText('bold')}
          title="加粗"
        >
          B
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => formatText('italic')}
          title="斜体"
        >
          I
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => formatText('underline')}
          title="下划线"
        >
          U
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => formatText('link')}
          title="插入链接"
        >
          🔗
        </button>
        <div className="toolbar-divider"></div>
        <button className="toolbar-btn" title="插入图片">
          📷
        </button>
        <button className="toolbar-btn" title="插入表情">
          😊
        </button>
      </div>
      <textarea
        id="rich-textarea"
        className="editor-content"
        value={content}
        onChange={handleInputChange}
        placeholder={config.placeholder || "请输入内容..."}
        rows={config.rows || 10}
      />
      <div className="editor-footer">
        <span className="char-count">{content.length} 字符</span>
      </div>
    </div>
  );
};

export default RichEditor;