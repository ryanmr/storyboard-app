import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { API } from "../../library/api";
import { Post } from "../../library/types";

interface Props {
  posts: Post[];
}

export default function Board({ posts }: Props) {
  return (
    <>
      <Head>
        <title>Board &raquo; Storyboard</title>
        <meta name="description" content="The board" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container p-4 mx-auto">
        <h1 className="mb-4 text-3xl font-bold">Posts</h1>
        <div className="flex flex-col gap-4">
          {posts.map((post) => {
            return (
              <div key={post.id} className="p-4 rounded bg-stone-200">
                <h2 className="text-lg font-bold">{post.title}</h2>
                <div className="py-2">{post.body}</div>
                <hr />
                <div className="text-xs">
                  <p>posted by {post.author}</p>
                  <p>posted on {post.created_at}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const endpoint = `${API}/api/posts`;
  const response = await fetch(endpoint);

  const posts = await response.json();

  return { props: { posts } };
}
