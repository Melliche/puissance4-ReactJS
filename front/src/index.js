import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ApolloClient, InMemoryCache, gql, ApolloProvider, createHttpLink } from "@apollo/client";
import { AppProvider } from "./context/appContext";
import { setContext } from '@apollo/client/link/context';

// http://localhost:3000
// mongodb://admin:password@localhost:27017

// const client = new ApolloClient({
//   uri: "http://localhost:3101/graphql",
//   cache: new InMemoryCache(),
// });


const httpLink = createHttpLink({
  uri: "http://localhost:3101/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  // console.log(headers)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <AppProvider />
  </ApolloProvider>
);

