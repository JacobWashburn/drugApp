import feathersClient, { BaseModel } from '../api/feathers-client.js';

// import { diff } from "@iy4u/common-client-lib";

class Users extends BaseModel {
	static modelName = 'Users';

	constructor(options) {
		super(options);
	}

	// static diffOnPatch(data) {
	//   console.log("diffOnPatch data", data);
	//   if (data["_id"]) {
	//     const originalObject = Users.store.state["users"].keyedById[data["_id"]];
	//     return diff(originalObject, data);
	//   } else {
	//     return data;
	//   }
	// }
}

const servicePath = 'users';
const options = {
	service: feathersClient.service(servicePath),
	servicePath
	// idField: id  -  optional field for setting a specific key for storing under in the store. default: id
};

// const beforeHook = context => {
//   // eslint-disable-next-line no-console
//   console.log('------------->>>> beforeHook - context.method:', context.method);
//   console.log('------------->>>> beforeHook - context.params:', context.params);
//   console.log('------------->>>> beforeHook - context.data:', context.data);
// };

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
	before: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},
	after: {
		all: [(context) => console.log('users', context.method, context.result)],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},
	error: {
		all: [(ctx) => console.log(ctx)],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
});

feathersClient.service(servicePath).model = new Users(options);

export default feathersClient.service(servicePath).model;
