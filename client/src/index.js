import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Routes from './routes'

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, from } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import 'semantic-ui-css/semantic.min.css';

const httpLink = createHttpLink({ uri: 'http://localhost:8080/graphql' });

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      xtoken: localStorage.getItem('token') || "",
      xrefreshtoken: localStorage.getItem('refreshToken') || "",
    }
  })
  return forward(operation)
});

const afterwareLink = new ApolloLink((operation, forward) => {
  console.log(forward(operation))
  return forward(operation).map((response) => {
    
    const context = operation.getContext();
    const { response: { headers } } = context;
    const token = headers.get('xtoken')
    console.log(token)
    return response;
  })
})

const client = new ApolloClient({
  link: from([middlewareLink, afterwareLink, httpLink]),
  cache: new InMemoryCache()
});

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
