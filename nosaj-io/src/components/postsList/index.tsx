import { JSONPost } from 'data';
import s from './postsList.module.scss';
import Link from 'next/link';

type PostsListProps = {
  posts: JSONPost[];
};

const PostsList = ({ posts }: PostsListProps) => {
  return (
    <ul className={s.posts_list}>
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
};

const PostItem = ({ post }: { post: JSONPost }) => {
  return (
    <li className={s.post_li}>
      <Link href={`/${post.slug}`}>
        <div className={s.post_li_content}></div>
      </Link>
    </li>
  );
};

export default PostsList;
