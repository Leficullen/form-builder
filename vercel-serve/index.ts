import express from 'express';
import { app } from '../backend/src/app';

const vercelApp = express();


vercelApp.use('/api/express', app);

export default vercelApp;
