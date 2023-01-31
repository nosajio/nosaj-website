import PostTemplate from 'components/emailTemplates/post';
import { Post } from 'data';
import { renderToStaticMarkup } from 'react-dom/server';

export const generatePostTemplate = (post: Post) => {
  const html = renderToStaticMarkup(<PostTemplate post={post} />);
  return html;
};

export const replaceTokenInHTML = (postHtml: string, token: string) =>
  postHtml.replace('{{TOKEN}}', token);
