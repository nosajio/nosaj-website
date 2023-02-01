import MDEditor from '@uiw/react-md-editor';
import clsx from 'clsx';
import { useCallback } from 'react';
import s from './postEditor.module.scss';

type EditorProps = {
  value: string;
  onChange: (nextVal?: string) => void;
};

const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <div className={s.editor__chrome}>
      <MDEditor value={value} onChange={onChange} preview="edit" />
    </div>
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
    (field: 'title' | 'subtitle' | 'post') => (value?: string) => {
      onChange(field, value ?? '');
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
        <Editor value={post} onChange={handleChange('post')} />
        {/* <RichText onChange={handleChange('post')} value={post} /> */}
      </div>
    </div>
  );
};

export default PostEditor;
