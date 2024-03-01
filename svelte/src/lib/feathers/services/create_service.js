import feathersClient, { BaseModel } from '../api/feathers-client.js';
import { auth } from '../index.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
const createService = ({ name, servicePath }) => {
	let serviceClass = new Function(
		'parent',
		`return class ${name} extends parent {constructor(args) {super(args)}}`
	)(BaseModel);
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
	const created = (context) => {
		if (context.self.model.servicePath !== 'users') {
			context.data['createdBy'] = auth.user.email;
			context.data['createdAt'] = dayjs().format('YYYY/MM/DD HH:mm:ss');
		}
		return context;
	};
	const updated = (context) => {
		context.data['updatedBy'] = auth.user.email;
		context.data['updatedAt'] = dayjs().format('YYYY/MM/DD HH:mm:ss');
		return context;
	};

	// Setup client-side Feathers hooks.
	feathersClient.service(servicePath).hooks({
		before: {
			all: [],
			find: [],
			get: [],
			create: [created],
			update: [],
			patch: [updated],
			remove: []
		},
		after: {
			all: [],
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

	feathersClient.service(servicePath).model = new serviceClass(options);
	return feathersClient.service(servicePath).model;
};

export default createService;
