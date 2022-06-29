import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import Sanky from './components/sankey';
import Header from './components/header';

const client = new ApolloClient({
  uri: "https://graphql-dev-query.herokuapp.com/graphql/",
  cache: new InMemoryCache()
})

function App() {
  return (
    <div className="bg-dark white">
      <ApolloProvider client={client}>
        <Header />
        <Sanky />
      </ApolloProvider>
    </div>
  );
}

export default App;
