import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import predictRouter from './routers/predictRouter';

dotenv.config();
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(bodyParser.json());

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

app.use('/predict', predictRouter);
