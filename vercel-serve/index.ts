import express from 'express';
// @ts-ignore
import { app } from '../backend/src/app';

const vercelApp = express();

// We mount the Express app at /api/express so that 
// it strips the prefix and passes the clean route (e.g. /auth) to Express.
vercelApp.use('/api/express', app);

export default vercelApp;
