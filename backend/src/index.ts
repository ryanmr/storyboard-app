import { Hono } from "hono";
import { cors } from "hono/cors";

import { z } from "zod";

const NewPostSchema = z.object({
  author: z.string().min(3).max(60),
  author_code: z.string().length(64),
  title: z.string().min(3).max(60),
  body: z.string().min(3).max(2000),
  topic_id: z.number(),
});

type NewPost = z.infer<typeof NewPostSchema>;

const UpdatePostSchema = z.object({
  author: z.string().min(3).max(60),
  author_code: z.string().length(64),
  title: z.string().min(3).max(60),
  body: z.string().min(3).max(2000),
});

type UpdatePost = z.infer<typeof UpdatePostSchema>;

type Post = {
  id: number;
  author: string;
  author_code: string;
  title: string;
  body: string;
  topic_id: number;
  created_at: string;
};

/**
 * Bindings.
 */
interface Bindings {
  /**
   * Cloudflare D1 sqlite database.
   */
  DB: D1Database;

  /**
   * API KEY. Set via Cloudflare secrets.
   */
  API_KEY: string;
}

interface HonoConfig {
  Bindings: Bindings;
}

const app = new Hono<HonoConfig>();

app.use("/api/*", cors());

/**
 * Root.
 */
app.get("/", async (c) => {
  return c.json({ project: "storyboard-app", emoji: "📕", time: Date.now() });
});

/**
 * Posts.
 */
app.get("/api/posts", async (c) => {
  console.log("GET posts");

  const { results } = await c.env.DB.prepare(
    `select * from posts where hidden = 0`
  )
    .bind()
    .all();

  const posts = results as Post[];

  const sanitized = posts.map(({ author_code: _, ...rest }) => rest);

  return c.json(sanitized);
});

/**
 * Post.
 */
app.get("/api/posts/:id", async (c) => {
  console.log("GET post");

  const { id } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from posts where id = ? and hidden = 0`
  )
    .bind(id)
    .all();

  return c.json(results);
});

/**
 * New post.
 */
app.post("/api/posts", async (c) => {
  console.log("POST posts");

  // client side secret key; the slightest bit of extra security
  if (c.req.headers.get("x-not-very-secret-key") !== c.env.API_KEY) {
    c.status(401);
    return c.json({ message: "unauthorized", error: true });
  }

  const possibleNewPost = await c.req.json<
    Partial<NewPost & { email: string }>
  >();

  // honeypot; slightest bit of extra security
  if (possibleNewPost.email) {
    c.status(404);
    return c.json({ message: "not found", error: true });
  }

  const validationResult = NewPostSchema.safeParse(possibleNewPost);

  if (!validationResult.success) {
    const err = validationResult.error;
    c.status(400);
    return c.json(err.errors);
  }

  const newPost = validationResult.data;

  console.log("new post validated", newPost);

  const dbResult = await c.env.DB.prepare(
    `
  insert into posts (author, author_code, title, body, topic_id, created_at)
  values (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      newPost.author,
      newPost.author_code,
      newPost.title,
      newPost.body,
      newPost.topic_id,
      new Date().toISOString()
    )
    .run();

  console.log("new post saved", dbResult.success);

  if (dbResult.success) {
    c.status(201);
    return c.json({ message: "post saved" });
  } else {
    c.status(500);
    return c.json({ message: "something went wrong", error: true });
  }
});

/**
 * Update post.
 */
app.put("/api/posts/:id", async (c) => {
  console.log("PUT post");

  // client side secret key; the slightest bit of extra security
  if (c.req.headers.get("x-not-very-secret-key") !== c.env.API_KEY) {
    c.status(401);
    return c.json({ message: "unauthorized", error: true });
  }

  const possibleUpdatePost = await c.req.json<
    Partial<UpdatePost & { email: string }>
  >();

  // honeypot; slightest bit of extra security
  // todo: we could move this to next
  // if we run api requests through its api backend
  if (possibleUpdatePost.email) {
    c.status(404);
    return c.json({ message: "not found", error: true });
  }

  const { id } = c.req.param();

  // we could also detect author_code here
  // and return 404 or forbidden
  const dbSelectResult = await c.env.DB.prepare(
    `select * from posts where id = ? and hidden = 0`
  )
    .bind(id)
    .all();

  if (!dbSelectResult.success) {
    c.status(404);
    return c.json({ message: "not found", error: true });
  }

  const validationResult = UpdatePostSchema.safeParse(possibleUpdatePost);

  if (!validationResult.success) {
    const err = validationResult.error;
    c.status(400);
    return c.json(err.errors);
  }

  const updatePost = validationResult.data;

  // we will update by id and author_code
  // this way the sender must know the original author code
  // otherwise they cannot mutate that post
  const dbUpdateResult = await c.env.DB.prepare(
    `update posts set title = ?, author = ?, body = ? where id = ? and author_code = ?`
  )
    .bind(
      updatePost.title,
      updatePost.author,
      updatePost.body,
      id,
      updatePost.author_code
    )
    .all();

  if (dbUpdateResult.success) {
    c.status(202);
    return c.json({ message: "post updated" });
  } else {
    c.status(500);
    return c.json({ message: "something went wrong", error: true });
  }
});

const NewTopicSchema = z.object({
  title: z.string().min(3).max(100),
});

type NewTopic = z.infer<typeof NewTopicSchema>;

type Topic = { id: number; title: string; created_at: string };

/**
 * Get topics.
 */
app.get("/api/topics", async (c) => {
  console.log("GET topics");

  const { results } = await c.env.DB.prepare(
    `select * from topics where hidden = 0`
  )
    .bind()
    .all();

  const topics = results as Topic[];

  return c.json(topics);
});

/**
 * Get posts by topic.
 */
app.get("/api/topics/:id/posts", async (c) => {
  console.log("GET posts by topic id");

  const { id } = c.req.param();

  // todo: should check for topic hidden = 0 as well
  const { results } = await c.env.DB.prepare(
    `select * from posts where hidden = 0 and topic_id = ?`
  )
    .bind(id)
    .all();

  const posts = results as Post[];

  const sanitized = posts.map(({ author_code: _, ...rest }) => rest);

  return c.json(sanitized);
});

/**
 * Post topic.
 */
app.post("/api/topics", async (c) => {
  console.log("POST topic");

  const possibleNewTopic = await c.req.json<
    Partial<NewTopic & { email: string }>
  >();

  const validationResult = NewTopicSchema.safeParse(possibleNewTopic);

  if (!validationResult.success) {
    c.status(400);
    return c.json(validationResult.error.errors);
  }

  const newTopic = validationResult.data;

  const dbResult = await c.env.DB.prepare(
    `
  insert into topics (title, created_at)
  values (?, ?)`
  )
    .bind(newTopic.title, new Date().toISOString())
    .run();

  console.log("new topic saved", dbResult.success);

  if (dbResult.success) {
    c.status(201);
    return c.json({ message: "topic saved" });
  } else {
    c.status(500);
    return c.json({ message: "something went wrong", error: true });
  }
});

export default app;
