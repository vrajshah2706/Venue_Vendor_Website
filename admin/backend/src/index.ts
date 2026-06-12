import "reflect-metadata";
import express from "express";
import cors from "cors";

import { ApolloServer } from "apollo-server-express";

import { AppDataSource } from "./data-source";

import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

const app = express();

const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

async function startServer() {

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/graphql",
  });
  
  await AppDataSource.initialize();

  console.log("Data Source has been initialized!");

 
  app.listen(PORT, () => {
    console.log(
      `Admin Server running on port ${PORT}`
    );

    console.log(
      `GraphQL endpoint: http://localhost:${PORT}/graphql`
    );
  });
}

startServer().catch((error) => {
  console.log(
    "Error during startup:",
    error
  );
});