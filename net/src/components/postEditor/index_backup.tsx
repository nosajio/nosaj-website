import { EditorState, Editor, convertFromHTML, ContentState } from 'draft-js';
import { useState, useEffect, useCallback, useRef } from 'react';
import s from './postEditor.module.scss';
import clsx from 'clsx';

const RichText = ({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value?: string;
}) => {
  const blocksFromValue = value ? convertFromHTML(value) : undefined;
  const initialState =
    blocksFromValue &&
    ContentState.createFromBlockArray(
      blocksFromValue.contentBlocks,
      blocksFromValue.entityMap,
    );
  const [editor, setEditor] = useState<EditorState>(
    initialState
      ? EditorState.createWithContent(initialState)
      : EditorState.createEmpty(),
  );
  const contentState = editor.getCurrentContent();
  const contentHTML = stateToHTML(contentState);
  const lastContentHTML = useRef<string>(contentHTML);

  useEffect(() => {
    if (lastContentHTML.current !== contentHTML) {
      onChange(contentHTML);
      lastContentHTML.current = contentHTML;
    }
  }, [contentHTML, onChange]);

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
  saveStatus?: 'unsaved' | 'saving' | 'saved';
};

const PostEditor = ({
  onChange,
  title,
  subtitle,
  post,
  onSetTitle,
  saveStatus,
}: PostEditorProps) => {
  const handleChange = useCallback(
    (field: 'title' | 'subtitle' | 'post') => (value: string) => {
      onChange(field, value);
    },
    [onChange],
  );

  const handleTitleBlur = () => {
    if (title && onSetTitle) {
      // This event is used by the new post route to save the new post, get an
      // id, then navigate to the edit post route
      onSetTitle(title);
    }
  };

  const saveText = saveStatus
    ? saveStatus === 'saved'
      ? 'Saved'
      : saveStatus === 'saving'
      ? 'Saving...'
      : 'Unsaved changes'
    : undefined;

  return (
    <div className={s.post_editor_root}>
      {saveText && <div className={s.autosave_status}>{saveText}</div>}
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
        <RichText onChange={handleChange('post')} value={post} />
      </div>
    </div>
  );
};

export default PostEditor;
