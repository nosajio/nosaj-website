import MDEditor from '@uiw/react-md-editor';
import clsx from 'clsx';
import { useState } from 'react';
import s from './editPostPage.module.scss';

type EditorProps = {
  body: string;
  title: string;
  subtitle: string;
  onChange: (field: 'body_md' | 'title' | 'subtitle', nextVal: string) => void;
};

const Editor = ({ body, title, subtitle, onChange }: EditorProps) => {
  return (
    <div className={s.editor__chrome}>
      <div className={s.editor__titleFrame}>
        <input
          type="text"
          className={s.editor__titleInput}
          value={title}
          placeholder="Post Title"
          onChange={e => onChange('title', e.target.value)}
        />
      </div>
      <div className={s.editor__subtitleFrame}>
        <textarea
          name="subtitle"
          className={s.editor__subtitleInput}
          value={subtitle}
          placeholder="Subtitle..."
          onChange={e => onChange('subtitle', e.target.value)}
        />
      </div>
      <div className={s.editor__mdFrame}>
        <MDEditor
          value={body}
          onChange={v => onChange('body_md', v ?? '')}
          preview="edit"
        />
      </div>
    </div>
  );
};

type EditPostPageProps = {
  title: string;
  subtitle: string;
  bodyMd: string;
  slug: string;
  onChange: (
    field: 'title' | 'subtitle' | 'body_md' | 'slug',
    value: string,
  ) => void;
  onSave: (publish: boolean) => void;
};

const EditPostPage = ({
  title,
  subtitle,
  bodyMd,
  slug,
  onChange,
  onSave,
}: EditPostPageProps) => {
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved'>(
    'saved',
  );

  const handleChange = (
    field: 'title' | 'subtitle' | 'body_md' | 'slug',
    value: string,
  ) => {
    onChange(field, value);
  };

  // const publishUI = () => (
  //   <>
  //     <label className={s.input_field}>
  //       <span className={s.field_label}>Slug</span>
  //       <input
  //         value={slug}
  //         onChange={e => handleChange('slug', e.target.value)}
  //         type="text"
  //         className={s.field_input}
  //       />
  //     </label>
  //     <button className={s.main_button} onClick={handlePublish}>
  //       Publish post
  //     </button>
  //   </>
  // );

  const pageTitle = `Edit: ${title}`;

  return (
    <section className={s.postEditor}>
      <article className={s.postEditor__main}>
        <Editor
          title={title}
          subtitle={subtitle}
          onChange={handleChange}
          body={bodyMd}
        />
      </article>
      <aside className={s.postEditor__controls}>
        <div className={s.controls__row}>
          <button className={s.controls__button}>
            Save draft &amp; Preview
          </button>
        </div>
        <label className={s.controls__row}>
          <div className={s.controls__label}>Slug</div>
          <input
            type="text"
            placeholder="slug-for-url"
            className={s.controls__input}
          />
        </label>
        <label className={s.controls__row}>
          <div className={s.controls__label}>Cover URL</div>
          <input
            type="url"
            placeholder="https://assets.nosaj.io/..."
            className={s.controls__input}
          />
        </label>
        <div className={s.controls__row}>
          <button
            className={clsx(s.controls__button, s.controls__buttonPrimary)}
          >
            Save draft
          </button>
        </div>
      </aside>
    </section>
  );
};

export default EditPostPage;
