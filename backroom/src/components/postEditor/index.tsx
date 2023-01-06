import { EditorState, Editor } from 'draft-js';
import { useState, useEffect } from 'react';
import s from './postEditor.module.scss';
import clsx from 'clsx';
import { stateToHTML } from 'draft-js-export-html';
import 'draft-js/dist/Draft.css';

const RichText = ({ onChange }: { onChange: (value: string) => void }) => {
  const [editor, setEditor] = useState<EditorState>(EditorState.createEmpty());
  const contentState = editor.getCurrentContent();

  useEffect(() => {
    const contentHTML = stateToHTML(contentState);
    onChange(contentHTML);
  }, [contentState, onChange]);

  return (
    <>
      {editor && (
        <div className={s.editor_chrome}>
          <div className={s.editor_toolbar}>
            <div className={clsx(s.toolbar_bold, s.toolbar_button)}>Bold</div>
            <div className={clsx(s.toolbar_italic, s.toolbar_button)}>
              Italic
            </div>
            <div className={clsx(s.toolbar_h1, s.toolbar_button)}>H1</div>
            <div className={clsx(s.toolbar_h2, s.toolbar_button)}>H2</div>
            <div className={clsx(s.toolbar_h3, s.toolbar_button)}>H3</div>
            <div className={clsx(s.toolbar_h4, s.toolbar_button)}>H4</div>
            <div className={clsx(s.toolbar_h5, s.toolbar_button)}>H5</div>
          </div>
          <Editor editorState={editor} onChange={setEditor} />
        </div>
      )}
    </>
  );
};

type PostEditorProps = {
  onSetTitle?: (title: string) => void;
  onChange: (field: 'title' | 'subtitle' | 'post', value: string) => void;
  title: string;
  subtitle: string;
  post: string;
  autosave?: boolean;
};

const PostEditor = ({
  autosave = false,
  onChange,
  title,
  subtitle,
  onSetTitle,
}: PostEditorProps) => {
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved'>(
    'unsaved',
  );
  const handleChange =
    (field: 'title' | 'subtitle' | 'post') => (value: string) => {
      onChange(field, value);
    };

  // Autosave effect - debounced save after every change
  useEffect(() => {
    // setSaveStatus('saving');
  }, []);

  const handleTitleBlur = () => {
    if (title && onSetTitle) {
      onSetTitle(title);
    }
  };

  const saveText =
    saveStatus === 'saved'
      ? 'Saved'
      : saveStatus === 'saving'
      ? 'Saving...'
      : 'Unsaved changes';

  return (
    <div className={s.post_editor_root}>
      <div className={s.autosave_status}>{saveText}</div>
      <div className={s.field_row}>
        <input
          type="text"
          className={clsx(s.title_field, s.base_field)}
          value={title}
          onChange={e => handleChange('title')(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Title"
        />
      </div>
      <div className={s.field_row}>
        <textarea
          className={clsx(s.subtitle_field, s.base_field)}
          value={subtitle}
          onChange={e => handleChange('subtitle')(e.target.value)}
          placeholder="Subtitle"
        />
      </div>
      <div className={s.field_row}>
        <RichText onChange={handleChange('post')} />
      </div>
    </div>
  );
};

export default PostEditor;
