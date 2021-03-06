import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import models from './models';
import { refreshTokens } from './auth';

const SECRET = 'a7fkaa'
const SECRET2 = 'a7fkaajdx'

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const PORT = 8080;

var app = express();
app.use(cors('*'))

const addUser = async (req, res, next) => {
  const token = req.headers['xtoken'];
  // console.log(`token: ${req.headers['xtoken']},${req.headers['xrefreshtoken']}`)
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['xrefreshtoken'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      console.log(newTokens)
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'xtoken, xrefreshtoken');
        res.set('xtoken', newTokens.token);
        res.set('xrefreshtoken', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUser);

const graphqlEndpoint = '/graphql';

app.use(graphqlEndpoint, bodyParser.json(), 
graphqlExpress(req=>({
  schema,
  context: {
    models,
    user: req.user,
    SECRET,
    SECRET2,
  },
})),);

app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }));
models.sequelize.sync().then(() => { //{ force: true }
  app.listen(PORT);
})
