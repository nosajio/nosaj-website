import MDEditor from '@uiw/react-md-editor';
import clsx from 'clsx';
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
        {/* <textarea
          value={body}
          onChange={e => onChange('body_md', e.target.value)}
          className={s.mdEditor}
        /> */}
      </div>
    </div>
  );
};

type EditPostPageProps = {
  newPost?: boolean;
  title: string;
  subtitle: string;
  coverUrl: string;
  bodyMd: string;
  slug: string;
  onChange: (
    field: 'title' | 'subtitle' | 'body_md' | 'slug' | 'cover_url',
    value: string,
  ) => void;
  onSave: (draft: boolean) => void;
  onPreview: () => void;
};

const EditPostPage = ({
  newPost,
  title,
  subtitle,
  coverUrl,
  bodyMd,
  slug,
  onPreview,
  onChange,
  onSave,
}: EditPostPageProps) => {
  const handleChange = (
    field: 'title' | 'subtitle' | 'body_md' | 'slug' | 'cover_url',
    value: string,
  ) => {
    onChange(field, value);
  };

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
          <button
            onClick={() => onPreview()}
            className={clsx(s.controls__button, s.controls__buttonInverted)}
          >
            Preview
          </button>
        </div>
        <label className={s.controls__row}>
          <div className={s.controls__label}>Slug</div>
          <input
            type="text"
            placeholder="slug-for-url"
            value={slug}
            onChange={e => handleChange('slug', e.target.value)}
            className={s.controls__input}
          />
        </label>
        <label className={s.controls__row}>
          <div className={s.controls__label}>Cover URL</div>
          <input
            type="url"
            placeholder="https://assets.nosaj.io/..."
            value={coverUrl}
            onChange={e => handleChange('cover_url', e.target.value)}
            className={s.controls__input}
          />
        </label>
        <div className={s.controls__row}>
          <button
            onClick={() => onSave(false)}
            className={clsx(s.controls__button, s.controls__buttonPrimary)}
          >
            Save draft
          </button>
        </div>
        {!newPost && (
          <div className={s.controls__row}>
            <button onClick={() => onSave(true)} className={s.controls__button}>
              Publish
            </button>
          </div>
        )}
      </aside>
    </section>
  );
};

export default EditPostPage;
