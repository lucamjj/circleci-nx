/**
 * This is not a production server!
 * This is only a minimal API server to get started.
 */

import * as express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJSDoc from 'swagger-jsdoc';
// import * as helmet from 'helmet';
// import * as morgan from 'morgan';
import * as path from 'path';
import * as cors from 'cors';
import router from '../src/app/routes';
const { questions, people } = router;

// import { getMapOf } from '@mono-nx-test-with-nextjs/api/utils';
// import data from '@mono-nx-test-with-nextjs/api/assets'; // The API data
// import {
//   FACETS_ROUTE,
//   DIRECTORS_ROUTE,
//   MOVIES_ROUTE,
//   ACTORS_ROUTE,
// } from '@mono-nx-test-with-nextjs/api/constants';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tammy API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3333',
      },
    ],
  },
  host: 'http://localhost:3333',
  basePath: '/',
  apis: [
    path.resolve(__dirname, '../../../apps/api/src/app/routes/**/index.ts'),
  ],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
// http://localhost:3333/swagger-doc
const swaggerSpec = swaggerJSDoc(options);

// const maps = getMapOf(data);
// const { mapOfMovies } = maps;

const app = express();

// app.use((req, res, next) => {
//   req['context'] = { maps };
//   next();
// });

// app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.use(morgan('tiny'));
app.use(cors());
app.use(
  '/swagger-doc',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use(people.path, people.route);
app.use(questions.path, questions.route);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on('error', console.error);

export { app, server };
