import express from 'express';
import routes from './routes/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  return res.status(200).send('Hello World');
});

app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
