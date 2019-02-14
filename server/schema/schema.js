const graphql = require('graphql');
const Boss = require('../models/boss');
const Tradable = require('../models/tradable');
const Location = require('../models/location');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const BossType = new GraphQLObjectType({
  name: 'Boss',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    health: { type: GraphQLInt },
    location: {
      type: LocationType,
      resolve(parent, args) {
        return Location.findById(parent.locationId);
      }
    },
    reward: { type: GraphQLString }
  })
});

const TradableType = new GraphQLObjectType({
  name: 'Tradable',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    locations: {
      type: new GraphQLList(LocationType),
      resolve(parent, args) {
        return Location.find({ _id: parent.locationIds });
      }
    },
    found: { type: GraphQLInt }
  })
});

const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    tradables: {
      type: new GraphQLList(TradableType),
      resolve(parent, args) {
        return Tradable.find({ locationIds: parent.id });
      }
    },
    bosses: {
      type: new GraphQLList(BossType),
      resolve(parent, args) {
        return Boss.find({ locationId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    boss: {
      type: BossType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Boss.findById(args.id);
      }
    },
    tradable: {
      type: TradableType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Tradable.findById(args.id);
      }
    },
    location: {
      type: LocationType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Location.findById(args.id);
      }
    },
    bosses: {
      type: new GraphQLList(BossType),
      resolve(parent, args) {
        return Boss.find();
      }
    },
    tradables: {
      type: new GraphQLList(TradableType),
      resolve(parent, args) {
        return Tradable.find();
      }
    },
    locations: {
      type: new GraphQLList(LocationType),
      resolve(parent, args) {
        return Location.find();
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBoss: {
      type: BossType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        health: { type: new GraphQLNonNull(GraphQLInt) },
        locationId: { type: new GraphQLNonNull(GraphQLString) },
        reward: { type: GraphQLString }
      },
      resolve(parent, args) {
        let boss = new Boss({
          name: args.name,
          health: args.health,
          locationId: args.locationId,
          reward: args.reward
        });
        return boss.save();
      }
    },
    addTradable: {
      type: TradableType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        locationIds: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
        found: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let tradable = new Tradable({
          name: args.name,
          locationIds: args.locationIds,
          found: args.found
        });
        return tradable.save();
      }
    },
    addLocation: {
      type: LocationType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let location = new Location({
          name: args.name
        });
        return location.save();
      }
    },
    editBoss: {
      type: BossType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        health: { type: GraphQLInt },
        locationId: { type: GraphQLString },
        reward: { type: GraphQLString }
      },
      resolve(parent, args){
        return Boss.findByIdAndUpdate(args.id, args, {new: true});
      }
    },
    editTradable: {
      type: TradableType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        locationIds: { type: new GraphQLList(GraphQLString) },
        found: { type: GraphQLInt }
      },
      resolve(parent, args){
        return Tradable.findByIdAndUpdate(args.id, args, {new: true});
      }
    },
    editLocation: {
      type: LocationType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString }
      },
      resolve(parent, args){
        return Location.findByIdAndUpdate(args.id, args, {new: true});
      }
    },
    deleteBoss: {
      type: BossType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Boss.findByIdAndRemove(args.id);
      }
    },
    deleteTradable: {
      type: TradableType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Tradable.findByIdAndRemove(args.id);
      }
    },
    deleteLocation: {
      type: LocationType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Location.findByIdAndRemove(args.id);
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});