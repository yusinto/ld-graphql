import { ApolloServer, gql } from 'apollo-server';
import getFlags from './logic/getFlags';
import getProjects from './logic/getProjects';
import toggleKillSwitch from './logic/toggleKillSwitch';

const typeDefs = gql`
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

  type Mutation {
    toggleKillSwitch(projKey: String!, envKey: String!, flagKey: String!): Flag
  }
`;

const resolvers = {
  Mutation: {
    toggleKillSwitch: async (_, { projKey, envKey, flagKey }) => {
      try {
        return toggleKillSwitch(projKey, envKey, flagKey);
      } catch (e) {
        return `An error has occurred: ${e}`;
      }
    },
  },
  Query: {
    projects: () => {
      try {
        return getProjects();
      } catch (e) {
        return `An error has occurred: ${e}`;
      }
    },
    flags: (_, { projKey }) => {
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

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(() => {
  console.log('Server is running on localhost:4000');
});

export default server.httpServer;
