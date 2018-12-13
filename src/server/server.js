import { GraphQLServer } from 'graphql-yoga';
import fetch from 'node-fetch';
import getFlags from './logic/getFlags';
import getProjects from './logic/getProjects';

const typeDefs = `
  type Query {
    projects: [Project!]!
    flags(projKey: String!): [Flag!]!
  }
  
  type Project {
    name: String!
    key: String!
    environments: [Environment!]!
  }
  
  type Flag {
    name: String!
    kind: String!
    key: String!
    version: Int!
    environments: [Environment!]!
  }
  
  type Environment {
    key: String!
    name: String
    killSwitch: Boolean
    color: String
  }
`;

const resolvers = {
  Query: {
    projects: async () => {
      try {
        return getProjects();
      } catch (e) {
        return `An error has occurred: ${e}`;
      }
    },
    flags: async (_, { projKey }) => {
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
    environments: ({ environments }) => {
      return Object.keys(environments).map(key => ({
        key,
        killSwitch: environments[key].on,
      }));
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
