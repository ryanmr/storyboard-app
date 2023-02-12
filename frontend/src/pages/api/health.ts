// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Health = {
  project: "storyboard-app";
  emoji: "📗";
  time: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Health>
) {
  const health: Health = {
    project: "storyboard-app",
    emoji: "📗",
    time: Date.now(),
  };
  res.status(200).json(health);
}
