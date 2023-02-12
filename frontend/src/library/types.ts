export interface Post {
  id: number;
  author: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string | null;
  topic_id: number;
  hidden: 0 | 1;
}
