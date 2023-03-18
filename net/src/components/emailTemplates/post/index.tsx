/* eslint-disable @next/next/no-img-element */
import { dateStr, getUnsubscribeLink, ParsedPost } from 'data';

type PostTemplateProps = {
  post: ParsedPost;
};

const clickToTweetLink = (url: string) => {
  const encodedUrl = encodeURI(url);
  return `https://twitter.com/intent/tweet?via=nosajio&url=${encodedUrl}`;
};

const PostTemplate = ({ post }: PostTemplateProps) => {
  const unsubscribeUrl = getUnsubscribeLink('{{TOKEN}}', post.id);
  return (
    <>
      {/* Preview text */}
      {/* see: https://www.litmus.com/blog/the-little-known-preview-text-hack-you-may-want-to-use-in-every-email/ */}
      <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>
        {post.subtitle}
      </div>

      <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>
        &#847; &zwnj; &nbsp; &#8199; &#65279; &#847; &zwnj; &nbsp; &#8199;
        &#65279; &#847; &zwnj; &nbsp; &#8199; &#65279; &#847; &zwnj; &nbsp;
        &#8199; &#65279; &#847; &zwnj; &nbsp; &#8199; &#65279; &#847; &zwnj;
        &nbsp; &#8199; &#65279; &#847; &zwnj; &nbsp; &#8199; &#65279; &#847;
        &zwnj; &nbsp; &#8199; &#65279;
      </div>

      {/* Email body */}
      <div
        style={{
          padding: '0 20px',
        }}
      >
        <table
          role="presentation"
          width="100%"
          border={0}
          cellSpacing={0}
          cellPadding={0}
        >
          <tbody>
            <tr>
              <td />
              <td align="left" width="550">
                <div
                  style={{
                    fontSize: '17px',
                    lineHeight: '28px',
                    margin: '32px auto',
                    maxWidth: '550px',
                    width: '100%',
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <a
                      href={`https://nosaj.io/r/${post.slug}?utm_source=email`}
                    >
                      Read in browser
                    </a>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#b5b5b5',
                      }}
                    >
                      {post.pubdate_str || dateStr(new Date())} &nbsp; | &nbsp;
                      By Jason
                    </div>
                    <h1
                      style={{
                        fontSize: '32px',
                        fontWeight: 500,
                        lineHeight: '37px',
                        margin: '0.5em 0 1em',
                      }}
                    >
                      {post.title}
                    </h1>
                    <p
                      style={{
                        fontSize: '20px',
                        lineHeight: '30px',
                        margin: 0,
                      }}
                    >
                      {post.subtitle}
                    </p>
                  </div>

                  {post?.cover_image && (
                    <div style={{ margin: '32px 0' }}>
                      <img
                        src={post.cover_image}
                        alt={`Cover for ${post.title}`}
                        style={{ display: 'block', width: '100%' }}
                      />
                    </div>
                  )}

                  <div dangerouslySetInnerHTML={{ __html: post.body_html }} />
                </div>
              </td>
              <td />
            </tr>
            <tr>
              <td />
              <td align="left" width="550">
                <p
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    fontSize: '18px',
                  }}
                >
                  <a href={clickToTweetLink(`https://nosaj.io/r/${post.slug}`)}>
                    Respond to this post on Twitter
                  </a>
                </p>
                <p
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    fontSize: '16px',
                  }}
                >
                  Or reply to this email.
                </p>
              </td>
            </tr>
            <tr>
              <td />
              <td align="left" width="550">
                <p
                  style={{
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  <a href={`https://nosaj.io/r/${post.slug}?utm_source=email`}>
                    Read in browser
                  </a>
                </p>
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    display: 'block',
                  }}
                >
                  &copy; Jason Howmans {new Date().getFullYear()} -{' '}
                  <a href="https://nosaj.io?utm_source=email">nosaj.io</a>
                </p>
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '16px',
                    display: 'block',
                  }}
                >
                  <a
                    style={{
                      opacity: 0.6,
                    }}
                    href={unsubscribeUrl}
                  >
                    Unsubscribe
                  </a>
                </p>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PostTemplate;
