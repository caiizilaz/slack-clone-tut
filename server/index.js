import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const PORT = 8080;

var app = express();

const graphqlEndpoint = '/graphql';

app.use(graphqlEndpoint, bodyParser.json(), graphqlExpress({
  schema,
  context: {
    models,
    user: {
      id: 1
    }
  },
}));

app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }));
models.sequelize.sync().then(() => { //{ force: true }
  app.listen(PORT);
})