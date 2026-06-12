import { gql } from "apollo-server-express";

export const adminSchema = gql`
  type Query {
    _empty: String
  }

  type LoginResponse {
    success: Boolean!
    message: String!
  }

  type Mutation {
    login(
      email: String!
      password: String!
    ): LoginResponse!
  }
`;