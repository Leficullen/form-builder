import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import { app } from '../../../../backend/src/app';

// Next.js Pages Router API Config
export const config = {
  api: {
    externalResolver: true,
    bodyParser: false, // Express will handle body parsing
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Pass the request and response to the Express app
  return app(req, res);
}
