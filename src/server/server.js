import { GraphQLServer } from 'graphql-yoga';
import fetch from 'node-fetch';
import getFlags from './logic/getFlags';

const typeDefs = `
  type Query {
    flags(projKey: String!): [Flag!]!
  }
  
  type Flag {
    name: String!
    kind: String!
    key: String!
    version: Int!
    environments: [Environment!]!
  }
  
  type Environment {
    name: String!
    killSwitch: Boolean
  }
`;

const resolvers = {
  Query: {
    flags: async (_, { projKey }, context) => {
      try {
        return getFlags(projKey);
      } catch (e) {
        return `An error has occurred: ${e}`;
      }
    },
  },
  Flag: {
    name: ({ name }) => name,
    kind: ({ kind }) => kind,
    key: ({ key }) => key,
    version: ({ _version: version }) => version,
    environments: async ({ environments }, args, context) => {
      const result = [];
      for (let key in environments) {
        let env = {};
        env.name = key;
        env.killSwitch = environments[key].on;
        result.push(env);
      }
      return result;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
