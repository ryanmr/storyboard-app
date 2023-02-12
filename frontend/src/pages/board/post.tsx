import Head from "next/head";
import { Post } from "../../library/types";

interface Props {
  posts: Post[];
}

export default function PostPage({ posts }: Props) {
  return (
    <>
      <Head>
        <title>Post to the board &raquo; Storyboard</title>
        <meta name="description" content="Post to the board" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container p-4 mx-auto">
        <h1 className="mb-4 text-3xl font-bold">New Post</h1>
        <div>
          <form>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label>Title</label>
                <input
                  id=""
                  required
                  className="w-full p-2 border rounded border-stone-500"
                />
              </div>
              <div className="flex flex-col">
                <label>Content</label>
                <textarea
                  rows={6}
                  required
                  className="w-full p-2 border rounded border-stone-500"
                ></textarea>
                <p className="text-xs">
                  <b>info</b> you have 1950 characters left
                </p>
              </div>
              <div className="flex flex-col">
                <label>Author</label>
                <input
                  id=""
                  required
                  className="w-full p-2 border rounded border-stone-500"
                />
                <p className="text-xs">
                  <b>info</b> your name will be visible
                </p>
              </div>
              <div>
                <button className="w-full p-2 font-bold text-gray-100 bg-stone-900 hover:bg-black hover:text-white">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
